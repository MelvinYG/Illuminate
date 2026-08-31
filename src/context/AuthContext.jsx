import { createContext, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { io } from 'socket.io-client';
import PropTypes from "prop-types";
import apiRequest from "../lib/apiRequest";
import { logger } from "../lib/logger";

export const AuthContext = createContext();

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:3001";
const READ_FLUSH_INTERVAL_MS = 5 * 60 * 1000;

const pendingReadsKey = (userId) => `pendingNotificationReads:${userId}`;

const loadCachedUser = () => {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        return user && typeof user === "object" ? user : null;
    } catch {
        localStorage.removeItem("user");
        logger.warn("auth_cache_invalid");
        return null;
    }
};

const loadPendingReads = (userId) => {
    try {
        const stored = JSON.parse(localStorage.getItem(pendingReadsKey(userId)) || "[]");
        return new Set(Array.isArray(stored) ? stored.filter((id) => typeof id === "string") : []);
    } catch {
        return new Set();
    }
};

const persistPendingReads = (userId, ids) => {
    if (!userId) return;
    if (ids.size === 0) localStorage.removeItem(pendingReadsKey(userId));
    else localStorage.setItem(pendingReadsKey(userId), JSON.stringify([...ids]));
};

const mergeNotifications = (current, incoming, pendingReadIds) => {
    const byId = new Map(current.map((notification) => [notification.id, notification]));
    for (const notification of incoming) {
        if (!notification?.id) continue;
        const previous = byId.get(notification.id);
        const optimisticallyRead = pendingReadIds.has(notification.id);
        const readAt = previous?.readAt || notification.readAt || (
            optimisticallyRead ? new Date().toISOString() : null
        );
        byId.set(notification.id, {
            ...previous,
            ...notification,
            readAt,
            isRead: Boolean(readAt),
        });
    }
    return [...byId.values()].sort(
        (left, right) => new Date(right.createdAt) - new Date(left.createdAt),
    );
};

const announceNotification = (notification) => {
    new Audio('/notification.mp3').play().catch(() => {});
    if (
        document.visibilityState === "hidden" &&
        "Notification" in window &&
        window.Notification.permission === "granted"
    ) {
        new window.Notification(notification.title || "New energy recommendation", {
            body: notification.message,
        });
        logger.info("browser_notification_displayed");
    }
};

export const AuthContextProvider = ({ children }) => {
    const authVersion = useRef(0);
    const [currentUser, setCurrentUser] = useState(loadCachedUser);
    const [authLoading, setAuthLoading] = useState(true);
    const [notifications, setNotifications] = useState([]);
    const [notificationsLoading, setNotificationsLoading] = useState(false);
    const [notificationsError, setNotificationsError] = useState("");
    const pendingReadIds = useRef(new Set());
    const readFlushPromises = useRef(new Map());
    const authenticatedUserId = useRef(null);
    
    // Initialize darkMode state based on localStorage (def black)
    const [darkMode, setDarkMode] = useState(() => {
        const storedValue = localStorage.getItem("darkMode");
        return storedValue === null ? true : storedValue === "true";
    });
    
    const updateUser = (data) => {
        authVersion.current += 1;
        setCurrentUser(data);
        setAuthLoading(false);
        logger.info("auth_state_updated", { authenticated: Boolean(data) });
    };

    // Handle dark mode changes and save preference in localStorage
    const toggleDarkMode = (isDarkMode) => {
        setDarkMode(isDarkMode);
    };

    useEffect(() => {
        const version = authVersion.current;
        apiRequest.get("/user")
            .then(({ data }) => {
                if (authVersion.current === version) {
                    setCurrentUser(data);
                    logger.info("session_bootstrap_completed", { authenticated: true });
                }
            })
            .catch((error) => {
                const status = error.response?.status;
                if (authVersion.current === version && (status === 401 || status === 403)) {
                    setCurrentUser(null);
                    localStorage.removeItem("user");
                    logger.info("session_bootstrap_completed", { authenticated: false });
                }
            })
            .finally(() => {
                if (authVersion.current === version) setAuthLoading(false);
            });
    }, []);

    const flushNotificationReads = useCallback(async () => {
        const userId = authenticatedUserId.current;
        if (!userId) return null;
        if (readFlushPromises.current.has(userId)) {
            return readFlushPromises.current.get(userId);
        }

        const queue = pendingReadIds.current;
        const ids = [...queue];
        if (!userId || ids.length === 0) return null;

        logger.info("notification_read_batch_started", { notificationCount: ids.length });
        const request = apiRequest.patch("/notifications/read", { ids });
        readFlushPromises.current.set(userId, request);
        try {
            const { data } = await request;
            const readTimes = new Map(data.updated.map((item) => [item.id, item.readAt]));
            ids.forEach((id) => queue.delete(id));
            persistPendingReads(userId, queue);
            if (authenticatedUserId.current === userId) {
                setNotifications((current) => current.map((notification) => {
                    const readAt = readTimes.get(notification.id);
                    return readAt
                        ? { ...notification, readAt, isRead: true }
                        : notification;
                }));
            }
            logger.info("notification_read_batch_completed", {
                notificationCount: ids.length,
                updatedCount: data.updated.length,
            });
            return data;
        } catch (error) {
            persistPendingReads(userId, queue);
            logger.warn("notification_read_batch_failed", {
                notificationCount: ids.length,
                statusCode: error.response?.status,
            });
            return null;
        } finally {
            readFlushPromises.current.delete(userId);
        }
    }, []);

    const markNotificationRead = useCallback((notificationId) => {
        if (typeof notificationId !== "string") return;
        pendingReadIds.current.add(notificationId);
        persistPendingReads(authenticatedUserId.current, pendingReadIds.current);
        const readAt = new Date().toISOString();
        setNotifications((current) => current.map((notification) => (
            notification.id === notificationId
                ? { ...notification, readAt: notification.readAt || readAt, isRead: true }
                : notification
        )));
        logger.info("notification_read_queued");
    }, []);

    const upsertNotification = useCallback((notification) => {
        setNotifications((current) => mergeNotifications(
            current,
            [notification],
            pendingReadIds.current,
        ));
    }, []);

    useEffect(() => {
        if (authLoading) return undefined;
        if (!currentUser?._id) {
            authenticatedUserId.current = null;
            pendingReadIds.current = new Set();
            setNotifications([]);
            setNotificationsLoading(false);
            setNotificationsError("");
            return undefined;
        }

        const userId = currentUser._id;
        let active = true;
        authenticatedUserId.current = userId;
        pendingReadIds.current = loadPendingReads(userId);
        setNotifications([]);
        setNotificationsLoading(true);
        setNotificationsError("");

        const loadNotifications = async ({ showLoading = false } = {}) => {
            if (showLoading && active) setNotificationsLoading(true);
            try {
                const { data } = await apiRequest.get("/notifications");
                if (!active) return;
                setNotifications((current) => mergeNotifications(
                    current,
                    data.notifications,
                    pendingReadIds.current,
                ));
                setNotificationsError("");
                logger.info("notifications_hydrated", {
                    notificationCount: data.notifications.length,
                    unreadCount: data.unreadCount,
                });
            } catch (error) {
                if (active) {
                    setNotificationsError(
                        error.response?.data?.message || "Unable to load recommendations",
                    );
                }
            } finally {
                if (active) setNotificationsLoading(false);
            }
        };

        void loadNotifications({ showLoading: true });

        const socket = io(SOCKET_URL, {
            autoConnect: false,
            withCredentials: true,
        });
        const handleConnect = () => {
            logger.info("socket_connected", { socketId: socket.id });
            void loadNotifications();
        };
        const handleDisconnect = (reason) => {
            logger.info("socket_disconnected", { reason });
        };
        const handleConnectError = (error) => {
            logger.warn("socket_connection_failed", {
                errorName: error?.name || "Error",
            });
        };
        const handleNotification = (notification) => {
            if (!active) return;
            setNotifications((current) => mergeNotifications(
                current,
                [notification],
                pendingReadIds.current,
            ));
            logger.info("notification_received");
            announceNotification(notification);
        };
        const handleReads = ({ updated = [] }) => {
            if (!active) return;
            const readTimes = new Map(updated.map((item) => [item.id, item.readAt]));
            setNotifications((current) => current.map((notification) => {
                const readAt = readTimes.get(notification.id);
                return readAt ? { ...notification, readAt, isRead: true } : notification;
            }));
            logger.info("notification_reads_received", { updatedCount: updated.length });
        };

        socket.on("connect", handleConnect);
        socket.on("disconnect", handleDisconnect);
        socket.on("connect_error", handleConnectError);
        socket.on("notification", handleNotification);
        socket.on("notifications:read", handleReads);
        socket.connect();

        const flushInterval = window.setInterval(() => {
            void flushNotificationReads();
        }, READ_FLUSH_INTERVAL_MS);

        return () => {
            active = false;
            window.clearInterval(flushInterval);
            void flushNotificationReads();
            socket.off("connect", handleConnect);
            socket.off("disconnect", handleDisconnect);
            socket.off("connect_error", handleConnectError);
            socket.off("notification", handleNotification);
            socket.off("notifications:read", handleReads);
            socket.disconnect();
        };
    }, [authLoading, currentUser?._id, flushNotificationReads]);

    useEffect(() => {
        if (currentUser) localStorage.setItem("user", JSON.stringify(currentUser));
        else localStorage.removeItem("user");
    }, [currentUser]);

    useEffect(() => {
        localStorage.setItem("darkMode", darkMode);
        const rootDiv = document.getElementById("root");
        if (darkMode) {
            rootDiv.classList.add("dark");
        } else {
            rootDiv.classList.remove("dark");
        }
    }, [darkMode]); // Run this effect when darkMode changes

    // Logout function
    const logout = () => {
        authVersion.current += 1;
        setCurrentUser(null); // Clear current user state
        setAuthLoading(false);
        localStorage.removeItem("user"); // Remove user from localStorage
        setNotifications([]); // Optionally clear notifications or keep them
        pendingReadIds.current = new Set();
        authenticatedUserId.current = null;
        logger.info("auth_state_updated", { authenticated: false });
    };

    const unreadCount = useMemo(
        () => notifications.filter((notification) => !notification.isRead).length,
        [notifications],
    );

    return (
        <AuthContext.Provider value={{
            currentUser,
            authLoading,
            updateUser,
            darkMode,
            toggleDarkMode,
            notifications,
            notificationsLoading,
            notificationsError,
            unreadCount,
            markNotificationRead,
            upsertNotification,
            flushNotificationReads,
            logout,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

AuthContextProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

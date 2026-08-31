import { useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import apiRequest from '../../lib/apiRequest';
import formatNotificationTimestamp from '../../lib/formatNotificationTimestamp';
import './notificationsPage.css';

const NotificationDetailPage = () => {
    const { notificationId } = useParams();
    const {
        notifications,
        markNotificationRead,
        upsertNotification,
    } = useContext(AuthContext);
    const contextNotification = notifications.find((item) => item.id === notificationId);
    const [fetchedNotification, setFetchedNotification] = useState(null);
    const [detailLoading, setDetailLoading] = useState(!contextNotification);
    const [detailError, setDetailError] = useState("");
    const notification = contextNotification || fetchedNotification;

    useEffect(() => {
        if (contextNotification) {
            setFetchedNotification(contextNotification);
            setDetailLoading(false);
            setDetailError("");
            return undefined;
        }

        let active = true;
        setDetailLoading(true);
        setDetailError("");
        apiRequest.get(`/notifications/${notificationId}`)
            .then(({ data }) => {
                if (!active) return;
                setFetchedNotification(data);
                upsertNotification(data);
            })
            .catch((error) => {
                if (!active) return;
                setDetailError(
                    error.response?.status === 404
                        ? "Notification not found."
                        : error.response?.data?.message || "Unable to load notification",
                );
            })
            .finally(() => {
                if (active) setDetailLoading(false);
            });

        return () => {
            active = false;
        };
    }, [contextNotification, notificationId, upsertNotification]);

    useEffect(() => {
        if (notification?.id && !notification.isRead) {
            markNotificationRead(notification.id);
        }
    }, [notification?.id, notification?.isRead, markNotificationRead]);

    if (detailLoading) {
        return <div className="notification-detail">Loading notification…</div>;
    }

    if (detailError || !notification) {
        return (
            <div className="notification-detail">
                <p>{detailError || "Notification not found."}</p>
                <Link to="/notifications">Back to notifications</Link>
            </div>
        );
    }

    return (
        <article className="notification-detail">
            <Link to="/notifications">← Back to notifications</Link>
            <h2>{notification.title}</h2>
            <time dateTime={notification.createdAt}>
                {formatNotificationTimestamp(notification.createdAt)}
            </time>
            <p>{notification.message}</p>
        </article>
    );
};

export default NotificationDetailPage;

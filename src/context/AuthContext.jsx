import { createContext, useEffect, useState } from "react";
import { io } from 'socket.io-client';

export const AuthContext = createContext();

const socket = io('http://localhost:3001');

export const AuthContextProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(
        JSON.parse(localStorage.getItem("user")) || null
    );
    
    // Initialize darkMode state based on localStorage
    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    const updateUser = (data) => {
        setCurrentUser(data);
    };

    // Handle dark mode changes and save preference in localStorage
    const toggleDarkMode = (isDarkMode) => {
        setDarkMode(isDarkMode);
    };

    const [notifications, setNotifications] = useState(() => {
        const savedNotifications = localStorage.getItem('notifications');
        return savedNotifications ? JSON.parse(savedNotifications) : [];
    });

    useEffect(() => {
        socket.on('notification', (notification) => {
            setNotifications((prev) => {
                const updatedNotifications = [...prev, notification];
                localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
                return updatedNotifications;
            });
            playNotificationSound();
        });

        return () => {
            socket.off('notification');
        };
    }, []);

    const playNotificationSound = () => {
        const audio = new Audio('./notification.mp3'); 
        audio.play();
    };

    useEffect(() => {
        localStorage.setItem("user", JSON.stringify(currentUser));
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
        setCurrentUser(null); // Clear current user state
        localStorage.removeItem("user"); // Remove user from localStorage
        setNotifications([]); // Optionally clear notifications or keep them
        localStorage.removeItem('notifications'); // Optionally clear notifications from localStorage
    };

    return (
        <AuthContext.Provider value={{ currentUser, updateUser, darkMode, toggleDarkMode, notifications, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
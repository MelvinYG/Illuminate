import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

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

    return (
        <AuthContext.Provider value={{ currentUser, updateUser, darkMode, toggleDarkMode }}>
            {children}
        </AuthContext.Provider>
    );
};
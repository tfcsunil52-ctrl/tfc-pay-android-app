import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "../types";

interface UseThemeReturn {
    isDarkMode: boolean;
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

export function useTheme(initialTheme: ThemeMode = "dark"): UseThemeReturn {
    // Determine initial state from localStorage or fallback
    const getInitialTheme = (): ThemeMode => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("tfc_theme") as ThemeMode;
            if (savedTheme === "dark" || savedTheme === "light") {
                return savedTheme;
            }
        }
        return initialTheme;
    };

    const [theme, setThemeState] = useState<ThemeMode>(getInitialTheme);

    const isDarkMode = theme === "dark";

    useEffect(() => {
        // Save to localStorage
        localStorage.setItem("tfc_theme", theme);

        // Apply theme class to document
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, [isDarkMode]);

    const toggleTheme = useCallback(() => {
        setThemeState((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    const setTheme = useCallback((newTheme: ThemeMode) => {
        setThemeState(newTheme);
    }, []);

    return {
        isDarkMode,
        theme,
        toggleTheme,
        setTheme,
    };
}

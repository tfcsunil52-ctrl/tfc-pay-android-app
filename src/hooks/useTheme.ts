import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "../types";

interface UseThemeReturn {
    isDarkMode: boolean;
    theme: ThemeMode;
    toggleTheme: () => void;
    setTheme: (theme: ThemeMode) => void;
}

export function useTheme(initialTheme: ThemeMode = "dark"): UseThemeReturn {
    const [theme, setThemeState] = useState<ThemeMode>(initialTheme);

    const isDarkMode = theme === "dark";

    useEffect(() => {
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

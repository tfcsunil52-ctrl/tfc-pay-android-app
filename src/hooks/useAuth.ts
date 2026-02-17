import { useState, useEffect } from 'react';

export interface User {
    id: string;
    identifier: string; // email, phone, or userID
    type: 'email' | 'mobile' | 'userid';
    pin?: string; // 4-digit PIN
}

interface AuthState {
    isAuthenticated: boolean;
    user: User | null;
    rememberMe?: boolean;
    hasPinSet: boolean;
    appLockEnabled: boolean;
    biometricEnabled: boolean;
}

const getStoredAuth = (): AuthState => {
    const hasPinSet = !!localStorage.getItem('tfc_pin');
    const appLockEnabled = localStorage.getItem('tfc_app_lock_enabled') === 'true';
    const biometricEnabled = localStorage.getItem('tfc_biometric_enabled') === 'true';

    // Check localStorage first (remember me = true)
    const localStored = localStorage.getItem('tfc_auth');
    if (localStored) {
        try {
            const parsed = JSON.parse(localStored);
            return { ...parsed, rememberMe: true, hasPinSet, appLockEnabled, biometricEnabled };
        } catch {
            // Invalid data, ignore
        }
    }

    // Check sessionStorage (remember me = false)
    const sessionStored = sessionStorage.getItem('tfc_auth');
    if (sessionStored) {
        try {
            const parsed = JSON.parse(sessionStored);
            return { ...parsed, rememberMe: false, hasPinSet, appLockEnabled, biometricEnabled };
        } catch {
            // Invalid data, ignore
        }
    }

    return { isAuthenticated: false, user: null, hasPinSet, appLockEnabled, biometricEnabled };
};

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>(getStoredAuth);

    // Persist to appropriate storage whenever auth state changes
    useEffect(() => {
        if (authState.isAuthenticated) {
            const dataToStore = JSON.stringify({
                isAuthenticated: authState.isAuthenticated,
                user: authState.user,
            });

            if (authState.rememberMe) {
                // Use localStorage for persistent login
                localStorage.setItem('tfc_auth', dataToStore);
                sessionStorage.removeItem('tfc_auth');
            } else {
                // Use sessionStorage for session-only login
                sessionStorage.setItem('tfc_auth', dataToStore);
                localStorage.removeItem('tfc_auth');
            }
        } else {
            // Clear both storages on logout
            localStorage.removeItem('tfc_auth');
            sessionStorage.removeItem('tfc_auth');
        }
    }, [authState]);

    const login = (identifier: string, type: 'email' | 'mobile' | 'userid', rememberMe: boolean = true) => {
        const user: User = {
            id: Math.random().toString(36).substring(7),
            identifier,
            type,
            pin: localStorage.getItem('tfc_pin') || undefined
        };

        // Store last used identifier for PIN login
        localStorage.setItem('tfc_last_identifier', identifier);
        localStorage.setItem('tfc_last_type', type);

        setAuthState(prev => ({
            ...prev,
            isAuthenticated: true,
            user,
            rememberMe,
            hasPinSet: !!user.pin,
        }));
    };

    const setPin = (pin: string) => {
        localStorage.setItem('tfc_pin', pin);
        // Auto-enable app lock when PIN is set
        localStorage.setItem('tfc_app_lock_enabled', 'true');
        if (authState.user) {
            const updatedUser = { ...authState.user, pin };
            setAuthState(prev => ({ ...prev, user: updatedUser, hasPinSet: true, appLockEnabled: true }));
        } else {
            setAuthState(prev => ({ ...prev, hasPinSet: true, appLockEnabled: true }));
        }
    };

    const changePin = (newPin: string) => {
        localStorage.setItem('tfc_pin', newPin);
        if (authState.user) {
            const updatedUser = { ...authState.user, pin: newPin };
            setAuthState(prev => ({ ...prev, user: updatedUser, hasPinSet: true }));
        }
    };

    const removePin = () => {
        localStorage.removeItem('tfc_pin');
        localStorage.setItem('tfc_app_lock_enabled', 'false');
        localStorage.setItem('tfc_biometric_enabled', 'false');
        if (authState.user) {
            const updatedUser = { ...authState.user, pin: undefined };
            setAuthState(prev => ({
                ...prev,
                user: updatedUser,
                hasPinSet: false,
                appLockEnabled: false,
                biometricEnabled: false,
            }));
        } else {
            setAuthState(prev => ({
                ...prev,
                hasPinSet: false,
                appLockEnabled: false,
                biometricEnabled: false,
            }));
        }
    };

    const setAppLockEnabled = (enabled: boolean) => {
        localStorage.setItem('tfc_app_lock_enabled', enabled ? 'true' : 'false');
        if (!enabled) {
            // Disable biometric when app lock is turned off
            localStorage.setItem('tfc_biometric_enabled', 'false');
            setAuthState(prev => ({ ...prev, appLockEnabled: false, biometricEnabled: false }));
        } else {
            setAuthState(prev => ({ ...prev, appLockEnabled: true }));
        }
    };

    const setBiometricEnabled = (enabled: boolean) => {
        localStorage.setItem('tfc_biometric_enabled', enabled ? 'true' : 'false');
        setAuthState(prev => ({ ...prev, biometricEnabled: enabled }));
    };

    const logout = () => {
        // Keep tfc_pin, tfc_app_lock_enabled, tfc_biometric_enabled on device
        setAuthState(prev => ({
            isAuthenticated: false,
            user: null,
            hasPinSet: !!localStorage.getItem('tfc_pin'),
            appLockEnabled: prev.appLockEnabled,
            biometricEnabled: prev.biometricEnabled,
        }));
    };

    const signup = (identifier: string, type: 'email' | 'mobile' | 'userid', rememberMe: boolean = true, pin?: string) => {
        if (pin) {
            localStorage.setItem('tfc_pin', pin);
            localStorage.setItem('tfc_app_lock_enabled', 'true');
        }

        // Store last used identifier for PIN login
        localStorage.setItem('tfc_last_identifier', identifier);
        localStorage.setItem('tfc_last_type', type);

        const user: User = {
            id: Math.random().toString(36).substring(7),
            identifier,
            type,
            pin
        };
        setAuthState({
            isAuthenticated: true,
            user,
            rememberMe,
            hasPinSet: !!pin,
            appLockEnabled: !!pin,
            biometricEnabled: false,
        });
    };

    return {
        isAuthenticated: authState.isAuthenticated,
        user: authState.user,
        hasPinSet: authState.hasPinSet,
        appLockEnabled: authState.appLockEnabled,
        biometricEnabled: authState.biometricEnabled,
        login,
        logout,
        signup,
        setPin,
        changePin,
        removePin,
        setAppLockEnabled,
        setBiometricEnabled,
    };
};

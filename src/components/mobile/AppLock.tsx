
import { useState, useEffect } from "react";
import { Lock, Fingerprint, Delete, ArrowRight, UserCircle, ShieldCheck } from "lucide-react";

interface AppLockProps {
    onUnlock: () => void;
    onSwitchAccount?: () => void;
    mode?: 'unlock' | 'setup';
    onPinSet?: (pin: string) => void;
    savedPin?: string | null;
    biometricEnabled?: boolean;
}

const AppLock = ({
    onUnlock,
    onSwitchAccount,
    mode = 'unlock',
    onPinSet,
    savedPin = localStorage.getItem('tfc_pin'),
    biometricEnabled = false,
}: AppLockProps) => {
    const [pin, setPin] = useState<string>("");
    const [confirmPin, setConfirmPin] = useState<string>("");
    const [isConfirming, setIsConfirming] = useState(false);
    const [error, setError] = useState<string>("");
    const [biometricActive, setBiometricActive] = useState(false);
    const [biometricSuccess, setBiometricSuccess] = useState(false);

    // Auto-trigger biometric on mount when enabled and in unlock mode
    useEffect(() => {
        if (mode === 'unlock' && biometricEnabled) {
            const timer = setTimeout(() => {
                handleBiometricAuth();
            }, 500);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleNumberClick = (num: number) => {
        if (pin.length < 4) {
            const newPin = pin + num;
            setPin(newPin);
            setError("");

            if (newPin.length === 4) {
                if (mode === 'unlock') {
                    verifyPin(newPin);
                } else if (mode === 'setup') {
                    if (!isConfirming) {
                        // First PIN entered, move to confirmation
                        setTimeout(() => {
                            setConfirmPin(newPin);
                            setPin("");
                            setIsConfirming(true);
                        }, 300);
                    } else {
                        // Confirming PIN
                        if (newPin === confirmPin) {
                            onPinSet?.(newPin);
                            onUnlock();
                        } else {
                            setError("PINs do not match. Restarting...");
                            setPin("");
                            setConfirmPin("");
                            setIsConfirming(false);
                        }
                    }
                }
            }
        }
    };

    const handleDelete = () => {
        setPin(pin.slice(0, -1));
        setError("");
    };

    const verifyPin = (enteredPin: string) => {
        if (enteredPin === savedPin) {
            setTimeout(onUnlock, 100);
        } else {
            setError("Incorrect PIN. Try again.");
            setPin("");
        }
    };

    const handleBiometricAuth = () => {
        if (mode === 'unlock') {
            setBiometricActive(true);
            // Simulate biometric scanning animation
            setTimeout(() => {
                setBiometricSuccess(true);
                setTimeout(() => {
                    onUnlock();
                }, 600);
            }, 1200);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-background flex flex-col items-center justify-between p-6 pb-12 animate-in fade-in duration-300">
            <div className="flex-1 flex flex-col items-center justify-center w-full max-w-sm">
                {/* Header Icon */}
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-6 shadow-inner transition-all duration-500 ${biometricActive
                    ? (biometricSuccess ? 'bg-green-600/20 dark:bg-green-500/20 scale-110' : 'bg-green-600/10 dark:bg-green-500/10 animate-pulse')
                    : 'bg-green-600/10 dark:bg-green-500/10'
                    }`}>
                    {mode === 'setup' ? (
                        <div className="relative">
                            <Lock className="w-10 h-10 text-green-700 dark:text-green-500" strokeWidth={1.5} />
                            <ArrowRight className="w-4 h-4 text-green-700 dark:text-green-500 absolute -right-2 top-0 bg-background rounded-full" />
                        </div>
                    ) : (biometricActive && biometricSuccess) ? (
                        <ShieldCheck className="w-10 h-10 text-green-700 dark:text-green-500 animate-in zoom-in duration-300" strokeWidth={1.5} />
                    ) : (
                        <Lock className="w-10 h-10 text-green-700 dark:text-green-500" strokeWidth={1.5} />
                    )}
                </div>

                <h2 className="text-2xl font-bold text-foreground mb-2">
                    {mode === 'setup'
                        ? (isConfirming ? "Confirm your PIN" : "Setup Secure PIN")
                        : biometricActive
                            ? (biometricSuccess ? "Verified!" : "Scanning...")
                            : "Welcome Back"
                    }
                </h2>
                <p className="text-muted-foreground text-sm mb-10 text-center px-6">
                    {mode === 'setup'
                        ? (isConfirming ? "Enter your PIN again to confirm" : "Set a 4-digit PIN for quick access to your account")
                        : biometricActive
                            ? (biometricSuccess ? "Authentication successful" : "Place your finger on the sensor")
                            : "Enter your PIN to unlock TFC Pay"
                    }
                </p>

                {/* Biometric overlay when scanning */}
                {biometricActive && !biometricSuccess && (
                    <div className="mb-10 flex flex-col items-center gap-4 animate-in fade-in duration-300">
                        <div className="w-20 h-20 rounded-full border-2 border-green-700/30 dark:border-green-500/30 flex items-center justify-center relative">
                            <div className="absolute inset-0 rounded-full border-2 border-green-700 dark:border-green-500 animate-ping opacity-30" />
                            <Fingerprint className="w-10 h-10 text-green-700 dark:text-green-500" strokeWidth={1.5} />
                        </div>
                        <button
                            onClick={() => setBiometricActive(false)}
                            className="text-sm text-muted-foreground hover:text-green-700 dark:hover:text-green-500 transition-colors"
                        >
                            Use PIN instead
                        </button>
                    </div>
                )}

                {/* PIN Display and Keypad - hidden during active biometric scan */}
                {(!biometricActive || biometricSuccess) && !biometricSuccess && (
                    <>
                        {/* PIN Display (Dots) */}
                        <div className="flex gap-4 mb-10">
                            {[0, 1, 2, 3].map((i) => (
                                <div
                                    key={i}
                                    className={`w-4 h-4 rounded-full border-2 transition-all duration-200 ${i < pin.length
                                        ? "bg-green-700 border-green-700 dark:bg-green-500 dark:border-green-500 scale-110 shadow-[0_0_10px_rgba(0,255,135,0.5)]"
                                        : "bg-transparent border-muted-foreground/30"
                                        } ${error ? "border-red-500 bg-red-500/20" : ""}`}
                                />
                            ))}
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg mb-8 animate-in slide-in-from-top-2 duration-200">
                                <p className="text-red-500 text-xs font-semibold">{error}</p>
                            </div>
                        )}

                        {/* Number Pad */}
                        <div className="grid grid-cols-3 gap-x-8 gap-y-6 w-full max-w-[280px]">
                            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                                <button
                                    key={num}
                                    onClick={() => handleNumberClick(num)}
                                    className="w-16 h-16 rounded-2xl bg-card hover:bg-muted text-2xl font-semibold text-foreground border border-border flex items-center justify-center transition-all active:scale-90 shadow-sm"
                                >
                                    {num}
                                </button>
                            ))}

                            <button
                                onClick={handleBiometricAuth}
                                className={`w-16 h-16 rounded-2xl flex items-center justify-center text-green-700 dark:text-green-500 transition-all active:scale-95 ${mode === 'setup' || !biometricEnabled ? 'opacity-0 pointer-events-none' : ''}`}
                            >
                                <Fingerprint className="w-8 h-8" />
                            </button>

                            <button
                                onClick={() => handleNumberClick(0)}
                                className="w-16 h-16 rounded-2xl bg-card hover:bg-muted text-2xl font-semibold text-foreground border border-border flex items-center justify-center transition-all active:scale-90 shadow-sm"
                            >
                                0
                            </button>

                            <button
                                onClick={handleDelete}
                                className="w-16 h-16 rounded-2xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all active:scale-95"
                                disabled={pin.length === 0}
                            >
                                <Delete className="w-7 h-7" />
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Footer Options */}
            {mode === 'unlock' && onSwitchAccount && !biometricActive && (
                <div className="w-full max-w-sm px-6">
                    <button
                        onClick={onSwitchAccount}
                        className="w-full flex items-center justify-center gap-2 py-4 text-sm font-semibold text-muted-foreground hover:text-green-700 dark:hover:text-green-500 transition-colors border border-border/50 rounded-2xl bg-card/30"
                    >
                        <UserCircle className="w-4 h-4" />
                        Sign in with different account
                    </button>
                </div>
            )}
        </div>
    );
};

export default AppLock;

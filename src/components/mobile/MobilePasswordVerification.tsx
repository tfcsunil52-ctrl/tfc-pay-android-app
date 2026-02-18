import { useState } from "react";
import { ArrowLeft, Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getAssetPath } from "../../utils/assets";

interface MobilePasswordVerificationProps {
    identifier: string;
    type: 'email';
    onVerify: (password: string) => void;
    onBack: () => void;
    onForgotPassword?: () => void;
    isDarkMode?: boolean;
}

const MobilePasswordVerification = ({
    identifier,
    type,
    onVerify,
    onBack,
    onForgotPassword,
    isDarkMode = true
}: MobilePasswordVerificationProps) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [error, setError] = useState('');

    const handleVerify = () => {
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setError('');
        setIsVerifying(true);
        // Simulate verification delay
        setTimeout(() => {
            onVerify(password);
        }, 1000);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && password.trim()) {
            handleVerify();
        }
    };

    const getTypeLabel = () => {
        return 'email';
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-background via-background to-background/95 text-foreground overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-green-600/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full p-8">
                {/* Header */}
                <div className="flex items-center mb-8">
                    <button
                        onClick={onBack}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <h2 className="ml-4 font-bold text-foreground">Enter Password</h2>
                </div>

                {/* Logo */}
                <div className="flex justify-center mb-8 animate-in zoom-in-95 duration-500">
                    <img
                        src={getAssetPath(isDarkMode ? "/tfcpay-logo.png" : "/tfcpay-logo-light.png")}
                        alt="TFC Pay"
                        className="h-8 w-auto"
                    />
                </div>

                {/* Info Text */}
                <div className="text-center mb-8 animate-in fade-in duration-700">
                    <h3 className="text-2xl font-bold text-foreground mb-3">Welcome Back!</h3>
                    <p className="text-muted-foreground text-sm">
                        Enter your password for
                    </p>
                    <p className="text-green-700 dark:text-green-500 font-semibold mt-1">{identifier}</p>
                </div>

                {/* Password Input */}
                <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl">
                        <div className="mb-6">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <Input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setError('');
                                    }}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Enter your password"
                                    className="h-14 pl-12 pr-12 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 focus:bg-background rounded-xl text-base"
                                    autoFocus
                                    disabled={isVerifying}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {error && (
                                <p className="text-xs text-red-500 mt-2 ml-1">{error}</p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        {onForgotPassword && (
                            <div className="text-right mb-6">
                                <button
                                    onClick={onForgotPassword}
                                    className="text-sm text-green-700 dark:text-green-500 hover:underline font-medium"
                                >
                                    Forgot Password?
                                </button>
                            </div>
                        )}

                        {/* Login Button */}
                        <Button
                            onClick={handleVerify}
                            disabled={!password.trim() || isVerifying}
                            className="w-full h-11 bg-[#063140] hover:bg-[#063140]/90 text-white font-bold shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isVerifying ? 'Logging in...' : 'Login'}
                        </Button>
                    </div>

                    {/* Info Text */}
                    <p className="text-xs text-muted-foreground text-center mt-6 px-4">
                        Your password is encrypted and secure
                    </p>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 text-center pb-6">
                    <p className="text-xs text-muted-foreground/60">
                        TFC Pay © 2026 • Fast & Secure Payments
                    </p>
                </div>
            </div>

            {/* Verifying Overlay */}
            {isVerifying && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card p-8 rounded-2xl border border-border text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 border-4 border-green-700 dark:border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-foreground font-semibold">Logging in...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobilePasswordVerification;


import { useState } from "react";
import { Mail, Phone, User, ArrowRight, Shield, LayoutGrid } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { getAssetPath } from "../../utils/assets";

interface MobileLoginProps {
    onContinue: (identifier: string, type: 'email' | 'mobile', rememberMe: boolean) => void;
    onSignupClick?: () => void;
    onPinLoginClick?: () => void;
    hasPinSet?: boolean;
    isDarkMode?: boolean;
}

const MobileLogin = ({ onContinue, onSignupClick, onPinLoginClick, hasPinSet = false, isDarkMode = true }: MobileLoginProps) => {
    const [identifier, setIdentifier] = useState('');
    const [rememberMe, setRememberMe] = useState(true);

    // Auto-detect input type based on format
    const detectType = (value: string): 'email' | 'mobile' => {
        if (value.includes('@') && value.includes('.')) {
            return 'email';
        }
        return 'mobile';
    };

    const handleLoginWithOTP = () => {
        if (identifier.trim()) {
            onContinue(identifier, 'mobile', rememberMe);
        }
    };

    const handleLoginWithPassword = () => {
        if (identifier.trim()) {
            onContinue(identifier, 'email', rememberMe);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && identifier.trim()) {
            const type = detectType(identifier);
            onContinue(identifier, type, rememberMe);
        }
    };

    const getPlaceholder = () => {
        if (!identifier) return 'Email or Mobile Number';
        const type = detectType(identifier);
        if (type === 'email') return 'Continue entering email...';
        return 'Continue entering mobile number...';
    };

    const getIcon = () => {
        if (!identifier) return User;
        const type = detectType(identifier);
        if (type === 'email') return Mail;
        if (type === 'mobile') return Phone;
        return User;
    };

    const IconComponent = getIcon();

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-background via-background to-background/95 text-foreground overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-green-600/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full overflow-y-auto p-8">
                {/* Logo Section */}
                <div className="flex-shrink-0 flex flex-col items-center pt-12 pb-8 animate-in fade-in duration-700 font-sans">
                    <div className="mb-6">
                        <img
                            src={getAssetPath(isDarkMode ? "/tfcpay-logo.png" : "/tfcpay-logo-light.png")}
                            alt="TFC Pay"
                            className="h-8 w-auto"
                        />
                    </div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">
                        Welcome Back
                    </h1>
                    <p className="text-muted-foreground text-sm">
                        Sign in to your TFC Pay account
                    </p>
                </div>

                {/* Login Card */}
                <div className="flex-1 flex flex-col justify-center max-w-sm w-full mx-auto">
                    <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl">
                        <div className="mb-6">
                            <label className="text-sm font-medium text-muted-foreground mb-2 block">
                                Email / Mobile Number
                            </label>
                            <div className="relative">
                                <div className={`absolute left-4 top-1/2 -translate-y-1/2 transition-all duration-300 ${identifier ? 'text-green-700 dark:text-green-500' : 'text-muted-foreground'}`}>
                                    <IconComponent className="w-5 h-5" />
                                </div>
                                <Input
                                    type="text"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder={getPlaceholder()}
                                    className="h-12 pl-12 pr-4 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 focus:bg-background rounded-xl text-sm transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <button
                                type="button"
                                onClick={() => setRememberMe(!rememberMe)}
                                className="flex items-center gap-3 group cursor-pointer"
                            >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${rememberMe
                                    ? 'bg-green-700 border-green-700 dark:bg-green-500 dark:border-green-500'
                                    : 'border-muted-foreground/30 group-hover:border-muted-foreground/50'}`}>
                                    {rememberMe && (
                                        <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                                <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                                    Remember me
                                </span>
                            </button>
                        </div>

                        <div className="flex flex-col gap-2.5">
                            <Button
                                onClick={handleLoginWithOTP}
                                disabled={!identifier.trim()}
                                className="w-full h-11 bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold text-sm rounded-xl shadow-lg shadow-green-700/10 dark:shadow-green-500/10 group disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <span>Login with OTP</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            <Button
                                onClick={handleLoginWithPassword}
                                disabled={!identifier.trim()}
                                variant="outline"
                                className="w-full h-11 border-2 border-green-700/20 dark:border-green-500/20 text-green-700 dark:text-green-500 font-bold text-sm rounded-xl hover:bg-green-600/5 dark:hover:bg-green-500/5 transition-all"
                            >
                                Login with Password
                            </Button>
                        </div>

                        <div className="text-center mt-4 space-y-4">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <button
                                    onClick={onSignupClick}
                                    className="text-green-700 dark:text-green-500 font-semibold hover:underline"
                                >
                                    Sign Up
                                </button>
                            </p>

                            {hasPinSet && onPinLoginClick && (
                                <div className="pt-4 border-t border-border/50">
                                    <button
                                        onClick={onPinLoginClick}
                                        className="w-full h-12 flex items-center justify-center gap-2 text-sm font-semibold text-green-700 dark:text-green-500 hover:bg-green-600/5 dark:hover:bg-green-500/5 border border-green-700/50 dark:border-green-500/50 rounded-xl transition-all"
                                    >
                                        <LayoutGrid className="w-4 h-4" />
                                        Login with PIN
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-center gap-2 mt-6 text-muted-foreground">
                            <Shield className="w-4 h-4" />
                            <span className="text-xs">Secure & Encrypted</span>
                        </div>
                    </div>

                    <p className="text-xs text-muted-foreground text-center mt-6 px-4">
                        By continuing, you agree to our{' '}
                        <span className="text-green-700 dark:text-green-500">Terms</span> and{' '}
                        <span className="text-green-700 dark:text-green-500">Privacy Policy</span>
                    </p>
                </div>

                {/* Footer */}
                <div className="flex-shrink-0 text-center py-6 mt-auto">
                    <p className="text-xs text-muted-foreground/60">
                        TFC Pay © 2026 • Fast & Secure Payments
                    </p>
                </div>
            </div>
        </div>
    );
};

export default MobileLogin;

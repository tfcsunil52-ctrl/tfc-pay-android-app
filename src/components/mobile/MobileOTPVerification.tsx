import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Smartphone, RefreshCw } from "lucide-react";
import { Button } from "../ui/Button";
import { getAssetPath } from "../../utils/assets";

interface MobileOTPVerificationProps {
    identifier: string;
    type: 'email' | 'mobile';
    onVerify: () => void;
    onBack: () => void;
    isDarkMode?: boolean;
}

const MobileOTPVerification = ({
    identifier,
    type,
    onVerify,
    onBack,
    isDarkMode = true
}: MobileOTPVerificationProps) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [autoVerifying, setAutoVerifying] = useState(false);
    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Focus first input on mount
    useEffect(() => {
        setTimeout(() => {
            inputRefs.current[0]?.focus();
        }, 100);
    }, []);

    // WebOTP API Simulation / Auto-verify Permission
    useEffect(() => {
        if (type === 'mobile') {
            setAutoVerifying(true);
            const timer = setTimeout(() => {
                const mockOtp = "123456";
                setOtp(mockOtp.split(''));
                setAutoVerifying(false);
            }, 3000); // Simulate receiving SMS after 3s
            return () => clearTimeout(timer);
        }
    }, [type]);

    // Timer countdown
    useEffect(() => {
        if (timer > 0) {
            const interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
            return () => clearInterval(interval);
        } else {
            setCanResend(true);
        }
    }, [timer]);

    // Auto-verify when all digits entered
    useEffect(() => {
        if (otp.every(digit => digit !== '')) {
            handleVerify();
        }
    }, [otp]);

    const handleChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Move to next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pastedData = e.clipboardData.getData('text').slice(0, 6);
        if (/^\d+$/.test(pastedData)) {
            const newOtp = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
            setOtp(newOtp.slice(0, 6));
            inputRefs.current[Math.min(pastedData.length, 5)]?.focus();
        }
    };

    const handleVerify = () => {
        setIsVerifying(true);
        // Simulate verification delay
        setTimeout(() => {
            onVerify();
        }, 1000);
    };

    const handleResend = () => {
        setTimer(30);
        setCanResend(false);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    const getTypeLabel = () => {
        switch (type) {
            case 'email': return 'email';
            case 'mobile': return 'mobile number';
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-background text-foreground p-8">
            {/* Header */}
            <div className="flex items-center mb-8">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground">Verify OTP</h2>
            </div>

            {/* Logo */}
            <div className="flex justify-center mb-10 animate-in zoom-in-95 duration-500">
                <img
                    src={getAssetPath(isDarkMode ? "/tfcpay-logo.png" : "/tfcpay-logo-light.png")}
                    alt="TFC Pay Logo"
                    className="h-8 w-auto"
                />
            </div>

            {/* Info Text */}
            <div className="text-center mb-8 animate-in fade-in duration-700">
                <h3 className="text-2xl font-bold text-foreground mb-3">Enter Verification Code</h3>
                <p className="text-muted-foreground text-sm">
                    We've sent a 6-digit code to your {getTypeLabel()}
                </p>
                <p className="text-green-700 dark:text-green-500 font-semibold mt-1">{identifier}</p>
            </div>

            {/* OTP Input */}
            <div className="flex justify-center gap-3 mb-6 animate-in slide-in-from-top duration-700 delay-100">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        ref={el => inputRefs.current[index] = el}
                        type="text"
                        inputMode="numeric"
                        autoComplete={index === 0 ? "one-time-code" : "off"}
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={index === 0 ? handlePaste : undefined}
                        className={`w-12 h-14 text-center text-2xl font-bold rounded-xl border-2 bg-card transition-all ${digit
                            ? 'border-green-700 text-green-700 dark:border-green-500 dark:text-green-500 scale-105'
                            : 'border-border text-foreground'
                            } focus:border-green-700 dark:focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-700/20 dark:focus:ring-green-500/20`}
                        disabled={isVerifying || autoVerifying}
                    />
                ))}
            </div>

            {autoVerifying && (
                <div className="text-center animate-pulse py-2">
                    <p className="text-xs font-bold text-green-700 dark:text-green-500 flex items-center justify-center gap-2">
                        <Smartphone className="w-3 h-3" /> Waiting for OTP...
                    </p>
                </div>
            )}


            {/* Resend Section */}
            <div className="text-center mt-6">
                {canResend ? (
                    <button
                        onClick={handleResend}
                        className="text-green-700 dark:text-green-500 font-semibold hover:underline flex items-center justify-center gap-2 mx-auto"
                    >
                        <RefreshCw className="w-4 h-4" />
                        Resend OTP
                    </button>
                ) : (
                    <p className="text-muted-foreground text-sm">
                        Resend code in <span className="text-green-700 dark:text-green-500 font-semibold">{timer}s</span>
                    </p>
                )}
            </div>

            {/* Verifying State */}
            {
                isVerifying && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                        <div className="bg-card p-8 rounded-2xl border border-border text-center animate-in zoom-in-95">
                            <div className="w-16 h-16 border-4 border-green-700 dark:border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-foreground font-semibold">Verifying...</p>
                        </div>
                    </div>
                )
            }

            {/* Footer Info */}
            <div className="mt-auto pt-8">
                <p className="text-xs text-muted-foreground text-center">
                    Didn't receive the code? Check spam folder or try another method
                </p>
            </div>
        </div >
    );
};

export default MobileOTPVerification;

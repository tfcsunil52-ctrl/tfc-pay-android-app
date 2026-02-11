import { useState } from "react";
import { ArrowLeft, Mail, Phone, User, Lock, Eye, EyeOff, Shield, ArrowRight } from "lucide-react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import AppLock from "./AppLock";
import { getAssetPath } from "../../utils/assets";

interface MobileSignupProps {
    onSignup: (data: SignupData) => void;
    onBackToLogin: () => void;
    isDarkMode?: boolean;
}

export interface SignupData {
    name: string;
    identifier: string; // Can be email, mobile, or userid
    password: string;
    pin?: string;
}

const MobileSignup = ({ onSignup, onBackToLogin, isDarkMode = true }: MobileSignupProps) => {
    const [formData, setFormData] = useState({
        name: '',
        identifier: '', // Combined field for email/mobile/userid
        password: '',
        confirmPassword: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [signupStep, setSignupStep] = useState(0); // 0: Form, 1: PIN Setup
    const [pin, setPin] = useState("");

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.identifier.trim()) {
            newErrors.identifier = 'Email, Mobile, or User ID is required';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!acceptedTerms) {
            newErrors.terms = 'You must accept the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = () => {
        if (!validateForm()) return;
        setSignupStep(1); // Proceed to PIN setup
    };

    const handlePinSet = (finalPin: string) => {
        setPin(finalPin);
        setIsSubmitting(true);
        // Simulate signup delay with the full data
        setTimeout(() => {
            onSignup({
                name: formData.name,
                identifier: formData.identifier,
                password: formData.password,
                pin: finalPin
            });
        }, 1000);
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData({ ...formData, [field]: value });
        // Clear error for this field
        if (errors[field]) {
            setErrors({ ...errors, [field]: '' });
        }
    };

    return (
        <div className="h-screen w-full flex flex-col bg-gradient-to-b from-background via-background to-background/95 text-foreground overflow-hidden relative">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/5 via-transparent to-green-600/5 pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full overflow-y-auto">
                {/* Header */}
                <div className="flex-shrink-0 px-8 pt-8 pb-4">
                    <div className="flex items-center mb-8">
                        <button
                            onClick={onBackToLogin}
                            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <h2 className="ml-4 font-bold text-foreground">Create Account</h2>
                    </div>

                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <img
                            src={getAssetPath(isDarkMode ? "/tfcpay-logo.png" : "/tfcpay-logo-light.png")}
                            alt="TFC Pay"
                            className="h-8 w-auto"
                        />
                    </div>

                    <div className="text-center mb-6">
                        <h3 className="text-2xl font-bold text-foreground mb-2">Join TFC Pay</h3>
                        <p className="text-muted-foreground text-sm">Start your digital payment journey</p>
                    </div>
                </div>

                {/* Signup Form */}
                <div className="flex-1 px-8 pb-8">
                    <div className="max-w-sm w-full mx-auto bg-card/50 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl">
                        <div className="space-y-4">
                            {/* Name */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Enter your name</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Enter your name"
                                        className="h-12 pl-12 pr-4 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 rounded-xl text-sm"
                                    />
                                </div>
                                {errors.name && <p className="text-xs text-red-500 mt-1 ml-1">{errors.name}</p>}
                            </div>

                            {/* Email / Mobile / User ID - Combined Field */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Email / Mobile / User ID</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type="text"
                                        value={formData.identifier}
                                        onChange={(e) => handleInputChange('identifier', e.target.value)}
                                        placeholder="Email, Mobile Number, or User ID"
                                        className="h-12 pl-12 pr-4 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 rounded-xl text-sm"
                                    />
                                </div>
                                {errors.identifier && <p className="text-xs text-red-500 mt-1 ml-1">{errors.identifier}</p>}
                            </div>

                            {/* Password */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        placeholder="At least 6 characters"
                                        className="h-12 pl-12 pr-12 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 rounded-xl text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-xs text-red-500 mt-1 ml-1">{errors.password}</p>}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="text-sm font-medium text-muted-foreground mb-2 block">Confirm Password</label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <Input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        value={formData.confirmPassword}
                                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        placeholder="Re-enter password"
                                        className="h-12 pl-12 pr-12 bg-background/50 border-border/50 focus:border-green-700 dark:focus:border-green-500 rounded-xl text-sm"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1 ml-1">{errors.confirmPassword}</p>}
                            </div>

                            {/* Terms Checkbox */}
                            <div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setAcceptedTerms(!acceptedTerms);
                                        if (errors.terms) setErrors({ ...errors, terms: '' });
                                    }}
                                    className="flex items-start gap-3 group cursor-pointer w-full text-left"
                                >
                                    <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 mt-0.5 ${acceptedTerms
                                        ? 'bg-green-700 border-green-700 dark:bg-green-500 dark:border-green-500'
                                        : 'border-muted-foreground/30 group-hover:border-muted-foreground/50'
                                        }`}>
                                        {acceptedTerms && (
                                            <svg className="w-3 h-3 text-white dark:text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        )}
                                    </div>
                                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                                        I agree to the <span className="text-green-700 dark:text-green-500">Terms & Conditions</span> and <span className="text-green-700 dark:text-green-500">Privacy Policy</span>
                                    </span>
                                </button>
                                {errors.terms && <p className="text-xs text-red-500 mt-1 ml-1">{errors.terms}</p>}
                            </div>

                            {/* Submit Button */}
                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full h-12 bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold text-sm rounded-xl shadow-lg shadow-green-700/20 dark:shadow-green-500/20 group disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-2"
                            >
                                <span>{isSubmitting ? 'Creating Account...' : 'Create Account'}</span>
                                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>

                            {/* Login Link */}
                            <div className="text-center pt-2">
                                <p className="text-xs text-muted-foreground">
                                    Already have an account?{' '}
                                    <button onClick={onBackToLogin} className="text-green-700 dark:text-green-500 font-semibold hover:underline">
                                        Log In
                                    </button>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* PIN Setup Step */}
            {signupStep === 1 && (
                <div className="fixed inset-0 z-[100] bg-background">
                    <AppLock
                        mode="setup"
                        onUnlock={() => { }} // Not used in setup mode directly for unlock
                        onPinSet={handlePinSet}
                    />
                </div>
            )}

            {/* Submitting Overlay */}
            {isSubmitting && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-card p-8 rounded-2xl border border-border text-center animate-in zoom-in-95">
                        <div className="w-16 h-16 border-4 border-green-700 dark:border-green-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-foreground font-semibold">Creating your account...</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileSignup;

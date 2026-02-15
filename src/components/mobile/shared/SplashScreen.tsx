import { useEffect, useState } from "react";
import { getAssetPath } from "../../../utils/assets";

interface SplashScreenProps {
    onComplete: () => void;
    isDarkMode?: boolean;
}

const SplashScreen = ({ onComplete, isDarkMode = true }: SplashScreenProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 500); // Wait for fade out animation
        }, 2500); // Splash duration

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <div className="relative flex flex-col items-center">
                {/* Logo with scaling and bounce animation */}
                <div className="animate-in zoom-in-50 duration-700 ease-out">
                    <div className="w-24 h-24 mb-6 relative">
                        {/* Background glow effect */}
                        <div className="absolute inset-0 bg-green-500/20 blur-3xl rounded-full scale-150 animate-pulse" />
                        <img
                            src={getAssetPath("/tfcpay-logo.png")}
                            alt="TFC Pay"
                            className="w-full h-full object-contain relative z-10"
                        />
                    </div>
                </div>

                {/* Text reveal with tracking-in-expand */}
                <div className="space-y-2 text-center overflow-hidden">
                    <h1 className="text-4xl font-black tracking-tighter text-foreground animate-in slide-in-from-bottom-full duration-1000 delay-150 fill-mode-both">
                        TFC <span className="text-green-700 dark:text-green-500">PAY</span>
                    </h1>
                    <p className="text-muted-foreground text-xs font-medium tracking-[0.3em] uppercase animate-in fade-in duration-1000 delay-500 fill-mode-both">
                        Secure • Fast • Reliable
                    </p>
                </div>

                {/* Loading indicator at the bottom */}
                <div className="absolute -bottom-24 left-1/2 -translate-x-1/2">
                    <div className="flex gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-700/40 dark:bg-green-500/40 animate-bounce [animation-delay:-0.3s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-700/60 dark:bg-green-500/60 animate-bounce [animation-delay:-0.15s]" />
                        <div className="w-1.5 h-1.5 rounded-full bg-green-700 dark:bg-green-500 animate-bounce" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;

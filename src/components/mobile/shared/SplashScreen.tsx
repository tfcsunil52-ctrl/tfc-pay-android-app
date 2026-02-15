import { useEffect, useState } from "react";
import { getAssetPath } from "../../../utils/assets";

interface SplashScreenProps {
    onComplete: () => void;
    isDarkMode?: boolean;
}

const SplashScreen = ({ onComplete, isDarkMode = true }: SplashScreenProps) => {
    const [phase, setPhase] = useState<'showing' | 'fading' | 'none'>('showing');

    useEffect(() => {
        const fadeTimer = setTimeout(() => {
            setPhase('fading');
            const completeTimer = setTimeout(() => {
                setPhase('none');
                onComplete();
            }, 300); // Super snappy fade
            return () => clearTimeout(completeTimer);
        }, 1000); // Ultra quick 1s display

        return () => clearTimeout(fadeTimer);
    }, [onComplete]);

    if (phase === 'none') return null;

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
            transition: 'opacity 300ms ease-in-out',
            opacity: phase === 'showing' ? 1 : 0,
            pointerEvents: 'none',
        }}>
            <style>{`
                @keyframes simplePop {
                    0% { transform: scale(0.5); opacity: 0; }
                    60% { transform: scale(1.05); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>

            <div style={{
                width: '200px',
                height: '200px',
                animation: 'simplePop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards',
            }}>
                <img
                    src={getAssetPath("/tfcpay-logo.png")}
                    alt="TFC Pay"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
            </div>
        </div>
    );
};

export default SplashScreen;

import { useEffect, useState } from "react";
import { getAssetPath } from "../../../utils/assets";

interface SplashScreenProps {
    onComplete: () => void;
    isDarkMode?: boolean;
}

const SplashScreen = ({ onComplete, isDarkMode = true }: SplashScreenProps) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        console.log("SplashScreen: Mounted");
        const timer = setTimeout(() => {
            console.log("SplashScreen: Fading out");
            setIsVisible(false);
            setTimeout(() => {
                console.log("SplashScreen: Completing");
                onComplete();
            }, 500);
        }, 3000);

        return () => {
            clearTimeout(timer);
            console.log("SplashScreen: Unmounted");
        };
    }, [onComplete]);

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isDarkMode ? '#0d1117' : '#f8fafc',
            transition: 'opacity 500ms ease-out',
            opacity: isVisible ? 1 : 0,
            pointerEvents: 'none',
            visibility: isVisible ? 'visible' : 'hidden'
        }}>
            <style>{`
                @keyframes logoReveal {
                    0% { opacity: 0; transform: scale(0.5) rotate(-10deg); filter: blur(10px); }
                    70% { opacity: 1; transform: scale(1.1) rotate(0); filter: blur(0); }
                    100% { opacity: 1; transform: scale(1) rotate(0); filter: blur(0); }
                }
                @keyframes textSlideUp {
                    0% { opacity: 0; transform: translateY(20px); }
                    100% { opacity: 1; transform: translateY(0); }
                }
                @keyframes glowPulse {
                    0% { transform: scale(1); opacity: 0.3; }
                    50% { transform: scale(1.5); opacity: 0.6; }
                    100% { transform: scale(1); opacity: 0.3; }
                }
                @keyframes dotBounce {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-6px); }
                }
            `}</style>

            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120px',
                    height: '120px',
                    backgroundColor: '#15803d',
                    borderRadius: '50%',
                    filter: 'blur(40px)',
                    transform: 'translate(-50%, -50%)',
                    animation: 'glowPulse 2s infinite ease-in-out',
                    zIndex: 0
                }} />

                {/* Logo */}
                <div style={{
                    width: '100px',
                    height: '100px',
                    marginBottom: '24px',
                    animation: 'logoReveal 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                    zIndex: 1
                }}>
                    <img
                        src="tfcpay-logo.png"
                        alt="TFC Pay"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        onError={(e) => console.error("SplashScreen Logo Load Error", e)}
                    />
                </div>

                {/* App Name */}
                <div style={{ textAlign: 'center', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: '32px',
                        fontWeight: '900',
                        color: isDarkMode ? '#f8fafc' : '#0d1117',
                        margin: 0,
                        letterSpacing: '-1px',
                        animation: 'textSlideUp 0.6s 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) both'
                    }}>
                        TFC <span style={{ color: '#22c55e' }}>PAY</span>
                    </h1>
                    <p style={{
                        fontSize: '10px',
                        fontWeight: '600',
                        color: isDarkMode ? '#94a3b8' : '#64748b',
                        marginTop: '4px',
                        letterSpacing: '4px',
                        textTransform: 'uppercase',
                        opacity: 0,
                        animation: 'textSlideUp 0.6s 0.6s ease-out forwards'
                    }}>
                        Secure • Fast • Reliable
                    </p>
                </div>

                {/* Loading Dots */}
                <div style={{
                    display: 'flex',
                    gap: '6px',
                    marginTop: '40px',
                    opacity: 0,
                    animation: 'textSlideUp 0.5s 0.8s ease-out forwards'
                }}>
                    {[0, 1, 2].map(i => (
                        <div key={i} style={{
                            width: '6px',
                            height: '6px',
                            borderRadius: '50%',
                            backgroundColor: '#22c55e',
                            animation: `dotBounce 0.6s ${i * 0.1}s infinite ease-in-out`
                        }} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SplashScreen;

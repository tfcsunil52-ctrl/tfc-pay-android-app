
import { useState, useRef, useEffect } from "react";
import { X, Flashlight, Image as ImageIcon, QrCode, ArrowLeft } from "lucide-react";
import { Button } from "../ui/Button";

interface ScanQRProps {
    onClose: () => void;
    onScan: (data: string) => void;
}

const ScanQR = ({ onClose, onScan }: ScanQRProps) => {
    const [activeTab, setActiveTab] = useState<'scan' | 'my-qr'>('scan');
    const [isFlashOn, setIsFlashOn] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Mock camera stream
    useEffect(() => {
        if (activeTab === 'scan') {
            const startCamera = async () => {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;
                    }
                } catch (err) {
                    console.error("Camera access denied:", err);
                    // Fallback UI handled by absence of video
                }
            };
            startCamera();

            return () => {
                if (videoRef.current?.srcObject) {
                    const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                    tracks.forEach(track => track.stop());
                }
            };
        }
    }, [activeTab]);

    return (
        <div className="fixed inset-0 z-50 bg-background flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 z-10">
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-white" />
                </button>
                <div className="flex bg-white/10 backdrop-blur-md rounded-full p-1">
                    <button
                        onClick={() => setActiveTab('scan')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'scan' ? 'bg-white text-black' : 'text-white'}`}
                    >
                        Scan QR
                    </button>
                    <button
                        onClick={() => setActiveTab('my-qr')}
                        className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === 'my-qr' ? 'bg-white text-black' : 'text-white'}`}
                    >
                        My QR
                    </button>
                </div>
                <div className="w-10" /> {/* Spacer for centering */}
            </div>

            {/* Content */}
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                {activeTab === 'scan' ? (
                    <>
                        {/* Camera View */}
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                        {/* Scanner Overlay */}
                        <div className="absolute inset-0 border-[40px] border-black/50 z-10 box-border">
                            <div className="w-full h-full relative">
                                <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-green-500 rounded-tl-xl" />
                                <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-green-500 rounded-tr-xl" />
                                <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-green-500 rounded-bl-xl" />
                                <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-green-500 rounded-br-xl" />

                                {/* Scanning Line Animation */}
                                <div className="absolute top-0 left-0 right-0 h-0.5 bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.8)] animate-[scan_2s_ease-in-out_infinite]" />
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-8 z-20">
                            <button className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors">
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <ImageIcon className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium">Gallery</span>
                            </button>

                            <button
                                onClick={() => setIsFlashOn(!isFlashOn)}
                                className={`flex flex-col items-center gap-2 transition-colors ${isFlashOn ? 'text-green-500' : 'text-white/80 hover:text-white'}`}
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${isFlashOn ? 'bg-white text-black' : 'bg-white/10 backdrop-blur-md'}`}>
                                    <Flashlight className="w-7 h-7" />
                                </div>
                                <span className="text-xs font-medium">Flash</span>
                            </button>

                            <button
                                onClick={() => {
                                    // Mock scan
                                    onScan("upi://pay?pa=mock@upi&pn=MockReceiver");
                                }}
                                className="flex flex-col items-center gap-2 text-white/80 hover:text-white transition-colors"
                            >
                                <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center">
                                    <QrCode className="w-6 h-6" />
                                </div>
                                <span className="text-xs font-medium">Payment Code</span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="bg-white p-8 rounded-3xl shadow-2xl flex flex-col items-center animate-in zoom-in-95 duration-300 mx-6">
                        <div className="w-16 h-16 rounded-full bg-green-600/10 flex items-center justify-center mb-4 border-2 border-green-700">
                            <span className="text-2xl font-bold text-green-700">JD</span>
                        </div>
                        <h3 className="text-xl font-bold text-black mb-1">John Doe</h3>
                        <p className="text-sm text-gray-500 mb-6">john.doe@upi</p>

                        <div className="p-4 bg-white border-2 border-black rounded-xl mb-6">
                            <QrCode className="w-48 h-48 text-black" strokeWidth={1} />
                        </div>

                        <p className="text-xs text-center text-gray-400 max-w-[200px] mb-6">
                            Scan this QR code to receive money from any UPI app
                        </p>

                        <div className="flex gap-3 w-full">
                            <Button className="flex-1 bg-black text-white hover:bg-black/90">Share</Button>
                            <Button variant="outline" className="flex-1 border-gray-200">Download</Button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; opacity: 1; }
                    50% { opacity: 0.5; }
                    100% { top: 100%; opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default ScanQR;

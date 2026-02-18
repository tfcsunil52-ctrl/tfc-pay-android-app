import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Gift, Clock, Sparkles, Trophy, Lock } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";

interface MobileRewardsProps {
    onClose: () => void;
    isDarkMode?: boolean;
}

const MobileRewards = ({ onClose, isDarkMode }: MobileRewardsProps) => {
    const [isClosing, setIsClosing] = useState(false);


    const [scratchedCards, setScratchedCards] = useState<number[]>([]);
    const [cards, setCards] = useState<any[]>([]);

    useEffect(() => {
        // Generate random cards on mount
        const newCards = Array.from({ length: 4 }).map((_, i) => {
            const isLocked = i === 3; // Lock the last one
            if (isLocked) return { id: i, amount: "???", title: "Unlock on Next Payment", isLocked: true, type: "locked" };

            return generateReward(i);
        });
        setCards(newCards);
    }, []);

    const generateReward = (id: number) => {
        const isCashback = Math.random() > 0.6; // 40% chance of Cashback (Gold), 60% Discount (Silver)

        if (isCashback) {
            // Cashback Logic: Max 100, weighted towards small numbers
            let amount = 0;
            const rand = Math.random();
            if (rand < 0.8) {
                // 80% chance: ₹5 - ₹20
                amount = Math.floor(Math.random() * 16) + 5;
            } else if (rand < 0.95) {
                // 15% chance: ₹21 - ₹50
                amount = Math.floor(Math.random() * 30) + 21;
            } else {
                // 5% chance: ₹51 - ₹100
                amount = Math.floor(Math.random() * 50) + 51;
            }

            return {
                id,
                amount: `₹${amount}`,
                title: "Wallet Cashback",
                isLocked: false,
                type: "cashback"
            };
        } else {
            // Discount/Coupon Logic
            const coupons = [
                { title: "Zomato Gold", amount: "50% OFF" },
                { title: "Swiggy", amount: "Flat ₹100 OFF" },
                { title: "Myntra", amount: "15% Discount" },
                { title: "Ajio Luxe", amount: "₹500 Voucher" },
                { title: "Uber", amount: "20% OFF Ride" }
            ];
            const pick = coupons[Math.floor(Math.random() * coupons.length)];
            return {
                id,
                amount: pick.amount,
                title: pick.title,
                isLocked: false,
                type: "discount"
            };
        }
    };

    const rewardHistory = [
        { id: 101, title: "Cashback Received", amount: "₹25", date: "Today, 10:30 AM", expiry: "No Expiry" },
        { id: 102, title: "Zomato Gold Coupon", amount: "50% OFF", date: "Yesterday", expiry: "Expires in 5 days" },
        { id: 103, title: "Cashback Received", amount: "₹10", date: "2 Feb 2026", expiry: "No Expiry" },
    ];

    const handleBack = () => {
        setIsClosing(true);
        // Wait for animation to finish before unmounting
        setTimeout(() => {
            onClose();
        }, 300); // Match duration-300
    };

    // Scratch Card Component
    const ScratchCard = ({ children, isScratched, onScratchComplete, type }: { children: React.ReactNode, isScratched: boolean, onScratchComplete: () => void, type: string }) => {
        const canvasRef = useRef<HTMLCanvasElement>(null);
        const [isRevealed, setIsRevealed] = useState(isScratched);
        const [hasStartedScratching, setHasStartedScratching] = useState(false);
        const containerRef = useRef<HTMLDivElement>(null);

        useEffect(() => {
            if (isScratched) {
                setIsRevealed(true);
            }
        }, [isScratched]);

        useEffect(() => {
            const canvas = canvasRef.current;
            const container = containerRef.current;
            if (!canvas || !container || isRevealed) return;

            const ctx = canvas.getContext("2d");
            if (!ctx) return;

            // Set canvas size to match container
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;

            // Fill with gradient based on type
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            if (type === 'cashback') {
                gradient.addColorStop(0, '#fde047'); // yellow-300
                gradient.addColorStop(0.5, '#eab308'); // yellow-500
                gradient.addColorStop(1, '#a16207'); // yellow-700
            } else {
                gradient.addColorStop(0, '#cbd5e1'); // slate-300
                gradient.addColorStop(0.5, '#94a3b8'); // slate-400
                gradient.addColorStop(1, '#475569'); // slate-600
            }

            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Add some "noise" or pattern if possible (simple dots for texture)
            ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
            for (let i = 0; i < 50; i++) {
                ctx.beginPath();
                ctx.arc(Math.random() * canvas.width, Math.random() * canvas.height, Math.random() * 2, 0, Math.PI * 2);
                ctx.fill();
            }

            // Drawing logic
            let isDrawing = false;

            const getPos = (e: MouseEvent | TouchEvent) => {
                const rect = canvas.getBoundingClientRect();
                let clientX, clientY;
                if ('touches' in e) {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = (e as MouseEvent).clientX;
                    clientY = (e as MouseEvent).clientY;
                }
                return {
                    x: clientX - rect.left,
                    y: clientY - rect.top
                };
            };

            const scratch = (x: number, y: number) => {
                if (!hasStartedScratching) setHasStartedScratching(true);
                ctx.globalCompositeOperation = "destination-out";
                ctx.beginPath();
                ctx.arc(x, y, 80, 0, Math.PI * 2);
                ctx.fill();
            };

            const checkReveal = () => {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const pixels = imageData.data;
                let transparentPixels = 0;
                for (let i = 3; i < pixels.length; i += 4) {
                    if (pixels[i] === 0) transparentPixels++;
                }
                const percent = (transparentPixels / (pixels.length / 4)) * 100;
                if (percent > 15) {
                    setIsRevealed(true);
                    onScratchComplete();
                }
            };

            const startDrawing = (e: MouseEvent | TouchEvent) => {
                isDrawing = true;
                const { x, y } = getPos(e);
                scratch(x, y);
            };

            const moveDrawing = (e: MouseEvent | TouchEvent) => {
                if (!isDrawing) return;
                e.preventDefault(); // Prevent scrolling while scratching
                const { x, y } = getPos(e);
                scratch(x, y);
            };

            const endDrawing = () => {
                if (isDrawing) {
                    isDrawing = false;
                    checkReveal();
                }
            };

            canvas.addEventListener("mousedown", startDrawing);
            canvas.addEventListener("mousemove", moveDrawing);
            canvas.addEventListener("mouseup", endDrawing);
            canvas.addEventListener("touchstart", startDrawing);
            canvas.addEventListener("touchmove", moveDrawing);
            canvas.addEventListener("touchend", endDrawing);

            return () => {
                canvas.removeEventListener("mousedown", startDrawing);
                canvas.removeEventListener("mousemove", moveDrawing);
                canvas.removeEventListener("mouseup", endDrawing);
                canvas.removeEventListener("touchstart", startDrawing);
                canvas.removeEventListener("touchmove", moveDrawing);
                canvas.removeEventListener("touchend", endDrawing);
            };
        }, [isRevealed, type, onScratchComplete]);

        return (
            <div ref={containerRef} className="relative w-full h-full rounded-2xl overflow-hidden">
                {children}
                {!isRevealed && (
                    <canvas
                        ref={canvasRef}
                        className="absolute inset-0 z-20 cursor-crosshair touch-none"
                    />
                )}
                {!isRevealed && !hasStartedScratching && (
                    <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center opacity-70">
                        <Gift className="w-10 h-10 text-white animate-pulse" />
                    </div>
                )}
            </div>
        );
    };

    // Gift Box Pattern SVG (Tilted)
    const PatternOverlay = () => (
        <div className="absolute inset-0 opacity-10 pointer-events-none overflow-hidden rounded-2xl">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <pattern id="gift-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">
                        <path d="M20 5 L25 10 L30 5 L25 0 Z M10 20 L30 20 M20 10 L20 30" stroke="currentColor" strokeWidth="2" fill="none" />
                        <rect x="10" y="10" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none" />
                    </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#gift-pattern)" />
            </svg>
        </div>
    );

    return (
        <div className={`flex flex-col h-full bg-white dark:bg-transparent absolute inset-0 z-[60] overflow-hidden 
            ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}
        `}>
            {/* Header */}
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10 sticky top-0">
                <button
                    onClick={handleBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-700 dark:text-green-500" />
                    Rewards & Scratch Cards
                </h2>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-20">

                {/* Scratch Cards Section */}
                <section>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-500" />
                        Scratch Cards
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        {cards.map((card) => {
                            const isScratched = scratchedCards.includes(card.id);

                            if (card.isLocked) {
                                return (
                                    <div key={card.id} className="aspect-square relative group">
                                        <div className="absolute inset-0 rounded-2xl bg-muted border-2 border-dashed border-muted-foreground/30 flex flex-col items-center justify-center text-center p-3">
                                            <Gift className="w-8 h-8 text-muted-foreground mb-2" />
                                            <span className="text-xs font-medium text-muted-foreground">Locked</span>
                                            <span className="text-[10px] text-muted-foreground/70 mt-1">{card.title}</span>
                                        </div>
                                    </div>
                                );
                            }

                            return (
                                <div key={card.id} className="aspect-square relative">
                                    <ScratchCard
                                        type={card.type}
                                        isScratched={isScratched}
                                        onScratchComplete={() => {
                                            if (!isScratched) setScratchedCards(prev => [...prev, card.id]);
                                        }}
                                    >
                                        <div className={`w-full h-full flex flex-col items-center justify-center text-center p-3 transition-all duration-500 ${card.type === 'cashback' ? 'bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-400' : 'bg-gradient-to-br from-slate-100 via-slate-200 to-slate-400'}`}>
                                            {/* Reveal Content */}
                                            <div className="animate-in zoom-in duration-500 relative z-10">
                                                <Trophy className={`w-8 h-8 mb-2 mx-auto ${card.type === 'cashback' ? 'text-yellow-600' : 'text-slate-600'}`} />
                                                <span className={`text-lg font-bold block ${card.type === 'cashback' ? 'text-yellow-900' : 'text-slate-800'}`}>{card.amount}</span>
                                                <span className={`text-[10px] ${card.type === 'cashback' ? 'text-yellow-800/80' : 'text-slate-700/80'}`}>{card.title}</span>
                                            </div>
                                            <PatternOverlay />
                                        </div>
                                    </ScratchCard>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Reward History Section */}
                <section>
                    <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        Recent Rewards
                    </h3>
                    <div className="space-y-3">
                        {rewardHistory.map((reward) => (
                            <Card key={reward.id} className="bg-card border-border">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center">
                                            <Gift className="w-5 h-5 text-green-700 dark:text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{reward.title}</p>
                                            <p className="text-xs text-muted-foreground">{reward.date}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-bold text-sm text-foreground block">{reward.amount}</span>
                                        <span className={`text-[10px] ${reward.expiry === 'No Expiry' ? 'text-muted-foreground' : 'text-orange-500 font-medium'}`}>
                                            {reward.expiry}
                                        </span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>

            </div>
        </div>
    );
};

export default MobileRewards;

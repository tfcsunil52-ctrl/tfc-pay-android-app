import { useRef, useState } from "react";
import { Check, ShieldCheck, Share2, Download, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import { Button } from "../ui/Button";
import type { Transaction } from "../../types";
import { getAssetPath } from "../../utils/assets";

interface TransactionReceiptProps {
    transaction: Transaction;
    onClose: () => void;
}

const TransactionReceipt = ({ transaction, onClose }: TransactionReceiptProps) => {

    const receiptRef = useRef<HTMLDivElement>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const numberToWords = (num: number): string => {
        const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
        const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

        const inWords = (n: number): string => {
            if ((n = n.toString() as any).length > 9) return 'overflow';
            const _n: any = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
            if (!_n) return "";
            let str = '';
            str += (_n[1] != 0) ? (a[Number(_n[1])] || b[_n[1][0]] + ' ' + a[_n[1][1]]) + 'Crore ' : '';
            str += (_n[2] != 0) ? (a[Number(_n[2])] || b[_n[2][0]] + ' ' + a[_n[2][1]]) + 'Lakh ' : '';
            str += (_n[3] != 0) ? (a[Number(_n[3])] || b[_n[3][0]] + ' ' + a[_n[3][1]]) + 'Thousand ' : '';
            str += (_n[4] != 0) ? (a[Number(_n[4])] || b[_n[4][0]] + ' ' + a[_n[4][1]]) + 'Hundred ' : '';
            str += (_n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(_n[5])] || b[_n[5][0]] + ' ' + a[_n[5][1]]) : '';
            return str;
        };

        return inWords(num).trim();
    };

    const getAmountInWords = (amount: string) => {
        const cleanAmount = amount.replace(/[^\d.]/g, '');
        const num = parseFloat(cleanAmount);
        if (isNaN(num)) return "Zero";
        return `Rupees ${numberToWords(num)} Only`;
    };

    const captureScreenshot = async () => {
        if (!receiptRef.current) return null;
        try {
            setIsProcessing(true);
            // Wait a tiny bit for any layout adjustments
            await new Promise(resolve => setTimeout(resolve, 100));

            const dataUrl = await toPng(receiptRef.current, {
                quality: 1,
                pixelRatio: 3, // Ultra-sharp
                backgroundColor: '#000000',
                cacheBust: true,
                width: 360,
                height: 640,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top center',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px 0',
                    height: '640px',
                    width: '360px'
                }
            });
            return dataUrl;
        } catch (error) {
            console.error('Failed to capture screenshot:', error);
            return null;
        } finally {
            setIsProcessing(false);
        }
    };

    const handleShare = async () => {
        const dataUrl = await captureScreenshot();
        if (!dataUrl) return;

        try {
            const blob = await (await fetch(dataUrl)).blob();
            const file = new File([blob], `TFC-Pay-Receipt-${transaction.referenceId || Date.now()}.png`, { type: 'image/png' });

            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'TFC Pay Transaction Receipt',
                    text: `Payment of ₹${transaction.amount} successful to ${transaction.name}`
                });
            } else {
                handleDownload(dataUrl);
            }
        } catch (error) {
            console.error('Sharing failed:', error);
            handleDownload(dataUrl);
        }
    };

    const handleDownload = (dataUrlProp?: string) => {
        const triggerDownload = (url: string) => {
            const link = document.createElement('a');
            link.download = `TFC-Pay-Receipt-${transaction.referenceId || Date.now()}.png`;
            link.href = url;
            link.click();
        };

        if (dataUrlProp && typeof dataUrlProp === 'string') {
            triggerDownload(dataUrlProp);
        } else {
            captureScreenshot().then(url => {
                if (url) triggerDownload(url);
            });
        }
    };

    return (
        <div className="fixed inset-0 z-[100] bg-white dark:bg-transparent flex flex-col animate-in slide-in-from-bottom duration-500 font-sans">
            <div className="flex-1 overflow-y-auto" id="receipt-scroll-area">
                {/* Wrap content for screenshot capture */}
                <div ref={receiptRef} className="p-4 pt-8 pb-8 space-y-4 bg-white dark:bg-transparent">
                    {/* Header */}
                    <header className="flex flex-col items-center pb-4">
                        <div className="flex items-center gap-1 mb-1">
                            <span className="text-2xl font-[900] text-[#4ade80] tracking-tight">TFC</span>
                            <span className="text-2xl font-[900] text-white tracking-tight">PAY</span>
                        </div>
                        <p className="text-[9px] text-white font-medium tracking-[0.2em] uppercase opacity-90">Payment Receipt</p>
                    </header>

                    {/* Success Card */}
                    <div className="bg-[#10281b] rounded-t-[20px] rounded-b-[20px] p-6 pb-5 flex flex-col items-center shadow-2xl relative overflow-hidden w-full max-w-[340px] mx-auto border border-white/5">
                        {/* Background Glow */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-[#4ade80] opacity-5 blur-[50px] rounded-full pointer-events-none -mt-10 -mr-10" />

                        {/* Badge */}
                        <div className="bg-[#1f4a2c] flex items-center gap-2 px-3 py-1.5 rounded-full mb-4">
                            <div className="w-4 h-4 rounded-full bg-[#22c55e] flex items-center justify-center">
                                <Check className="w-3 h-3 text-white stroke-[4]" />
                            </div>
                            <span className="text-white text-[13px] font-bold tracking-wide">Payment Successful</span>
                        </div>

                        {/* Amount */}
                        <div className="text-center w-full">
                            <div className="flex items-center justify-center text-[#4ade80] font-bold">
                                <span className="text-3xl mr-1 self-start mt-2">₹</span>
                                <span className="text-[3rem] leading-none tracking-tight">{transaction.amount.replace(/[^\d,.]/g, '')}</span>
                            </div>
                            <p className="text-[#aebbb3] text-[12px] font-normal capitalize tracking-wide mb-4 opacity-80">
                                {getAmountInWords(transaction.amount)}
                            </p>

                            {/* Quick Actions inside Amount Card */}
                            <div className="flex items-center gap-2 w-full pt-4 border-t border-white/[0.05]">
                                <Button
                                    onClick={handleShare}
                                    disabled={isProcessing}
                                    variant="outline" size="sm" className="flex-1 bg-white/[0.03] border-white/10 text-white text-[10px] h-8 px-2 rounded-lg flex items-center justify-center gap-1.5 active:bg-white/10 transition-colors"
                                >
                                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Share2 className="w-3 h-3" />}
                                    Share
                                </Button>
                                <Button
                                    onClick={() => handleDownload()}
                                    disabled={isProcessing}
                                    variant="outline" size="sm" className="flex-1 bg-white/[0.03] border-white/10 text-white text-[10px] h-8 px-2 rounded-lg flex items-center justify-center gap-1.5 active:bg-white/10 transition-colors"
                                >
                                    {isProcessing ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
                                    Download
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Details Card */}
                    <div className="bg-[#1c1d21] rounded-t-[20px] shadow-2xl relative w-full max-w-[340px] mx-auto group overflow-hidden">
                        <div className="p-5 space-y-4 pb-12">
                            {/* To Section */}
                            <div className="flex flex-col">
                                <p className="text-white text-[13px] font-bold">
                                    To: {transaction.name}
                                </p>
                                <p className="text-[#9ca3af] text-[11px] font-medium opacity-70">
                                    {transaction.method || "TFC Pay Wallet"}
                                </p>
                            </div>

                            {/* Dashed Line */}
                            <div className="w-full border-t border-dashed border-white/5" />

                            {/* From Section */}
                            <div className="flex flex-col">
                                <p className="text-white text-[13px] font-bold">
                                    From: Ramesh Kumar
                                </p>
                                <p className="text-[#9ca3af] text-[11px] font-medium opacity-70">
                                    State Bank Of India - 3094
                                </p>
                            </div>

                            {/* Metadata */}
                            <div className="pt-0.5 space-y-0.5">
                                <p className="text-[#9ca3af] text-[10px] font-medium opacity-50">
                                    UPI Ref ID: {transaction.referenceId || "315824749631"}
                                </p>
                                <p className="text-[#9ca3af] text-[10px] font-medium opacity-50">
                                    {transaction.date || "05 Jun"}, {transaction.time || "03:28 PM"}
                                </p>
                            </div>
                        </div>

                        {/* Zigzag Paper Tear Effect - Placed inside the overflow-hidden card */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none z-10">
                            <svg
                                className="block w-full h-[12px] text-black fill-current"
                                viewBox="0 0 1200 30"
                                preserveAspectRatio="none"
                            >
                                <path d="M0,30 L15,0 L30,30 L45,0 L60,30 L75,0 L90,30 L105,0 L120,30 L135,0 L150,30 L165,0 L180,30 L195,0 L210,30 L225,0 L240,30 L255,0 L270,30 L285,0 L300,30 L315,0 L330,30 L345,0 L360,30 L375,0 L390,30 L405,0 L420,30 L435,0 L450,30 L465,0 L480,30 L495,0 L510,30 L525,0 L540,30 L555,0 L570,30 L585,0 L600,30 L615,0 L630,30 L645,0 L660,30 L675,0 L690,30 L705,0 L720,30 L735,0 L750,30 L765,0 L780,30 L795,0 L810,30 L825,0 L840,30 L855,0 L870,30 L885,0 L900,30 L915,0 L930,30 L945,0 L960,30 L975,0 L990,30 L1005,0 L1020,30 L1035,0 L1050,30 L1065,0 L1080,30 L1095,0 L1110,30 L1125,0 L1140,30 L1155,0 L1170,30 L1185,0 L1200,30 V30 H0 Z" />
                            </svg>
                        </div>
                    </div>

                    {/* Footer Badges */}
                    <div className="flex flex-col items-center gap-4 pt-4 pb-2 text-center">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#4ade80] fill-[#4ade80]/10" />
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase opacity-80">100% Secure Payments</span>
                        </div>

                        {/* Bharat BillPay Logo */}
                        <div className="flex flex-col items-center">
                            <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mb-1 opacity-70">Powered BY</p>
                            <img
                                src={`${getAssetPath("/bharat-billpay-seeklogo.svg")}?v=${Date.now()}`}
                                alt="Bharat BillPay"
                                crossOrigin="anonymous"
                                className="h-10 w-auto object-contain opacity-90"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Always Visible Close Button */}
            <div className="p-4 pt-2 border-t border-white/5 bg-white/80 dark:bg-transparent/80 backdrop-blur-xl">
                <Button
                    onClick={onClose}
                    className="w-full bg-[#021a10] hover:bg-[#021a10]/90 text-white font-[900] rounded-xl h-12 text-sm shadow-lg active:scale-[0.98] transition-all uppercase tracking-wider"
                >
                    Close
                </Button>
            </div>
        </div>
    );
};

export default TransactionReceipt;

import { useRef, useState } from "react";
import { Share2, ArrowLeft, ShieldCheck } from "lucide-react";
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

    const [forceFail, setForceFail] = useState(false); // TEMPORARY: For visual testing
    const isSuccess = !forceFail && transaction.status !== 'failed';

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
            await new Promise(resolve => setTimeout(resolve, 100));
            const dataUrl = await toPng(receiptRef.current, {
                quality: 1,
                pixelRatio: 3,
                backgroundColor: '#000000',
                cacheBust: true,
                width: 360,
                style: {
                    transform: 'scale(1)',
                    transformOrigin: 'top center',
                    padding: '0',
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
            const file = new File([blob], `TFC-Pay-Receipt-${transaction.id || Date.now()}.png`, { type: 'image/png' });
            if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    files: [file],
                    title: 'TFC Pay Transaction Receipt',
                    text: `Payment of ${transaction.amount} ${isSuccess ? 'successful' : 'failed'}`
                });
            } else {
                const link = document.createElement('a');
                link.download = `TFC-Pay-Receipt-${transaction.id || Date.now()}.png`;
                link.href = dataUrl;
                link.click();
            }
        } catch (error) {
            console.error('Sharing failed:', error);
        }
    };

    const DetailRow = ({ label, value, highlight = false }: { label: string, value: string | number, highlight?: boolean }) => (
        <div className="flex justify-between items-start py-[3px]">
            <span className="text-[11px] font-semibold text-white/80 truncate mr-3">{label}</span>
            <span className={`text-[11px] font-medium text-right shrink-0 ${highlight ? (isSuccess ? 'text-green-400' : 'text-red-400') : 'text-white/60'}`}>
                {value}
            </span>
        </div>
    );

    // Theme colors
    const accentColor = isSuccess ? '#4ade80' : '#ef4444';
    const lightingColor = isSuccess ? 'rgba(74,222,128,0.5)' : 'rgba(239,68,68,0.5)';
    const statusIcon = isSuccess
        ? getAssetPath("/success icon for invoice.webp")
        : getAssetPath("/failed icon for invoice.webp");

    const amountClean = transaction.amount.replace(/[^\d,.]/g, '');

    return (
        <div className="fixed inset-0 z-[100] bg-black flex flex-col font-sans text-white">
            {/* Top Bar */}
            <div className="flex items-center justify-between px-4 py-3 relative z-20">
                <button onClick={onClose} className="flex items-center gap-2 text-white active:opacity-60 transition-opacity">
                    <ArrowLeft className="w-5 h-5" />
                    <span className="font-semibold text-base">Back</span>
                </button>

                {/* TEMPORARY TESTING BUTTON */}
                <button
                    onClick={() => setForceFail(!forceFail)}
                    className="bg-yellow-500 text-black px-2 py-1 text-[10px] rounded font-bold absolute left-24 z-50"
                >
                    {forceFail ? "RESET" : "TEST FAIL"}
                </button>
                <button
                    onClick={handleShare}
                    disabled={isProcessing}
                    className="px-5 py-2 rounded-full flex items-center gap-2 font-bold text-sm shadow-sm active:scale-95 transition-all bg-transparent border-2 border-white/50 text-white overflow-hidden relative animate-gold-shine"
                >
                    <Share2 className="w-4 h-4" />
                    Share
                </button>
            </div>

            <div className="flex-1 overflow-y-auto pb-24">
                <div ref={receiptRef} className="flex flex-col items-center min-h-full relative bg-black">
                    {/* Side Lighting Effects */}
                    <div
                        className="absolute top-[20%] -left-16 w-[180px] h-[400px] rounded-full blur-[90px] pointer-events-none opacity-60"
                        style={{ background: lightingColor }}
                    />
                    <div
                        className="absolute top-[20%] -right-16 w-[180px] h-[400px] rounded-full blur-[90px] pointer-events-none opacity-60"
                        style={{ background: lightingColor }}
                    />

                    {/* TFCPAY Logo */}
                    <div className="relative z-10 mt-6 mb-6">
                        <img
                            src={getAssetPath("/tfcpay-logo.png")}
                            alt="TFCPAY"
                            className="h-8 w-auto object-contain"
                        />
                    </div>

                    {/* 3D Shield Icon */}
                    <div className="relative z-10 mb-4">
                        <img
                            src={statusIcon}
                            alt={isSuccess ? "Payment Successful" : "Payment Failed"}
                            className="w-[140px] h-auto object-contain drop-shadow-2xl"
                        />
                    </div>

                    {/* Amount */}
                    <div className="relative z-10 text-center mb-2">
                        <div className="flex items-baseline justify-center font-[900]" style={{ color: accentColor }}>
                            <span className="text-3xl mr-1">₹</span>
                            <span className="text-[3.2rem] leading-none tracking-tight">{amountClean}</span>
                        </div>
                        {/* Accent underline bar */}
                        <div className="mx-auto mt-3 mb-1 w-12 h-[3px] rounded-full" style={{ backgroundColor: accentColor }} />
                        <p className="text-white/40 text-[11px] font-medium capitalize tracking-wide mt-2">
                            {getAmountInWords(transaction.amount)}
                        </p>
                    </div>

                    {/* Spacer */}
                    <div className="h-6" />

                    {/* Details Card */}
                    <div className="w-[88%] max-w-[360px] bg-[#1c1d21] rounded-t-[24px] shadow-2xl relative overflow-hidden">
                        <div className="p-6 space-y-5 pb-14">
                            {/* To Section */}
                            <div className="flex flex-col">
                                <p className="text-white text-[15px] font-bold">
                                    To: {transaction.name}
                                </p>
                                <p className="text-white/40 text-[12px] font-medium mt-0.5">
                                    {transaction.method || "TFC Pay Wallet"}
                                </p>
                            </div>

                            {/* Dashed Line */}
                            <div className="w-full border-t border-dashed border-white/[0.07]" />

                            {/* From Section */}
                            <div className="flex flex-col">
                                <p className="text-white text-[15px] font-bold">
                                    From: Ramesh Kumar
                                </p>
                                <p className="text-white/40 text-[12px] font-medium mt-0.5">
                                    State Bank Of India - 3094
                                </p>
                            </div>

                            {/* Dashed Line */}
                            <div className="w-full border-t border-dashed border-white/[0.07]" />

                            {/* Transaction Details */}
                            <div className="space-y-0">
                                <DetailRow label="Date & time" value={`${transaction.date || '02-02-2026'} ${transaction.time || '23:18:47 PM'}`} />
                                <DetailRow label="Number" value={transaction.referenceId || '8368646881'} />
                                <DetailRow label="Order ID" value={`TFCREC${(transaction.id || '327028989').substring(0, 9)}05001`} />
                                <DetailRow label="Txn ID" value={`RBREC${(transaction.id || '326731989').substring(0, 9)}01005`} />
                                <DetailRow label="Operator ID" value="BR000568018849" />
                                <DetailRow label="Total Amount Paid" value={`₹ ${amountClean}`} />
                                <DetailRow label="Cashback Applied!" value={isSuccess ? "-₹ 3.11" : "₹ 0.00"} highlight />
                                <DetailRow label="Paid From Wallet" value="₹ 100.00" />
                                <DetailRow label="Paid Online" value="₹ 135.89" />
                                <DetailRow label="TDS" value="₹ 0.00" />
                                <DetailRow label="GST" value="₹ 0.00" />
                            </div>

                            {/* Response Status */}
                            <div className="text-center pt-2">
                                <p className="text-[11px] font-bold tracking-wider" style={{ color: isSuccess ? '#9ca3af' : '#ef4444' }}>
                                    {isSuccess ? 'Response Success' : 'Response Failed'}
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => { }} // Add help handler later
                                    className={`flex-1 font-bold py-2.5 rounded-full shadow-sm active:scale-[0.98] transition-all tracking-wide text-xs ${isSuccess ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-red-500 hover:bg-red-400 text-white'}`}
                                >
                                    Get Help
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 font-bold py-2.5 rounded-full shadow-lg active:scale-[0.98] transition-all tracking-wide text-xs border-2 bg-transparent"
                                    style={{ borderColor: accentColor, color: accentColor }}
                                >
                                    Done
                                </button>
                            </div>
                        </div>

                        {/* Zigzag Paper Tear Effect */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none h-[15px]">
                            <svg className="block w-full h-full text-black fill-current" viewBox="0 0 1200 30" preserveAspectRatio="none">
                                <defs>
                                    <pattern id="tear-pattern" x="0" y="0" width="40" height="30" patternUnits="userSpaceOnUse">
                                        <path d="M0,30 Q20,0 40,30" fill="currentColor" />
                                    </pattern>
                                </defs>
                                <rect width="1200" height="30" fill="url(#tear-pattern)" />
                            </svg>
                        </div>
                    </div>

                    {/* Footer Badges */}
                    <div className="flex flex-col items-center gap-4 pt-8 pb-6 text-center">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-4 h-4" style={{ color: accentColor }} />
                            <span className="text-white text-[10px] font-bold tracking-widest uppercase opacity-70">100% Secure Payments</span>
                        </div>

                        {/* Bharat BillPay Logo */}
                        <div className="flex flex-col items-center">
                            <p className="text-[7px] text-gray-500 font-bold uppercase tracking-widest mb-1 opacity-60">Powered By</p>
                            <img
                                src={`${getAssetPath("/bharat-billpay-seeklogo.svg")}?v=1`}
                                alt="Bharat BillPay"
                                crossOrigin="anonymous"
                                className="h-8 w-auto object-contain opacity-80"
                            />
                        </div>
                    </div>
                </div>
            </div>


        </div>
    );
};

export default TransactionReceipt;


import { CheckCircle2, XCircle, Clock, Share2, AlertCircle, ArrowLeft, Copy, Download } from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import type { Transaction } from "../../types";

import { getAssetPath } from "../../utils/assets";

interface TransactionReceiptProps {
    transaction: Transaction;
    onClose: () => void;
    onShare?: () => void;
    onReport?: () => void;
}

const TransactionReceipt = ({ transaction, onClose, onShare, onReport }: TransactionReceiptProps) => {
    const status = transaction.status || 'success';
    const statusColor = status === 'success' ? 'text-green-700 dark:text-green-500' : status === 'failed' ? 'text-red-500' : 'text-yellow-500';
    const statusBg = status === 'success' ? 'bg-green-600/10 dark:bg-green-500/10' : status === 'failed' ? 'bg-red-500/10 dark:bg-red-500/10' : 'bg-yellow-500/10 dark:bg-yellow-500/10';
    const StatusIcon = status === 'success' ? CheckCircle2 : status === 'failed' ? XCircle : Clock;

    // Mock data if missing
    const txnId = transaction.id || `TFC${Math.floor(Math.random() * 1000000000)}`;
    const date = transaction.date || new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
    const refId = transaction.referenceId || `UTR${Math.floor(Math.random() * 100000000000)}`;
    const method = transaction.method || 'Unified Payments Interface (UPI)';

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text);
        // Toast or feedback could go here
    };

    return (
        <div className="fixed inset-0 z-50 flex flex-col bg-background animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
                <button
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground text-lg">Transaction Details</h2>
            </header>

            <div className="flex-1 overflow-y-auto p-4 pb-24">
                {/* Receipt Card */}
                <Card className="bg-card border-border overflow-hidden shadow-lg relative">
                    {/* Top Status */}
                    <div className={`${statusBg} p-6 flex flex-col items-center justify-center border-b border-border/10`}>
                        <div className={`w-16 h-16 rounded-full bg-background flex items-center justify-center mb-3 shadow-sm`}>
                            <StatusIcon className={`w-8 h-8 ${statusColor}`} />
                        </div>
                        <h3 className={`text-xl font-bold capitalize ${statusColor}`}>Payment {status}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{date} • {transaction.time}</p>
                    </div>

                    <CardContent className="p-0">
                        {/* Amount & Receiver */}
                        <div className="p-6 text-center border-b border-border border-dashed">
                            <p className="text-sm text-muted-foreground mb-1">
                                {transaction.isCredit ? 'Received from' : 'Paid to'}
                            </p>
                            <h2 className="text-xl font-bold text-foreground mb-2">{transaction.name}</h2>
                            <h1 className="text-4xl font-bold text-foreground mb-1">
                                {transaction.isCredit ? '+' : '-'}{transaction.amount}
                            </h1>

                            {/* Actions */}
                            <div className="flex justify-center gap-4 mt-6">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full bg-card hover:bg-muted"
                                    onClick={onShare}
                                >
                                    <Share2 className="w-4 h-4 mr-2" /> Share
                                </Button>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="rounded-full bg-card hover:bg-muted"
                                >
                                    <Download className="w-4 h-4 mr-2" /> Download
                                </Button>
                            </div>
                        </div>

                        {/* Details List */}
                        <div className="p-6 space-y-4">
                            <div className="flex justify-between items-start">
                                <span className="text-sm text-muted-foreground">Transaction ID</span>
                                <div className="text-right">
                                    <span className="text-sm font-medium text-foreground block">{txnId}</span>
                                    <button
                                        onClick={() => handleCopy(txnId)}
                                        className="text-xs text-green-700 dark:text-green-500 font-bold hover:underline flex items-center justify-end gap-1 mt-0.5"
                                    >
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between items-start">
                                <span className="text-sm text-muted-foreground">Reference ID (UTR)</span>
                                <div className="text-right">
                                    <span className="text-sm font-medium text-foreground block">{refId}</span>
                                    <button
                                        onClick={() => handleCopy(refId)}
                                        className="text-xs text-green-700 dark:text-green-500 font-bold hover:underline flex items-center justify-end gap-1 mt-0.5"
                                    >
                                        <Copy className="w-3 h-3" /> Copy
                                    </button>
                                </div>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Payment Method</span>
                                <span className="text-sm font-medium text-foreground">{method}</span>
                            </div>

                            <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Debited from</span>
                                <div className="flex items-center gap-2">
                                    <div className="w-4 h-4 bg-gray-200 rounded-full" /> {/* Bank Logo Placeholder */}
                                    <span className="text-sm font-medium text-foreground">HDFC Bank **** 1234</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>

                    {/* Decorative Serrated Edge (Visual trick) */}
                    <div className="absolute bottom-0 left-0 right-0 h-4 bg-background" style={{
                        maskImage: 'radial-gradient(circle at 10px 0, transparent 0, transparent 10px, black 10px)',
                        maskSize: '20px 20px',
                        maskPosition: '-10px 0'
                    }} />
                </Card>

                {/* Report Issue Button */}
                <div className="mt-6">
                    <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-card border border-transparent hover:border-border h-14"
                        onClick={onReport}
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                <AlertCircle className="w-4 h-4 text-red-500" />
                            </div>
                            <span className="font-medium text-foreground">Report an issue with this payment</span>
                        </div>
                        <ArrowLeft className="w-4 h-4 rotate-180 text-muted-foreground" />
                    </Button>
                </div>

                <div className="mt-8 text-center">
                    <img src={getAssetPath("/tfcpay-logo.png")} alt="TFC Pay" className="h-6 mx-auto opacity-50 grayscale" />
                    <p className="text-[10px] text-muted-foreground mt-2">Powered by TFC Pay Secure Systems</p>
                </div>
            </div>
        </div>
    );
};

export default TransactionReceipt;

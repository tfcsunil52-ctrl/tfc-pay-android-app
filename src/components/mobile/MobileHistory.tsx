import { useState } from "react";
import {
    ArrowLeft, Smartphone, Zap, CreditCard, Wallet, ChevronRight,
    CheckCircle2, XCircle, Clock, Filter, Calendar, HelpCircle, Tag,
    PieChart as PieChartIcon, TrendingUp, TrendingDown
} from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import type { Transaction } from "../../types";
import TransactionReceipt from "./TransactionReceipt";
import { getAssetPath } from "../../utils/assets";

interface MobileHistoryProps {
    isDarkMode?: boolean;
    transactions?: Transaction[];
    onGetHelp?: (message: string) => void;
    activeView?: 'home' | 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet' | 'spending' | 'all_history';
    onBack?: () => void;
}

const MobileHistory = ({ isDarkMode, transactions = [], onGetHelp, activeView: initialView = 'home', onBack }: MobileHistoryProps) => {
    const [activeView, setActiveView] = useState<'home' | 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet' | 'spending' | 'all_history'>(initialView);
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filterStartDate, setFilterStartDate] = useState('');
    const [filterEndDate, setFilterEndDate] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'failed' | 'pending'>('all');
    const [filterTransactionId, setFilterTransactionId] = useState('');
    const [periodFilter, setPeriodFilter] = useState<'this_month' | '15_days' | 'last_month'>('this_month');
    const [selectedTransactions, setSelectedTransactions] = useState<string[]>([]);
    const [viewingReceipt, setViewingReceipt] = useState<Transaction | null>(null);

    const handleTransactionSelect = (id: string) => {
        setSelectedTransactions(prev =>
            prev.includes(id) ? prev.filter(txId => txId !== id) : [...prev, id]
        );
    };

    const handleGetHelp = () => {
        if (selectedTransactions.length === 0) {
            alert("Please select at least one transaction to get help");
            return;
        }

        const selectedDetails = transactions
            .filter(tx => tx.id && selectedTransactions.includes(tx.id))
            .map(tx => `Transaction ID: ${tx.id || 'N/A'}\nAmount: ${tx.amount}\nDate: ${tx.date || 'N/A'}\nStatus: ${tx.status || 'N/A'}`)
            .join('\n\n');

        const message = `I need help with the following transaction(s):\n${selectedDetails}\n\nPlease look into this.`;
        onGetHelp?.(message);
    };


    // Filter transactions
    const getFilteredTransactions = (type?: Transaction['type']) => {
        let filtered = type ? transactions.filter((tx: Transaction) => tx.type === type) : transactions;

        // Apply advanced filters if set (overrides period filters if dates are manually selected)
        if (filterStartDate || filterEndDate || filterStatus !== 'all' || filterTransactionId) {
            if (filterStartDate) {
                const start = new Date(filterStartDate);
                filtered = filtered.filter(tx => new Date(tx.date || '') >= start);
            }
            if (filterEndDate) {
                const end = new Date(filterEndDate);
                end.setHours(23, 59, 59, 999); // End of day
                filtered = filtered.filter(tx => new Date(tx.date || '') <= end);
            }
            if (filterStatus !== 'all') {
                filtered = filtered.filter(tx => tx.status === filterStatus);
            }
            if (filterTransactionId) {
                filtered = filtered.filter(tx =>
                    tx.id?.toLowerCase().includes(filterTransactionId.toLowerCase()) ||
                    tx.referenceId?.toLowerCase().includes(filterTransactionId.toLowerCase())
                );
            }
            return filtered;
        }

        // Apply date filter
        const now = new Date(); // Using current system date
        const startDate = new Date(now);

        if (periodFilter === 'this_month') {
            startDate.setDate(1); // First day of current month
        } else if (periodFilter === '15_days') {
            startDate.setDate(now.getDate() - 15);
        } else if (periodFilter === 'last_month') {
            startDate.setMonth(now.getMonth() - 1);
            startDate.setDate(1);
            const endDate = new Date(now.getFullYear(), now.getMonth(), 0);
            filtered = filtered.filter((tx: Transaction) => {
                const txDate = new Date(tx.date || '');
                return txDate >= startDate && txDate <= endDate;
            });
            return filtered;
        }

        return filtered.filter((tx: Transaction) => new Date(tx.date || '') >= startDate);
    };

    // Calculate spending by category
    const getSpendingByCategory = () => {
        const transactionsData = getFilteredTransactions();
        const categories: { [key: string]: number } = {};

        transactionsData.forEach((tx: Transaction) => {
            if (tx.status === 'success' && !tx.isCredit) {
                const category = tx.category || 'Other';
                const amount = typeof tx.amount === 'string' ? parseFloat(tx.amount.replace(/[^0-9.]/g, '')) : tx.amount;
                categories[category] = (categories[category] || 0) + amount;
            }
        });

        return Object.entries(categories).map(([name, value]) => ({ name, value }));
    };

    // Render History Home View
    const renderHomeView = () => (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Background Blurs for Light Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute top-[20%] left-[10%] w-[60%] h-[40%] rounded-full bg-blue-100/40 blur-[80px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[40%] rounded-full bg-purple-100/40 blur-[80px]" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10">
                {/* Header */}
                <header className="flex items-center justify-between">
                    <div>
                        <h1 className="text-xl font-bold text-foreground mb-1">Transaction History</h1>
                        <p className="text-sm text-muted-foreground">View your transaction history and reports</p>
                    </div>
                    <button
                        onClick={() => {
                            setActiveView('all_history');
                            setIsFilterModalOpen(true);
                        }}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted/50 transition-colors shadow-sm"
                    >
                        <Filter className="w-5 h-5 text-muted-foreground" />
                    </button>
                </header>

                {/* Quick Access Cards */}
                <section className="grid grid-cols-2 gap-3">
                    <Card
                        className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => setActiveView('mobile_recharge')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="w-12 h-12 bg-green-600/10 dark:bg-green-500/10 rounded-xl flex items-center justify-center">
                                    <Smartphone className="w-6 h-6 text-green-700 dark:text-green-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground text-sm">Mobile Recharge</h3>
                                    <p className="text-xs text-muted-foreground">{transactions.filter(t => t.type === 'mobile_recharge').length} transactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => setActiveView('bill_payment')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="w-12 h-12 bg-blue-600/10 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-blue-700 dark:text-blue-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground text-sm">Bill Payments</h3>
                                    <p className="text-xs text-muted-foreground">{transactions.filter(t => t.type === 'bill_payment').length} transactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => setActiveView('cc_to_bank')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="w-12 h-12 bg-purple-600/10 dark:bg-purple-500/10 rounded-xl flex items-center justify-center">
                                    <CreditCard className="w-6 h-6 text-purple-700 dark:text-purple-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground text-sm">CC to Bank</h3>
                                    <p className="text-xs text-muted-foreground">{transactions.filter(t => t.type === 'cc_to_bank').length} transactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card
                        className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.02] hover:shadow-lg"
                        onClick={() => setActiveView('wallet')}
                    >
                        <CardContent className="p-4">
                            <div className="flex flex-col gap-3">
                                <div className="w-12 h-12 bg-orange-600/10 dark:bg-orange-500/10 rounded-xl flex items-center justify-center">
                                    <Wallet className="w-6 h-6 text-orange-700 dark:text-orange-500" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-foreground text-sm">Wallet History</h3>
                                    <p className="text-xs text-muted-foreground">{transactions.filter(t => t.type === 'wallet').length} transactions</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </section>

                {/* Spending Report Card */}
                {/* Spending Report Card */}
                <Card
                    className="bg-gradient-to-r from-green-600/20 to-green-600/10 dark:from-green-500/20 dark:to-green-500/10 border-green-700/30 dark:border-green-500/30 cursor-pointer hover:scale-[1.01] transition-all relative overflow-hidden group"
                    onClick={() => setActiveView('spending')}
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shine z-0 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-shine-occasional z-0 pointer-events-none" />
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-[#021a10] rounded-full flex items-center justify-center">
                                    <PieChartIcon className="w-6 h-6 text-white dark:text-white" />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-foreground">Spending Reports</h4>
                                    <p className="text-sm text-muted-foreground">View detailed spending analysis</p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-green-700 dark:text-green-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <section>
                    <h3 className="font-semibold text-foreground mb-3">Recent Transactions</h3>
                    <div className="space-y-2">
                        {transactions.slice(0, 5).map((tx) => (
                            <Card
                                key={tx.id}
                                className="bg-card border-border cursor-pointer active:scale-[0.98] transition-all hover:bg-muted/30"
                                onClick={() => setViewingReceipt(tx)}
                            >
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tx.status === 'pending' ? 'bg-yellow-600/20 dark:bg-yellow-500/20' :
                                            (tx.status === 'failed' || !tx.isCredit) ? 'bg-red-600/20 dark:bg-red-500/20' :
                                                'bg-green-600/20 dark:bg-green-500/20'
                                            }`}>
                                            {typeof tx.icon === 'string' ? (
                                                <img src={getAssetPath(tx.icon)} alt={tx.name} className="w-6 h-6 object-contain" />
                                            ) : (
                                                <tx.icon className={`w-5 h-5 ${tx.status === 'pending' ? 'text-yellow-700 dark:text-yellow-500' :
                                                    (tx.status === 'failed' || !tx.isCredit) ? 'text-red-700 dark:text-red-500' :
                                                        'text-green-700 dark:text-green-500'
                                                    }`} />
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">{tx.name}</p>
                                            <p className="text-xs text-muted-foreground">{tx.time} • {tx.date}</p>
                                        </div>
                                    </div>
                                    <span className={`font-semibold text-sm ${tx.status === 'pending' ? 'text-yellow-700 dark:text-yellow-500' :
                                        (tx.status === 'failed' || !tx.isCredit) ? 'text-red-700 dark:text-red-500' :
                                            'text-green-700 dark:text-green-500'
                                        }`}>
                                        {typeof tx.amount === 'string' ? tx.amount : `₹${tx.amount}`}
                                    </span>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );

    // Render Transaction List View
    const renderTransactionListView = (type: Transaction['type'], title: string, subtitle: string) => {
        const transactions = getFilteredTransactions(type);

        return (
            <div className="flex flex-col h-full bg-background overlay-gradient-bg animate-in slide-in-from-right duration-300 relative">
                {/* Header */}
                <header className="flex items-center justify-between p-4 border-b border-border bg-white dark:bg-card sticky top-0 z-10">
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => {
                                if (onBack && initialView !== 'home') {
                                    onBack();
                                } else {
                                    setActiveView('home');
                                    setSelectedTransactions([]);
                                }
                            }}
                            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-foreground" />
                        </button>
                        <div>
                            <h2 className="font-bold text-foreground text-lg">{title}</h2>
                            <p className="text-xs text-muted-foreground">{subtitle}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedTransactions.length > 0 && (
                            <Badge className="bg-green-600/20 dark:bg-green-500/20 text-green-700 dark:text-green-500 border-0">
                                {selectedTransactions.length}
                            </Badge>
                        )}
                        <button
                            onClick={() => setIsFilterModalOpen(true)}
                            className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted/50 transition-colors"
                        >
                            <Filter className="w-5 h-5 text-muted-foreground" />
                        </button>
                    </div>
                </header>

                {/* Filter Modal */}
                {isFilterModalOpen && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <Card className="w-full max-w-sm bg-card border-border shadow-2xl animate-in zoom-in-95 duration-200">
                            <CardContent className="p-5 space-y-5">
                                <h3 className="text-lg font-bold text-foreground">Filter Transactions</h3>

                                {/* Date Range */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-muted-foreground font-medium">From</label>
                                        <input
                                            type="date"
                                            value={filterStartDate}
                                            onChange={(e) => setFilterStartDate(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-600/20"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-xs text-muted-foreground font-medium">To</label>
                                        <input
                                            type="date"
                                            value={filterEndDate}
                                            onChange={(e) => setFilterEndDate(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-600/20"
                                        />
                                    </div>
                                </div>

                                {/* Status Selection */}
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground font-medium">Choose Status</label>
                                    <div className="flex flex-wrap gap-2">
                                        {(['all', 'success', 'failed', 'pending'] as const).map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`px-3 py-1.5 rounded-md text-xs font-medium capitalize transition-all border ${filterStatus === status
                                                    ? 'bg-green-600/10 border-green-600 dark:border-green-500 text-green-700 dark:text-green-500'
                                                    : 'bg-background border-border text-muted-foreground hover:bg-muted'
                                                    }`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Transaction ID */}
                                <div className="space-y-2">
                                    <label className="text-xs text-muted-foreground font-medium">Transaction ID</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                        <input
                                            type="text"
                                            placeholder="Search Transaction ID"
                                            value={filterTransactionId}
                                            onChange={(e) => setFilterTransactionId(e.target.value)}
                                            className="w-full bg-background border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-green-600/20 placeholder:text-muted-foreground/50"
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-2">
                                    <Button
                                        variant="outline"
                                        className="flex-1 border-border text-foreground hover:bg-muted"
                                        onClick={() => setIsFilterModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-[#021a10] hover:bg-[#021a10]/90 text-white"
                                        onClick={() => {
                                            // Filters are already applied via state, just close modal
                                            setIsFilterModalOpen(false);
                                        }}
                                    >
                                        Apply Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {/* Period Filter */}
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        <button
                            onClick={() => setPeriodFilter('this_month')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === 'this_month'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setPeriodFilter('15_days')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === '15_days'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            Last 15 Days
                        </button>
                        <button
                            onClick={() => setPeriodFilter('last_month')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === 'last_month'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            Last Month
                        </button>
                    </div>

                    {/* Transactions List */}
                    <div className="space-y-3">
                        {transactions.length > 0 ? (
                            transactions.map((tx) => {
                                const txId = tx.id || '';
                                return (
                                    <Card
                                        key={txId}
                                        className={`bg-card border transition-all cursor-pointer ${selectedTransactions.includes(txId)
                                            ? 'border-green-700 dark:border-green-500 bg-green-600/5 dark:bg-green-500/5'
                                            : 'border-border hover:border-green-700/50 dark:hover:border-green-500/50'
                                            }`}
                                        onClick={(e) => {
                                            // Provide both selection and direct view
                                            if ((e.target as HTMLElement).closest('.check-icon')) {
                                                handleTransactionSelect(txId);
                                            } else {
                                                setViewingReceipt(tx);
                                            }
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex items-center gap-3 flex-1">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${tx.status === 'pending' ? 'bg-yellow-600/20 dark:bg-yellow-500/20' :
                                                        (tx.status === 'failed' || !tx.isCredit) ? 'bg-red-600/20 dark:bg-red-500/20' :
                                                            'bg-green-600/20 dark:bg-green-500/20'
                                                        }`}>
                                                        {typeof tx.icon === 'string' ? (
                                                            <img src={getAssetPath(tx.icon)} alt={tx.name} className="w-6 h-6 object-contain" />
                                                        ) : (
                                                            <tx.icon className={`w-5 h-5 ${tx.status === 'pending' ? 'text-yellow-700 dark:text-yellow-500' :
                                                                (tx.status === 'failed' || !tx.isCredit) ? 'text-red-700 dark:text-red-500' :
                                                                    'text-green-700 dark:text-green-500'
                                                                }`} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-semibold text-foreground truncate">{tx.name}</p>
                                                        <p className="text-xs text-muted-foreground">{tx.time} • {tx.date}</p>
                                                    </div>
                                                    {selectedTransactions.includes(tx.id || '') && (
                                                        <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-500 flex-shrink-0" />
                                                    )}
                                                </div>
                                                <span className={`font-bold text-sm ml-2 ${tx.isCredit ? 'text-green-700 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                                                    {typeof tx.amount === 'string' ? tx.amount : `₹${tx.amount}`}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-muted-foreground">Ref: {tx.referenceId}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-[10px] ${tx.status === 'success' ? 'border-green-700/20 text-green-700 dark:border-green-500/20 dark:text-green-500 bg-green-600/5' :
                                                        tx.status === 'pending' ? 'border-yellow-700/20 text-yellow-700 dark:border-yellow-500/20 dark:text-yellow-500 bg-yellow-600/5' :
                                                            'border-red-700/20 text-red-700 dark:border-red-500/20 dark:text-red-500 bg-red-600/5'
                                                        }`}
                                                >
                                                    {tx.status === 'success' ? (
                                                        <><CheckCircle2 className="w-3 h-3 mr-1" /> Success</>
                                                    ) : tx.status === 'pending' ? (
                                                        <><Clock className="w-3 h-3 mr-1" /> Pending</>
                                                    ) : (
                                                        <><XCircle className="w-3 h-3 mr-1" /> Failed</>
                                                    )}
                                                </Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">
                                <p className="text-sm">No transactions found for this period</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Action Bar */}
                {selectedTransactions.length > 0 && (
                    <div className="sticky bottom-0 p-4 bg-white dark:bg-card border-t border-border">
                        <Button
                            onClick={handleGetHelp}
                            className="w-full bg-[#021a10] hover:bg-[#021a10]/90 text-white font-bold"
                        >
                            <HelpCircle className="w-5 h-5 mr-2" />
                            Get Help for Selected ({selectedTransactions.length})
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    // Render Spending Report View
    const renderSpendingView = () => {
        const spendingData = getSpendingByCategory();
        const totalSpending = spendingData.reduce((sum, item) => sum + item.value, 0);

        // Simple pie chart colors
        const colors = ['#15803d', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#06b6d4'];

        return (
            <div className="flex flex-col h-full bg-background overlay-gradient-bg animate-in slide-in-from-right duration-300">
                {/* Header */}
                <header className="flex items-center p-4 border-b border-border bg-white dark:bg-card sticky top-0 z-10">
                    <button
                        onClick={() => {
                            if (onBack && initialView === 'spending') {
                                onBack();
                            } else {
                                setActiveView('home');
                            }
                        }}
                        className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 text-foreground" />
                    </button>
                    <div className="ml-4">
                        <h2 className="font-bold text-foreground text-lg">Spending Reports</h2>
                        <p className="text-xs text-muted-foreground">Analyze your expenses</p>
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-4 space-y-5">
                    {/* Period Filter */}
                    <div className="flex gap-2">
                        <button
                            onClick={() => setPeriodFilter('this_month')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === 'this_month'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            This Month
                        </button>
                        <button
                            onClick={() => setPeriodFilter('15_days')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === '15_days'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            Last 15 Days
                        </button>
                        <button
                            onClick={() => setPeriodFilter('last_month')}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${periodFilter === 'last_month'
                                ? 'bg-[#021a10] text-white'
                                : 'bg-card text-muted-foreground border border-border'
                                }`}
                        >
                            Last Month
                        </button>
                    </div>



                    {/* Circular Pie Chart Visualization */}
                    {spendingData.length > 0 ? (
                        <>
                            <Card className="bg-card border-border">
                                <CardContent className="p-6">
                                    <h3 className="font-semibold text-foreground mb-6 flex items-center gap-2">
                                        <PieChartIcon className="w-4 h-4 text-green-700 dark:text-green-500" />
                                        Category Breakdown
                                    </h3>

                                    {/* Modern SVG Donut Pie Chart - Compact & Bold */}
                                    <div className="flex justify-center mb-8 relative">
                                        <div className="relative w-40 h-40">
                                            {/* Background Track */}
                                            <svg viewBox="0 0 100 100" className="w-full h-full rotate-[-90deg]">
                                                <circle
                                                    cx="50"
                                                    cy="50"
                                                    r="35"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="16"
                                                    className="text-muted/20"
                                                />
                                                {(() => {
                                                    const sortedData = [...spendingData].sort((a, b) => b.value - a.value);
                                                    const total = sortedData.reduce((acc, item) => acc + item.value, 0);
                                                    let cumulativePercent = 0;

                                                    return sortedData.map((item, index) => {
                                                        const percent = total > 0 ? item.value / total : 0;
                                                        const circumference = 2 * Math.PI * 35; // r=35
                                                        const strokeDasharray = `${percent * circumference} ${circumference}`;
                                                        const strokeDashoffset = -cumulativePercent * circumference;
                                                        cumulativePercent += percent;

                                                        return (
                                                            <circle
                                                                key={item.name}
                                                                cx="50"
                                                                cy="50"
                                                                r="35"
                                                                fill="none"
                                                                stroke={colors[index % colors.length]}
                                                                strokeWidth="16"
                                                                strokeDasharray={strokeDasharray}
                                                                strokeDashoffset={strokeDashoffset}
                                                                className="transition-all duration-500 will-change-[stroke-dasharray]"
                                                            />
                                                        );
                                                    });
                                                })()}
                                            </svg>

                                            {/* Center Stats */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                                <span className="text-xl font-bold tracking-tighter text-foreground">
                                                    ₹{totalSpending.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                                    Total
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Category Breakdown with Progress Bars */}
                                    <div className="space-y-4">
                                        {[...spendingData].sort((a, b) => b.value - a.value).map((item, index) => {
                                            const percentage = totalSpending > 0 ? ((item.value / totalSpending) * 100).toFixed(1) : '0';
                                            const color = colors[index % colors.length];

                                            return (
                                                <div key={item.name} className="group">
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <div
                                                                className="w-2.5 h-2.5 rounded-full"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                            <span className="text-sm font-medium text-foreground">{item.name}</span>
                                                        </div>
                                                        <div className="text-right">
                                                            <span className="text-sm font-bold text-foreground">₹{item.value.toLocaleString()}</span>
                                                            <span className="text-xs text-muted-foreground ml-2">({percentage}%)</span>
                                                        </div>
                                                    </div>
                                                    {/* Progress Bar */}
                                                    <div className="w-full h-1.5 bg-muted/50 rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full rounded-full transition-all duration-700 ease-out"
                                                            style={{
                                                                width: `${percentage}%`,
                                                                backgroundColor: color
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Top Categories */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-4">
                                    <h3 className="font-semibold text-foreground mb-3">Top Spending Categories</h3>
                                    <div className="space-y-3">
                                        {[...spendingData].sort((a, b) => b.value - a.value).slice(0, 3).map((item, index) => (
                                            <div key={item.name} className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center"
                                                        style={{ backgroundColor: `${colors[index % colors.length]}20` }}
                                                    >
                                                        <span className="text-xs font-bold" style={{ color: colors[index % colors.length] }}>
                                                            #{index + 1}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                                                        <p className="text-[10px] text-muted-foreground">{((item.value / totalSpending) * 100).toFixed(1)}% of total</p>
                                                    </div>
                                                </div>
                                                <span className="text-sm font-bold text-green-700 dark:text-green-500">
                                                    ₹{item.value.toLocaleString()}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            <PieChartIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm font-medium">No spending data available</p>
                            <p className="text-xs mt-1">Make some transactions to see your spending report</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    // Main render
    if (activeView === 'mobile_recharge') {
        return renderTransactionListView('mobile_recharge', 'Mobile Recharge', 'All mobile recharge transactions');
    }

    if (activeView === 'bill_payment') {
        return renderTransactionListView('bill_payment', 'Bill Payments', 'All bill payment transactions');
    }

    if (activeView === 'cc_to_bank') {
        return renderTransactionListView('cc_to_bank', 'CC to Bank', 'All credit card to bank transfers');
    }

    if (activeView === 'wallet') {
        return renderTransactionListView('wallet', 'Wallet History', 'All wallet top-up transactions');
    }

    if (activeView === 'all_history') {
        return renderTransactionListView(undefined, 'All Transactions', 'View your complete history');
    }

    if (activeView === 'spending') {
        return renderSpendingView();
    }

    if (viewingReceipt) {
        return (
            <TransactionReceipt
                transaction={viewingReceipt}
                onClose={() => setViewingReceipt(null)}
            />
        );
    }

    return renderHomeView();
};

export default MobileHistory;

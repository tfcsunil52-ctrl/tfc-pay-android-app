import { useState, useEffect } from "react";
import {
    Search, ChevronRight, ArrowLeft, Loader2, CheckCircle2, Plus, Gift
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import type { TabType, Transaction } from "../../types";
import TransactionReceipt from "./TransactionReceipt";
import { getAssetPath } from "../../utils/assets";

// Service icon component for image-based icons
const ServiceIcon = ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={getAssetPath(src)} alt={alt} className={className} />
);

// Quick access services
const quickServices = [
    { icon: "/New icons/mobile prepaid.webp", title: "Mobile Prepaid" },
    { icon: "/New icons/mobile postpaid.webp", title: "Mobile Postpaid" },
    { icon: "/New icons/Layer 4.webp", title: "DTH Recharge" },
    { icon: "/New icons/Layer 5.webp", title: "Cable TV" },
    { icon: "/New icons/Layer 6.webp", title: "Electricity Bill" },
    { icon: "/New icons/Layer 7.webp", title: "Gas Cylinder" },
    { icon: "/New icons/Layer 8.webp", title: "Piped Gas" },
    { icon: "/New icons/Layer 9.webp", title: "Landline" },
    { icon: "/New icons/Layer 10.webp", title: "Fastag" },
    { icon: "/New icons/Layer 12.webp", title: "Broadband" },
    { icon: "/New icons/Layer 13.webp", title: "Broadband Postpaid" },
    { icon: "/New icons/data card.webp", title: "Datacard Prepaid" },
    { icon: "/New icons/Layer 16.webp", title: "Water Bill" },
    { icon: "/New icons/water supplier.webp", title: "Water Supplier" },
    { icon: "/New icons/Credit Card Icon v3.webp", title: "CC Bill Payment" },
    { icon: "/New icons/Layer 20.webp", title: "Rent Payment" },
    { icon: "/New icons/insurance.webp", title: "Insurance" },
    { icon: "/New icons/Layer 24.webp", title: "Loan Payment" },
    { icon: "/New icons/Layer 25.webp", title: "Fee Payment" },
    { icon: "/New icons/Metro Card Icon.webp", title: "Metro Card" },
    { icon: "/New icons/Layer 27.webp", title: "Subscription" },
    { icon: "/New icons/Layer 28.webp", title: "Traffic Challan" },
    { icon: "/New icons/Layer 29.webp", title: "Hospital Bills" },
    { icon: "/New icons/Layer 7.webp", title: "LPG Booking" },
    { icon: "/New icons/Layer 32.webp", title: "Municipality" },
    { icon: "/New icons/Layer 33.webp", title: "Prepaid Meter" },
    { icon: "/New icons/Layer 34.webp", title: "Donation" },
    { icon: "/New icons/Layer 3.webp", title: "Postpaid" },
    { icon: "/New icons/House tax.webp", title: "House Tax" },
];



const services = {
    recharge: [
        { icon: "/New icons/mobile prepaid.webp", title: "Mobile Prepaid", description: "All operators" },
        { icon: "/New icons/mobile postpaid.webp", title: "Mobile Postpaid", description: "Bill payments" },
        { icon: "/New icons/Layer 4.webp", title: "DTH Recharge", description: "Tata, Airtel, Dish" },
        { icon: "/New icons/Layer 5.webp", title: "Cable TV", description: "All cable providers" },
        { icon: "/New icons/Layer 12.webp", title: "Broadband", description: "Internet bills" },
        { icon: "/New icons/Layer 13.webp", title: "Broadband Postpaid", description: "Postpaid broadband" },
        { icon: "/New icons/data card.webp", title: "Datacard Prepaid", description: "Data card recharge" },
        { icon: "/New icons/Layer 10.webp", title: "Fastag", description: "Toll payments" },
        { icon: "/New icons/Metro Card Icon.webp", title: "Metro Card", description: "Recharge metro card" },
        { icon: "/New icons/Layer 26.webp", title: "Digital Voucher", description: "Gift cards & vouchers" },
        { icon: "/New icons/Layer 33.webp", title: "Prepaid Meter", description: "Electricity prepaid" },
    ],
    bills: [
        { icon: "/New icons/Layer 6.webp", title: "Electricity", description: "Pay electricity bills" },
        { icon: "/New icons/Layer 16.webp", title: "Water Bill", description: "All providers" },
        { icon: "/New icons/water supplier.webp", title: "Water Supplier", description: "Water supplier bills" },
        { icon: "/New icons/Layer 7.webp", title: "Gas Cylinder", description: "Book LPG cylinder" },
        { icon: "/New icons/Layer 7.webp", title: "LPG Booking", description: "Book new LPG" },
        { icon: "/New icons/Layer 8.webp", title: "Piped Gas", description: "Monthly piped gas" },
        { icon: "/New icons/Layer 9.webp", title: "Landline", description: "BSNL, MTNL, Airtel" },
        { icon: "/New icons/Layer 3.webp", title: "Postpaid", description: "Postpaid bills" },
        { icon: "/New icons/Layer 32.webp", title: "Municipal Tax", description: "Property tax" },
        { icon: "/New icons/House tax.webp", title: "House Tax", description: "House tax payment" },
        { icon: "/New icons/Layer 32.webp", title: "Municipality", description: "Civic services" },
        { icon: "/New icons/Layer 31.webp", title: "Housing Society", description: "Maintenance bills" },
        { icon: "/New icons/Layer 28.webp", title: "Traffic Challan", description: "Pay traffic fines" },
        { icon: "/New icons/Layer 29.webp", title: "Hospital Bills", description: "Medical bills" },
    ],
    premium: [
        { icon: "/New icons/Layer 20.webp", title: "Rent Payment", description: "Pay rent via card" },
        { icon: "/New icons/Credit Card Icon v3.webp", title: "CC Bill Payment", description: "Credit card bill" },
        { icon: "/New icons/Layer 26.webp", title: "Credit Card EMI", description: "EMI payments" },
        { icon: "/New icons/insurance.webp", title: "Insurance", description: "Health, Vehicle" },
        { icon: "/New icons/Layer 24.webp", title: "Loan Payment", description: "EMI & Loans" },
        { icon: "/New icons/Layer 25.webp", title: "Fee Payment", description: "Education fees" },
        { icon: "/New icons/Layer 25.webp", title: "Education Loan", description: "Student loan EMI" },
        { icon: "/New icons/Layer 27.webp", title: "Subscription", description: "OTT & streaming" },
        { icon: "/New icons/Layer 31.webp", title: "Apartment Bills", description: "Society dues" },
        { icon: "/New icons/Layer 34.webp", title: "Donation", description: "Charitable donations" },
    ],
};

interface MobileServicesProps {
    isDarkMode?: boolean;
    onPayment?: (amount: number, serviceName: string, type?: 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet', category?: string) => boolean;
    initialService?: string | null;
    onServiceConsumed?: () => void;
    onNavigate?: (tab: TabType) => void;
}

const MobileServices = ({
    isDarkMode,
    onPayment,
    initialService,
    onServiceConsumed,
    onNavigate
}: MobileServicesProps) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedService, setSelectedService] = useState<any>(null);
    const [isDeepLinked, setIsDeepLinked] = useState(false);

    // Handle initial service selection
    useEffect(() => {
        if (initialService) {
            const allServices = [...services.recharge, ...services.bills, ...services.premium];
            const found = allServices.find((s) => s.title.toLowerCase() === initialService.toLowerCase());
            if (found) {
                setSelectedService(found);
                setIsDeepLinked(true);
            }
        } else {
            // Reset when initialService becomes null
            setSelectedService(null);
            setIsDeepLinked(false);
        }
    }, [initialService]);


    if (selectedService) {
        return (
            <PaymentView
                service={selectedService}
                onBack={() => {
                    if (isDeepLinked) {
                        setIsDeepLinked(false);
                        setSelectedService(null);
                        onServiceConsumed?.();
                        onNavigate?.("home");
                    } else {
                        setSelectedService(null);
                    }
                }}
                onPayment={onPayment}
            />
        );
    }

    const allAvailableServices = [...services.recharge, ...services.bills, ...services.premium];
    const filteredServices = allAvailableServices.filter((service) =>
        service.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Background Blurs for Light Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute top-[10%] -right-[10%] w-[60%] h-[40%] rounded-full bg-green-200/30 blur-[80px]" />
                <div className="absolute bottom-[20%] -left-[10%] w-[50%] h-[30%] rounded-full bg-teal-100/40 blur-[60px]" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10">
                {/* Search - Moved to top, added padding to avoid back button */}
                <div className="relative mb-2 pl-12">
                    <Search className="absolute left-[3.75rem] top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 h-12 bg-card border-border text-foreground placeholder:text-muted-foreground shadow-sm focus:ring-green-500"
                    />
                </div>

                {/* Header */}
                <header className="pl-12">
                    <h1 className="text-xl font-bold text-foreground mb-1">All Services</h1>
                    <p className="text-sm text-muted-foreground">Pay bills & recharge instantly</p>
                </header>

                {/* Quick Services Grid */}
                <section className="grid grid-cols-5 gap-3">
                    {quickServices.map((service, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedService(service)}
                            className="flex flex-col items-center gap-2 p-2 rounded-xl hover:bg-card transition-colors"
                        >
                            <div className="w-14 h-14 bg-green-600/10 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mb-1">
                                <img src={getAssetPath(service.icon)} alt={service.title} className="w-9 h-9 object-contain" />
                            </div>
                            <span className="text-[10px] text-center text-muted-foreground leading-tight line-clamp-2">
                                {service.title}
                            </span>
                        </button>
                    ))}
                </section>

                {/* Services List - Merged categories */}
                <div className="space-y-3">
                    <h2 className="text-sm font-bold text-foreground px-1 mb-2">Service Categories</h2>
                    {filteredServices.map((service, index) => (
                        <Card
                            key={index}
                            className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.01] hover:shadow-lg hover:shadow-green-700/5"
                            onClick={() => setSelectedService(service)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-green-600/10 dark:bg-green-500/10 rounded-xl flex items-center justify-center">
                                            <img src={getAssetPath(service.icon)} alt={service.title} className="w-8 h-8 object-contain" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-foreground">{service.title}</h3>
                                            <p className="text-sm text-muted-foreground">{service.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Promo Banner */}
                <Card className="bg-gradient-to-r from-green-600/20 to-green-600/10 dark:from-green-500/20 dark:to-green-500/10 border-green-700/30 dark:border-green-500/30">
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-[#063140] rounded-full flex items-center justify-center">
                                <img src={getAssetPath("/New icons/Layer 6.webp")} alt="Electricity" className="w-8 h-8 object-contain brightness-0 invert" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-semibold text-foreground">Pay Electricity Bill</h4>
                                <p className="text-sm text-muted-foreground">Get ₹50 cashback on first payment</p>
                            </div>
                            <ChevronRight className="w-5 h-5 text-green-700 dark:text-green-500" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

// Payment View Component
interface PaymentViewProps {
    service: any;
    onBack: () => void;
    onPayment?: (amount: number, serviceName: string) => boolean;
}

const PaymentView = ({ service, onBack, onPayment }: PaymentViewProps) => {
    const [loading, setLoading] = useState(false);
    const [fetchingBill, setFetchingBill] = useState(false);
    const [billDetails, setBillDetails] = useState<{ name: string; dueDate: string; amount: string } | null>(null);
    const [success, setSuccess] = useState(false);
    const [consumerId, setConsumerId] = useState("");
    const [amount, setAmount] = useState("");

    // Service-specific fields
    const [operator, setOperator] = useState("");
    const [state, setState] = useState("");
    const [board, setBoard] = useState("");
    const [circle, setCircle] = useState("");
    const [vehicleNumber, setVehicleNumber] = useState("");
    const [distributor, setDistributor] = useState("");

    // Service-specific data
    const mobileOperators = ["Airtel", "Jio", "VI (Vodafone Idea)", "BSNL"];
    const dthProviders = ["Tata Play", "Airtel Digital TV", "Dish TV", "D2H", "Sun Direct"];
    const broadbandProviders = ["Airtel Xstream Fiber", "JioFiber", "ACT Fibernet", "BSNL", "Hathway"];
    const electricityBoards = ["MSEDCL", "BSES Rajdhani", "BSES Yamuna", "Adani Electricity", "Tata Power", "BESCOM", "TNEB"];
    const states = ["Maharashtra", "Delhi", "Karnataka", "Tamil Nadu", "Gujarat", "Rajasthan", "UP", "MP"];
    const gasDistributors = ["HP Gas", "Indane", "Bharat Gas"];
    const waterBoards = ["Mumbai Water", "Delhi Jal Board", "Bangalore Water", "Chennai Metro Water"];
    const insuranceCompanies = ["LIC", "HDFC Life", "SBI Life", "ICICI Prudential", "Max Life", "Bajaj Allianz"];
    const banks = ["HDFC Bank", "ICICI Bank", "SBI", "Axis Bank", "Kotak Mahindra", "PNB"];
    const metroServices = ["Delhi Metro", "Mumbai Metro", "Bangalore Metro", "Chennai Metro", "Kolkata Metro"];
    const subscriptionServices = ["Netflix", "Amazon Prime", "Disney+ Hotstar", "Zee5", "SonyLIV", "Spotify"];

    const isBillService = service.title.toLowerCase().includes("electricity") ||
        service.title.toLowerCase().includes("water") ||
        service.title.toLowerCase().includes("gas") ||
        service.title.toLowerCase().includes("broadband") ||
        service.title.toLowerCase().includes("landline") ||
        service.title.toLowerCase().includes("piped") ||
        service.title.toLowerCase().includes("insurance") ||
        service.title.toLowerCase().includes("municipal") ||
        service.title.toLowerCase().includes("house tax");

    const handleFetchBill = () => {
        if (!consumerId || (service.title.includes("Electricity") && !board)) {
            alert("Please enter all details to fetch bill");
            return;
        }

        setFetchingBill(true);
        // Simulate API fetch
        setTimeout(() => {
            setFetchingBill(false);
            const mockAmount = (Math.floor(Math.random() * 2000) + 500).toString();
            setBillDetails({
                name: "MR. SUNIL VERMA",
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
                amount: mockAmount
            });
            setAmount(mockAmount);
        }, 1500);
    };



    const handlePay = () => {
        if (!consumerId) {
            alert("Please enter all details");
            return;
        }

        if (!billDetails && isBillService) {
            handleFetchBill();
            return;
        }

        if (!amount) {
            alert("Please enter/fetch amount");
            return;
        }

        // Determine transaction type and category based on service
        let transactionType: 'mobile_recharge' | 'bill_payment' | 'cc_to_bank' | 'wallet' = 'bill_payment';
        let category = service.title;

        // Map service titles to appropriate types
        if (service.title.toLowerCase().includes('mobile') || service.title.toLowerCase().includes('prepaid') || service.title.toLowerCase().includes('postpaid')) {
            transactionType = 'mobile_recharge';
        } else if (service.title.toLowerCase().includes('dth') ||
            service.title.toLowerCase().includes('electricity') ||
            service.title.toLowerCase().includes('gas') ||
            service.title.toLowerCase().includes('water') ||
            service.title.toLowerCase().includes('broadband') ||
            service.title.toLowerCase().includes('cable') ||
            service.title.toLowerCase().includes('landline') ||
            service.title.toLowerCase().includes('piped') ||
            service.title.toLowerCase().includes('datacard') ||
            service.title.toLowerCase().includes('bill') ||
            service.title.toLowerCase().includes('challan') ||
            service.title.toLowerCase().includes('municipal') ||
            service.title.toLowerCase().includes('house tax') ||
            service.title.toLowerCase().includes('hospital')) {
            transactionType = 'bill_payment';
        }

        if (onPayment) {
            const paymentInitiated = onPayment(parseFloat(amount), service.title);
            if (!paymentInitiated) {
                return;
            }
        }

        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 2000);
    };

    if (success) {
        const transaction: Transaction = {
            id: `TFC${Math.floor(Math.random() * 1000000000)}`,
            amount: `₹${amount}`,
            name: service.title,
            category: service.category || 'Service',
            date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }),
            time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
            status: 'success',
            type: 'bill_payment', // Default, logic below handles specific types
            referenceId: `${Math.floor(Math.random() * 1000000000000)}`,
            method: 'TFC Pay Wallet',
            icon: service.icon,
            isCredit: false
        };

        return (
            <TransactionReceipt
                transaction={transaction}
                onClose={onBack}
            />
        );
    }

    return (
        <div className="flex flex-col h-full bg-background animate-in slide-in-from-right duration-300 relative z-[70]">
            {/* Header */}
            <header className="flex items-center p-4 border-b border-border bg-white dark:bg-card sticky top-0 z-10">
                <button
                    onClick={onBack}
                    className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <div className="ml-4">
                    <h2 className="font-bold text-foreground text-lg">{service.title}</h2>
                    <p className="text-xs text-muted-foreground">Enter details to pay</p>
                </div>
            </header>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Service Icon */}
                <div className="flex flex-col items-center justify-center py-6">
                    <div className="w-20 h-20 bg-green-600/10 dark:bg-green-500/10 rounded-3xl flex items-center justify-center mb-4">
                        <img src={getAssetPath(service.icon)} alt={service.title} className="w-14 h-14 object-contain" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground max-w-[200px]">
                        Secure {service.title} via TFC Pay
                    </p>
                </div>

                {/* Offer Carousel for Payment View */}
                <div className="bg-green-500/5 dark:bg-green-500/10 rounded-2xl p-4 border border-green-700/10 dark:border-green-500/10 overflow-hidden relative">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#063140] flex items-center justify-center flex-shrink-0 animate-pulse">
                            <Gift className="w-5 h-5 text-white dark:text-black" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-bold text-foreground">Available Offers</h4>
                            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                                <span className="bg-white/50 dark:bg-card/50 px-2 py-0.5 rounded text-[10px] text-green-700 dark:text-green-500 font-bold border border-green-700/20 whitespace-nowrap">₹50 OFF</span>
                                <span className="bg-white/50 dark:bg-card/50 px-2 py-0.5 rounded text-[10px] text-green-700 dark:text-green-500 font-bold border border-green-700/20 whitespace-nowrap">5% CASHBACK</span>
                                <span className="bg-white/50 dark:bg-card/50 px-2 py-0.5 rounded text-[10px] text-green-700 dark:text-green-500 font-bold border border-green-700/20 whitespace-nowrap">FREE RECHARGE</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <div className="space-y-4">
                    {/* Mobile Prepaid/Postpaid */}
                    {(service.title.includes("Mobile Prepaid") || service.title.includes("Mobile Postpaid")) && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Operator</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose operator</option>
                                    {mobileOperators.map((op) => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Mobile Number</label>
                                <Input
                                    placeholder="Enter 10-digit mobile number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    maxLength={10}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            {service.title.includes("Prepaid") && (
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-foreground">Select Plan</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {["₹149", "₹299", "₹599"].map((plan) => (
                                            <button
                                                key={plan}
                                                onClick={() => setAmount(plan.replace("₹", ""))}
                                                className={`p-3 rounded-xl border transition-all ${amount === plan.replace("₹", "") ? "border-green-700 bg-green-600/5 dark:border-green-500 dark:bg-green-500/5" : "border-border bg-card"}`}
                                            >
                                                <p className="text-sm font-bold text-foreground">{plan}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* DTH Recharge */}
                    {service.title.includes("DTH") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Provider</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose DTH provider</option>
                                    {dthProviders.map((provider) => (
                                        <option key={provider} value={provider}>{provider}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Subscriber ID</label>
                                <Input
                                    placeholder="Enter Subscriber ID"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Broadband */}
                    {service.title.includes("Broadband") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Provider</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose broadband provider</option>
                                    {broadbandProviders.map((provider) => (
                                        <option key={provider} value={provider}>{provider}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Number</label>
                                <Input
                                    placeholder="Enter account number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Electricity */}
                    {service.title.includes("Electricity") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Board</label>
                                <select
                                    value={board}
                                    onChange={(e) => setBoard(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose electricity board</option>
                                    {electricityBoards.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Consumer Number</label>
                                <Input
                                    placeholder="Enter consumer number"
                                    value={consumerId}
                                    onChange={(e) => {
                                        setConsumerId(e.target.value);
                                        setBillDetails(null);
                                    }}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            {!billDetails && isBillService && (
                                <Button
                                    onClick={handleFetchBill}
                                    disabled={fetchingBill}
                                    variant="outline"
                                    className="w-full h-11 border-green-700/30 text-green-700 dark:border-green-500/30 dark:text-green-500 font-bold"
                                >
                                    {fetchingBill ? (
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Fetching Bill Details...
                                        </div>
                                    ) : (
                                        "Fetch Bill Details"
                                    )}
                                </Button>
                            )}

                            {billDetails && (
                                <div className="bg-green-600/5 dark:bg-green-500/5 border border-green-700/20 dark:border-green-500/20 rounded-2xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2">
                                    <div className="flex items-center justify-between border-b border-green-700/10 dark:border-green-500/10 pb-2">
                                        <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">Consumer Details</span>
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-green-700/10 dark:bg-green-500/10 rounded-full">
                                            <div className="w-1.5 h-1.5 rounded-full bg-green-600 dark:bg-green-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-green-700 dark:text-green-500">Bill Found</span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-muted-foreground mb-0.5">Consumer Name</p>
                                            <p className="text-sm font-bold text-foreground">{billDetails.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground mb-0.5">Due Date</p>
                                            <p className="text-sm font-bold text-red-500 dark:text-red-400">{billDetails.dueDate}</p>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <p className="text-[10px] text-muted-foreground mb-1">Payable Amount</p>
                                        <p className="text-2xl font-black text-foreground">₹{billDetails.amount}</p>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {/* Gas Cylinder */}
                    {service.title.includes("Gas Cylinder") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Distributor</label>
                                <select
                                    value={distributor}
                                    onChange={(e) => setDistributor(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose gas distributor</option>
                                    {gasDistributors.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Consumer Number</label>
                                <Input
                                    placeholder="Enter LPG consumer number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Water Bill */}
                    {service.title.includes("Water") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Board</label>
                                <select
                                    value={board}
                                    onChange={(e) => setBoard(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose water board</option>
                                    {waterBoards.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Consumer Number</label>
                                <Input
                                    placeholder="Enter consumer number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Fastag */}
                    {service.title.includes("Fastag") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Issuer Bank</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank} value={bank}>{bank}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Vehicle Number</label>
                                <Input
                                    placeholder="Enter vehicle number (e.g., MH01XX1234)"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground uppercase"
                                />
                            </div>
                        </>
                    )}

                    {/* Insurance */}
                    {service.title.includes("Insurance") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Insurance Company</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose insurance company</option>
                                    {insuranceCompanies.map((company) => (
                                        <option key={company} value={company}>{company}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Policy Number</label>
                                <Input
                                    placeholder="Enter policy number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Loan Payment / Education Loan */}
                    {(service.title.includes("Loan") || service.title.includes("EMI")) && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bank / Institution</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose bank</option>
                                    {banks.map((bank) => (
                                        <option key={bank} value={bank}>{bank}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Loan Account Number</label>
                                <Input
                                    placeholder="Enter loan account number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Metro Card */}
                    {service.title.includes("Metro") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Metro</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose metro service</option>
                                    {metroServices.map((metro) => (
                                        <option key={metro} value={metro}>{metro}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Card Number</label>
                                <Input
                                    placeholder="Enter metro card number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Subscription */}
                    {service.title.includes("Subscription") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Service</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose subscription service</option>
                                    {subscriptionServices.map((sub) => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Email/Phone</label>
                                <Input
                                    placeholder="Enter registered email or phone"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Traffic Challan */}
                    {service.title.includes("Challan") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select State</label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose state</option>
                                    {states.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Vehicle Number</label>
                                <Input
                                    placeholder="Enter vehicle number (e.g., MH01XX1234)"
                                    value={vehicleNumber}
                                    onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground uppercase"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Challan Number (Optional)</label>
                                <Input
                                    placeholder="Enter challan number if available"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Datacard Prepaid */}
                    {service.title.includes("Datacard") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Operator</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose operator</option>
                                    {mobileOperators.map((op) => (
                                        <option key={op} value={op}>{op}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Datacard Number</label>
                                <Input
                                    placeholder="Enter datacard number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Prepaid Meter */}
                    {service.title.includes("Prepaid Meter") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Board</label>
                                <select
                                    value={board}
                                    onChange={(e) => setBoard(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose electricity board</option>
                                    {electricityBoards.map((b) => (
                                        <option key={b} value={b}>{b}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Meter Number</label>
                                <Input
                                    placeholder="Enter prepaid meter number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* LPG Booking */}
                    {service.title.includes("LPG Booking") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Distributor</label>
                                <select
                                    value={distributor}
                                    onChange={(e) => setDistributor(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose gas distributor</option>
                                    {gasDistributors.map((d) => (
                                        <option key={d} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Consumer Number</label>
                                <Input
                                    placeholder="Enter LPG consumer number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Number of Cylinders</label>
                                <select
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Select quantity</option>
                                    <option value="1050">1 Cylinder - ₹1050</option>
                                    <option value="2100">2 Cylinders - ₹2100</option>
                                    <option value="3150">3 Cylinders - ₹3150</option>
                                </select>
                            </div>
                        </>
                    )}

                    {/* Donation */}
                    {service.title.includes("Donation") && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select Organization</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose charitable organization</option>
                                    <option value="PM CARES Fund">PM CARES Fund</option>
                                    <option value="Red Cross">Red Cross India</option>
                                    <option value="CRY">CRY - Child Rights</option>
                                    <option value="Akshaya Patra">Akshaya Patra</option>
                                    <option value="Goonj">Goonj</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Donor Name</label>
                                <Input
                                    placeholder="Enter your name"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Postpaid (general) */}
                    {service.title === "Postpaid" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Bill Type</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Select bill type</option>
                                    <option value="Landline">Landline Postpaid</option>
                                    <option value="Broadband">Broadband Postpaid</option>
                                    <option value="Cable">Cable TV</option>
                                    <option value="Other">Other Services</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Account Number</label>
                                <Input
                                    placeholder="Enter account number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Municipality / Civic Services */}
                    {service.title === "Municipality" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select State</label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose state</option>
                                    {states.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Service Type</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Select service</option>
                                    <option value="Birth Certificate">Birth Certificate</option>
                                    <option value="Death Certificate">Death Certificate</option>
                                    <option value="Marriage Certificate">Marriage Certificate</option>
                                    <option value="Trade License">Trade License</option>
                                    <option value="Other">Other Services</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Application Number</label>
                                <Input
                                    placeholder="Enter application number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* House Tax */}
                    {service.title === "House Tax" && (
                        <>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Select State</label>
                                <select
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Choose state</option>
                                    {states.map((s) => (
                                        <option key={s} value={s}>{s}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">Municipal Corporation</label>
                                <select
                                    value={operator}
                                    onChange={(e) => setOperator(e.target.value)}
                                    className="w-full h-12 px-3 rounded-xl bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-green-700 dark:focus:ring-green-500"
                                >
                                    <option value="">Select corporation</option>
                                    <option value="MCGM">Mumbai Municipal Corporation</option>
                                    <option value="NDMC">New Delhi Municipal Council</option>
                                    <option value="BBMP">Bangalore Municipal Corporation</option>
                                    <option value="GHMC">Hyderabad Municipal Corporation</option>
                                    <option value="KMC">Kolkata Municipal Corporation</option>
                                    <option value="PMC">Pune Municipal Corporation</option>
                                    <option value="SDMC">South Delhi Municipal Corporation</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">House/Property Number</label>
                                <Input
                                    placeholder="Enter property number"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </>
                    )}

                    {/* Credit Card Bill Payment */}
                    {service.title === "CC Bill Payment" && (
                        <div className="space-y-3 mb-4">
                            <label className="text-sm font-medium text-foreground">Select Saved Card</label>
                            <div className="space-y-2">
                                <button
                                    onClick={() => {
                                        setConsumerId("XXXX 1234");
                                    }}
                                    className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${consumerId.includes("1234") ? "border-green-700 bg-green-600/5 ring-1 ring-green-700 dark:border-green-500 dark:bg-green-500/5 dark:ring-green-500" : "border-border bg-card"}`}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                            <img src={getAssetPath("/New icons/Layer 10.webp")} alt="Card" className="w-5 h-5 object-contain" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-sm font-bold text-foreground">HDFC Bank</p>
                                            <p className="text-xs text-muted-foreground">XXXX 1234</p>
                                        </div>
                                    </div>
                                    {consumerId.includes("1234") && <CheckCircle2 className="w-5 h-5 text-green-700 dark:text-green-500" />}
                                </button>

                                <button
                                    onClick={() => setConsumerId("")}
                                    className={`w-full p-3 rounded-xl border border-dashed flex items-center gap-3 transition-colors ${!consumerId.includes("1234") && consumerId !== "" ? "border-green-700 bg-green-600/5 dark:border-green-500 dark:bg-green-500/5" : "border-border hover:bg-muted/50"}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                                        <Plus className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <span className="text-sm font-medium text-muted-foreground">Pay for other card</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Generic fields for other services */}
                    {!service.title.includes("Mobile") &&
                        !service.title.includes("DTH") &&
                        !service.title.includes("Broadband") &&
                        !service.title.includes("Electricity") &&
                        !service.title.includes("Gas Cylinder") &&
                        !service.title.includes("Water") &&
                        !service.title.includes("Fastag") &&
                        !service.title.includes("Insurance") &&
                        !service.title.includes("Loan") &&
                        !service.title.includes("EMI") &&
                        !service.title.includes("Metro") &&
                        !service.title.includes("Subscription") &&
                        !service.title.includes("Challan") &&
                        !service.title.includes("Datacard") &&
                        !service.title.includes("Prepaid Meter") &&
                        !service.title.includes("LPG Booking") &&
                        !service.title.includes("Donation") &&
                        service.title !== "CC Bill Payment" &&
                        service.title !== "Postpaid" &&
                        service.title !== "Municipality" &&
                        service.title !== "House Tax" && (
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-foreground">
                                    {service.title.includes("Rent") ? "Account Number" :
                                        service.title.includes("Fee") ? "Student ID" :
                                            service.title.includes("Municipal") ? "Property ID" :
                                                service.title.includes("Hospital") ? "Patient ID" :
                                                    service.title.includes("Housing") || service.title.includes("Apartment") ? "Flat Number" :
                                                        "Account / ID Number"}
                                </label>
                                <Input
                                    placeholder="Enter details"
                                    value={consumerId}
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        )}

                    {service.title !== "CC Bill Payment" && !consumerId.includes("1234") && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">
                                {service.title.includes("Prepaid") ? "Recharge Amount" : "Amount"}
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-semibold">₹</span>
                                <Input
                                    type="number"
                                    placeholder="0.00"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    className="pl-8 bg-card border-border h-12 font-semibold text-lg text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Action */}
            <footer className="p-4 border-t border-border bg-card">
                <Button
                    onClick={handlePay}
                    disabled={loading}
                    className="w-full h-12 bg-[#063140] text-white font-bold text-lg hover:bg-[#063140]/90 shadow-lg"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        (!billDetails && isBillService) ? "Fetch Bill" : `Proceed to Pay ₹${amount || "0"}`
                    )}
                </Button>
            </footer>
        </div>
    );
};

export default MobileServices;

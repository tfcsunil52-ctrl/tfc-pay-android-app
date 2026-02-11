import { useState, useEffect } from "react";
import {
    Smartphone, Tv, Zap, Car, Flame, Droplets, Wifi, Phone,
    CreditCard, Home, Shield, Search, ChevronRight, MonitorPlay, Fuel, ArrowLeft, Loader2, CheckCircle2,
    Landmark, GraduationCap, Plus, Train, PlayCircle, Heart, FileText, Building2, Users, Wallet,
    Gauge, Gift, Receipt
} from "lucide-react";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import type { TabType } from "../../types";

// Custom Gas Cylinder icon
const GasCylinder = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M7 6V4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />
        <path d="M19 6H5a2 2 0 0 0-2 2v10a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4V8a2 2 0 0 0-2-2z" />
        <path d="M12 2v4" />
        <path d="M3 13h18" />
    </svg>
);

// Custom Metro icon
const Metro = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M5 15h14" />
        <path d="M5 9h14" />
        <path d="M9 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
        <circle cx="9" cy="19" r="1" />
        <circle cx="15" cy="19" r="1" />
    </svg>
);

// Quick access services
const quickServices = [
    { icon: Smartphone, title: "Mobile Prepaid" },
    { icon: Phone, title: "Mobile Postpaid" },
    { icon: Tv, title: "DTH Recharge" },
    { icon: MonitorPlay, title: "Cable TV" },
    { icon: Zap, title: "Electricity Bill" },
    { icon: GasCylinder, title: "Gas Cylinder" },
    { icon: Flame, title: "Piped Gas" },
    { icon: Phone, title: "Landline" },
    { icon: Car, title: "Fastag" },
    { icon: Wifi, title: "Broadband" },
    { icon: Wifi, title: "Broadband Postpaid" },
    { icon: Wifi, title: "Datacard Prepaid" },
    { icon: Droplets, title: "Water Bill" },
    { icon: Droplets, title: "Water Supplier" },
    { icon: CreditCard, title: "CC Bill Payment" },
    { icon: Home, title: "Rent Payment" },
    { icon: Shield, title: "Insurance" },
    { icon: Landmark, title: "Loan Payment" },
    { icon: GraduationCap, title: "Fee Payment" },
    { icon: Metro, title: "Metro Card" },
    { icon: PlayCircle, title: "Subscription" },
    { icon: FileText, title: "Traffic Challan" },
    { icon: Heart, title: "Hospital Bills" },
    { icon: GasCylinder, title: "LPG Booking" },
    { icon: Building2, title: "Municipality" },
    { icon: Gauge, title: "Prepaid Meter" },
    { icon: Gift, title: "Donation" },
    { icon: Receipt, title: "Postpaid" },
    { icon: Home, title: "House Tax" },
];

const categories = [
    { id: "recharge", label: "Recharge" },
    { id: "bills", label: "Bill Payment" },
    { id: "premium", label: "Premium" },
];

const services = {
    recharge: [
        { icon: Smartphone, title: "Mobile Prepaid", description: "All operators" },
        { icon: Phone, title: "Mobile Postpaid", description: "Bill payments" },
        { icon: Tv, title: "DTH Recharge", description: "Tata, Airtel, Dish" },
        { icon: MonitorPlay, title: "Cable TV", description: "All cable providers" },
        { icon: Wifi, title: "Broadband", description: "Internet bills" },
        { icon: Wifi, title: "Broadband Postpaid", description: "Postpaid broadband" },
        { icon: Wifi, title: "Datacard Prepaid", description: "Data card recharge" },
        { icon: Car, title: "Fastag", description: "Toll payments" },
        { icon: Metro, title: "Metro Card", description: "Recharge metro card" },
        { icon: Wallet, title: "Digital Voucher", description: "Gift cards & vouchers" },
        { icon: Gauge, title: "Prepaid Meter", description: "Electricity prepaid" },
    ],
    bills: [
        { icon: Zap, title: "Electricity", description: "Pay electricity bills" },
        { icon: Droplets, title: "Water Bill", description: "All providers" },
        { icon: Droplets, title: "Water Supplier", description: "Water supplier bills" },
        { icon: GasCylinder, title: "Gas Cylinder", description: "Book LPG cylinder" },
        { icon: GasCylinder, title: "LPG Booking", description: "Book new LPG" },
        { icon: Flame, title: "Piped Gas", description: "Monthly piped gas" },
        { icon: Phone, title: "Landline", description: "BSNL, MTNL, Airtel" },
        { icon: Receipt, title: "Postpaid", description: "Postpaid bills" },
        { icon: Building2, title: "Municipal Tax", description: "Property tax" },
        { icon: Home, title: "House Tax", description: "House tax payment" },
        { icon: Building2, title: "Municipality", description: "Civic services" },
        { icon: Users, title: "Housing Society", description: "Maintenance bills" },
        { icon: FileText, title: "Traffic Challan", description: "Pay traffic fines" },
        { icon: Heart, title: "Hospital Bills", description: "Medical bills" },
    ],
    premium: [
        { icon: Home, title: "Rent Payment", description: "Pay rent via card" },
        { icon: CreditCard, title: "CC Bill Payment", description: "Credit card bill" },
        { icon: Wallet, title: "Credit Card EMI", description: "EMI payments" },
        { icon: Shield, title: "Insurance", description: "Health, Vehicle" },
        { icon: Landmark, title: "Loan Payment", description: "EMI & Loans" },
        { icon: GraduationCap, title: "Fee Payment", description: "Education fees" },
        { icon: GraduationCap, title: "Education Loan", description: "Student loan EMI" },
        { icon: PlayCircle, title: "Subscription", description: "OTT & streaming" },
        { icon: Building2, title: "Apartment Bills", description: "Society dues" },
        { icon: Gift, title: "Donation", description: "Charitable donations" },
    ],
};

interface MobileServicesProps {
    isDarkMode?: boolean;
    onPayment?: (amount: number, serviceName: string) => boolean;
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
    const [activeCategory, setActiveCategory] = useState("recharge");
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
                        onNavigate?.("home");
                    } else {
                        setSelectedService(null);
                    }
                }}
                onPayment={onPayment}
            />
        );
    }

    const currentServices = services[activeCategory as keyof typeof services];
    const filteredServices = currentServices.filter((service) =>
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
                {/* Header */}
                <header>
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
                            <div className="w-10 h-10 bg-green-600/10 dark:bg-green-500/10 rounded-xl flex items-center justify-center">
                                <service.icon className="w-5 h-5 text-green-700 dark:text-green-500" />
                            </div>
                            <span className="text-[10px] text-center text-muted-foreground leading-tight line-clamp-2">
                                {service.title}
                            </span>
                        </button>
                    ))}
                </section>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 bg-card border-border text-foreground placeholder:text-muted-foreground"
                    />
                </div>

                {/* Category Tabs */}
                <div className="flex gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-300 ${activeCategory === cat.id
                                ? "bg-green-700 text-white dark:bg-green-500 dark:text-black shadow-lg shadow-green-700/20 dark:shadow-green-500/20 scale-105"
                                : "bg-white dark:bg-card text-muted-foreground border border-border hover:bg-card/80"
                                }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Services List */}
                <div className="space-y-3">
                    {filteredServices.map((service, index) => (
                        <Card
                            key={index}
                            className="bg-white dark:bg-card border-green-700/10 dark:border-border hover:border-green-700/50 dark:hover:border-green-500/50 transition-all cursor-pointer group hover:scale-[1.01] hover:shadow-lg hover:shadow-green-700/5"
                            onClick={() => setSelectedService(service)}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-green-600/10 dark:bg-green-500/10 rounded-xl flex items-center justify-center">
                                            <service.icon className="w-5 h-5 text-green-700 dark:text-green-500" />
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
                            <div className="w-10 h-10 bg-green-700 dark:bg-green-500 rounded-full flex items-center justify-center">
                                <Zap className="w-5 h-5 text-white dark:text-black" />
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


    const handlePay = () => {
        if (!consumerId || !amount) {
            alert("Please enter all details");
            return;
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
        return (
            <div className="flex flex-col h-full bg-background animate-in fade-in zoom-in-95 duration-300">
                <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6 text-center">
                    <div className="w-20 h-20 bg-green-600/10 dark:bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                        <CheckCircle2 className="w-10 h-10 text-green-700 dark:text-green-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-foreground">Payment Successful!</h2>
                    <p className="text-muted-foreground">
                        Your payment of <span className="text-foreground font-semibold">₹{amount}</span> for {service.title} has been processed.
                    </p>
                    <div className="bg-muted/50 p-4 rounded-xl w-full max-w-xs border border-border/50">
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-muted-foreground">Transaction ID</span>
                            <span className="font-mono text-foreground">TFC{Math.floor(Math.random() * 1000000)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Date</span>
                            <span className="text-foreground">{new Date().toLocaleDateString()}</span>
                        </div>
                    </div>
                    <Button onClick={onBack} className="w-full max-w-xs bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold mt-8">
                        Done
                    </Button>
                </div>
            </div>
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
                    <div className="w-16 h-16 bg-green-600/10 dark:bg-green-500/10 rounded-2xl flex items-center justify-center mb-3">
                        <service.icon className="w-8 h-8 text-green-700 dark:text-green-500" />
                    </div>
                    <p className="text-sm text-center text-muted-foreground max-w-[200px]">
                        Secure {service.title} via TFC Pay
                    </p>
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
                                    onChange={(e) => setConsumerId(e.target.value)}
                                    className="bg-card border-border h-12 text-foreground placeholder:text-muted-foreground"
                                />
                            </div>
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
                                            <CreditCard className="w-4 h-4 text-blue-600" />
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
                    className="w-full h-12 bg-green-700 text-white dark:text-black dark:bg-green-500 font-bold text-lg hover:bg-green-800 dark:hover:bg-green-400 shadow-lg shadow-green-700/20 dark:shadow-green-500/20"
                >
                    {loading ? (
                        <div className="flex items-center gap-2">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Processing...
                        </div>
                    ) : (
                        `Proceed to Pay ₹${amount || "0"}`
                    )}
                </Button>
            </footer>
        </div>
    );
};

export default MobileServices;

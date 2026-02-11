import { Gift, Percent, Clock, ChevronRight, Star, Sparkles } from "lucide-react";
import { Card, CardContent } from "../ui/Card";
import { Badge } from "../ui/Badge";

const featuredOffers = [
    {
        title: "Flat ₹100 Cashback",
        description: "On your first mobile recharge above ₹199",
        code: "FIRST100",
        validTill: "31 Jan 2026",
        color: "from-green-600/30 to-green-600/10 dark:from-green-500/30 dark:to-green-500/10",
    },
    {
        title: "20% Off on DTH",
        description: "Maximum cashback up to ₹75",
        code: "DTH20",
        validTill: "15 Feb 2026",
        color: "from-purple-500/30 to-purple-500/10",
    },
];

const allOffers = [
    {
        category: "Mobile",
        title: "₹50 Cashback",
        description: "On recharge of ₹299 or more",
        icon: Percent,
    },
    {
        category: "Electricity",
        title: "₹25 Cashback",
        description: "First electricity bill payment",
        icon: Gift,
    },
    {
        category: "Premium",
        title: "Zero Fee",
        description: "On rent payments this month",
        icon: Sparkles,
    },
    {
        category: "Referral",
        title: "Earn ₹100",
        description: "For each successful referral",
        icon: Star,
    },
];

const MobileOffers = () => {
    return (
        <div className="flex flex-col h-full overflow-hidden relative">
            {/* Background Blurs for Light Mode */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 dark:hidden">
                <div className="absolute top-[20%] left-[10%] w-[60%] h-[40%] rounded-full bg-orange-100/40 blur-[80px]" />
                <div className="absolute bottom-[10%] right-[10%] w-[60%] h-[40%] rounded-full bg-green-100/40 blur-[80px]" />
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-5 relative z-10">
                {/* Header */}
                <header>
                    <h1 className="text-xl font-bold text-foreground mb-1">Offers & Rewards</h1>
                    <p className="text-sm text-muted-foreground">Exclusive deals just for you</p>
                </header>

                {/* Featured Offers */}
                <section className="space-y-3">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-green-700 dark:text-green-500" />
                        Featured Offers
                    </h3>
                    {featuredOffers.map((offer, index) => (
                        <Card key={index} className={`bg-gradient-to-r ${offer.color} border-green-700/30 dark:border-green-500/30 overflow-hidden`}>
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                    <Badge className="bg-green-600/20 dark:bg-green-500/20 text-green-700 dark:text-green-500 border-0">{offer.code}</Badge>
                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                        <Clock className="w-3 h-3" />
                                        {offer.validTill}
                                    </div>
                                </div>
                                <h4 className="font-bold text-foreground text-lg mb-1">{offer.title}</h4>
                                <p className="text-sm text-muted-foreground">{offer.description}</p>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* All Offers */}
                <section className="space-y-3">
                    <h3 className="font-semibold text-foreground">All Offers</h3>
                    {allOffers.map((offer, index) => (
                        <Card key={index} className="bg-card border-border">
                            <CardContent className="p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-600/10 dark:bg-green-500/10 rounded-full flex items-center justify-center">
                                            <offer.icon className="w-5 h-5 text-green-700 dark:text-green-500" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-foreground">{offer.title}</h4>
                                                <Badge variant="outline" className="text-[10px] border-green-700/20 text-green-800 dark:border-border dark:text-muted-foreground bg-green-600/5 dark:bg-transparent">
                                                    {offer.category}
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{offer.description}</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </section>

                {/* Cashback Summary */}
                <Card className="bg-card border-border">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="font-semibold text-foreground">Your Cashback</h4>
                            <button className="text-green-700 dark:text-green-500 text-sm font-medium">History</button>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-green-600/10 dark:bg-secondary rounded-2xl p-4 text-center border border-green-700/10 dark:border-transparent">
                                <p className="text-3xl font-black text-green-700 dark:text-green-500">₹325</p>
                                <p className="text-[10px] font-bold text-green-800/60 dark:text-muted-foreground uppercase tracking-wider">Total Earned</p>
                            </div>
                            <div className="bg-secondary/80 dark:bg-secondary rounded-2xl p-4 text-center border border-border/50 dark:border-transparent">
                                <p className="text-3xl font-black text-foreground">₹75</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Pending</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default MobileOffers;

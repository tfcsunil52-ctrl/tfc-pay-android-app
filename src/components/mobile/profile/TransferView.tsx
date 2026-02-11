import { ArrowLeft } from "lucide-react";
import { Button } from "../../ui/Button";
import { Input } from "../../ui/Input";

interface TransferViewProps {
    title: string;
    fields: any[];
    onBack: () => void;
    buttonText: string;
    note?: string;
    isClosing: boolean;
    onButtonClick?: () => void;
}

export const TransferView = ({ title, fields, onBack, buttonText, note, isClosing, onButtonClick }: TransferViewProps) => {
    return (
        <div className={`flex flex-col h-full bg-background absolute inset-0 z-[60] overflow-hidden ${isClosing ? 'animate-out slide-out-to-right duration-300' : 'animate-in slide-in-from-right duration-300'}`}>
            <div className="flex items-center p-4 border-b border-border bg-card/50 backdrop-blur-md z-10">
                <button onClick={onBack} className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-card/80 transition-colors">
                    <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
                <h2 className="ml-4 font-bold text-foreground">{title}</h2>
            </div>
            <div className="p-6 space-y-6 overflow-y-auto flex-1">
                <div className="p-4 bg-green-600/10 dark:bg-green-500/10 rounded-2xl border border-green-700/20 dark:border-green-500/20">
                    <p className="text-sm text-green-700 dark:text-green-500 font-medium">Secure Transfer</p>
                    <p className="text-xs text-muted-foreground mt-1">Your transaction is protected by bank-grade security.</p>
                </div>

                <div className="space-y-4">
                    {fields.map((field, i) => (
                        <div key={i} className="space-y-2">
                            <label className="text-xs font-semibold text-muted-foreground uppercase ml-1">{field.label}</label>
                            {field.type === "select" ? (
                                <select className="w-full bg-card border border-border h-12 rounded-md px-3 text-foreground focus:outline-none focus:ring-1 focus:ring-green-700 dark:focus:ring-green-500">
                                    {field.options?.map((opt: any, idx: number) => (
                                        <option key={idx} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            ) : field.type === "button" ? (
                                <Button
                                    variant="outline"
                                    className="w-full h-12 border-dashed border-2 justify-start gap-2"
                                    onClick={field.onClick}
                                >
                                    {field.icon && <field.icon className="w-4 h-4" />}
                                    {field.placeholder}
                                </Button>
                            ) : (
                                <Input
                                    placeholder={field.placeholder}
                                    type={field.type || "text"}
                                    maxLength={field.maxLength}
                                    className="bg-card border-border h-12 text-lg"
                                />
                            )}
                        </div>
                    ))}
                </div>

                {note && <p className="text-xs text-muted-foreground italic px-1">{note}</p>}

                <Button className="w-full bg-green-700 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-400 text-white dark:text-black font-bold h-12 rounded-xl" onClick={() => {
                    if (onButtonClick) {
                        onButtonClick();
                    } else {
                        alert("Transfer Successful! (Simulation)");
                        onBack();
                    }
                }}>{buttonText}</Button>
            </div>
        </div>
    );
};

import { ChevronRight } from "lucide-react";

interface ProfileInputFieldProps {
    icon: any;
    label: string;
    value: string;
    onChange?: (val: string) => void;
    type?: string;
    readOnly?: boolean;
    onClick?: () => void;
}

export const ProfileInputField = ({
    icon: Icon,
    label,
    value,
    onChange,
    type = "text",
    readOnly = false,
    onClick
}: ProfileInputFieldProps) => (
    <div className="border-b border-border last:border-0">
        <div className={`flex items-center gap-4 p-4 ${onClick ? 'cursor-pointer hover:bg-muted/30' : ''}`} onClick={onClick}>
            <div className="w-8 h-8 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-green-700 dark:text-green-500" />
            </div>
            <div className="flex-1 space-y-0.5">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">{label}</p>
                {readOnly ? (
                    <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{value}</p>
                        {onClick && <ChevronRight className="w-4 h-4 text-muted-foreground" />}
                    </div>
                ) : (
                    <input
                        type={type}
                        value={value}
                        onChange={(e) => onChange?.(e.target.value)}
                        className="w-full bg-transparent border-none p-0 text-sm font-medium text-foreground focus:ring-0 placeholder:text-muted-foreground"
                    />
                )}
            </div>
        </div>
    </div>
);

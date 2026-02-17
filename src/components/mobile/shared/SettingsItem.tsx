import { ChevronRight } from "lucide-react";

interface SettingsItemProps {
    icon: any;
    title: string;
    description: string;
    onClick?: () => void;
}

export const SettingsItem = ({
    icon: Icon,
    title,
    description,
    onClick
}: SettingsItemProps) => (
    <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors group"
    >
        <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-green-600/10 dark:bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4.5 h-4.5 text-green-700 dark:text-green-500" strokeWidth={1.5} />
            </div>
            <div className="text-left">
                <h4 className="text-sm font-medium text-foreground">{title}</h4>
                {description && (
                    <p className="text-[11px] text-muted-foreground mt-0.5">{description}</p>
                )}
            </div>
        </div>
        <ChevronRight className="w-4.5 h-4.5 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
    </button>
);

export const Divider = () => (
    <div className="h-px bg-border mx-4" />
);

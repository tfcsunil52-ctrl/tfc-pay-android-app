import * as React from "react";
import { cn } from "../../lib/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" | "accent";
    size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-bold transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97] relative overflow-hidden";

        const variants = {
            default: "bg-[#5cbc82] border-[1.5px] border-black/25 text-white hover:bg-[#4da872] dark:border-white/80 dark:hover:bg-[#4da872] btn-shine",
            destructive: "bg-red-50 border-[1.5px] border-black/25 text-red-600 hover:bg-red-100 dark:bg-red-900/30 dark:border-white/80 dark:text-red-400",
            outline: "border-[1.5px] border-black/25 bg-transparent hover:bg-slate-50 text-foreground dark:border-white/70 dark:hover:bg-slate-800/50",
            secondary: "bg-slate-100 border-[1.5px] border-black/25 text-foreground hover:bg-slate-200/80 dark:bg-slate-800 dark:border-white/70 dark:hover:bg-slate-700",
            ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 text-foreground",
            link: "text-primary underline-offset-4 hover:underline",
            accent: "bg-violet-50 border-[1.5px] border-black/25 text-violet-700 hover:bg-violet-100 dark:bg-violet-900/30 dark:border-white/70 dark:text-violet-300",
        };

        const sizes = {
            default: "h-9 px-4 py-2",
            sm: "h-8 rounded-md px-3 text-xs",
            lg: "h-10 rounded-md px-8",
            icon: "h-9 w-9",
        };

        return (
            <button
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };

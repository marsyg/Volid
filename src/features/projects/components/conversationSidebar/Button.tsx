import { Button } from "@/components/ui/button";
import { useState } from "react";
import { type LucideIcon } from "lucide-react";
import React from "react";
type ButtonProps = {
    onClick?: () => void;
    name: string;
    variant?: "ghost" | "default";
    className?: string;
    Icon?: LucideIcon;
    
};

const CustomButton = React.forwardRef<HTMLButtonElement, ButtonProps>(({ name, variant, className, Icon, ...props }, ref) => {
    const [rotate, setRotate] = useState(false);
    return (
        <Button ref={ref} className={`h-7 p-2  m-0.5 ${className}`} variant={variant ?? "ghost"} {...props}>
            {name}
            {Icon && <Icon onClick={() => setRotate(prev => !prev)} className={`size-4 ${rotate ? "rotate-180" : ""}`} />}
        </Button>
    );
});
CustomButton.displayName = "CustomButton";
export default CustomButton;

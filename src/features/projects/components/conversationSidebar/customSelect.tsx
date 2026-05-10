import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import CustomButton from './Button';

import { LucideIcon } from 'lucide-react';
type Option = {
  value: string;
  label: string;
};
type CustomSelectProps = {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  className?: string;
  icons?: LucideIcon;
};
export function CustomSelect({
  value,
  onChange,
  options,  
  className,
  icons,
}: CustomSelectProps) {
    
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <CustomButton name={value} Icon={icons}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-40">
        {options.map((option) => (
          <DropdownMenuItem onSelect={() => onChange(option.value)} key={option.value}>
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

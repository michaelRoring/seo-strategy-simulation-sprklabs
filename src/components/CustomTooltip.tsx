import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../components/ui/tooltip";
import { Info } from "lucide-react";

interface CustomTooltipProps {
  children: React.ReactNode;
  description: string;
}

export default function CustomTooltip({
  children,
  description,
}: CustomTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div className="flex gap-1 cursor-pointer hover:text-black text-left">
            {children}
            <Info className="md:w-3 md:h-3 h-4 w-4" />
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="bg-slate-900 text-white rounded-lg px-4 py-2">
            <p>{description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

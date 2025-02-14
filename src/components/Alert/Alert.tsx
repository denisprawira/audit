import { AlertCircle } from "lucide-react";

import {
  Alert as ShadcnAlert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface AlertProps {
  title: string;
  message: string;
  variant?: "default" | "destructive";
}

export function Alert({ title, message, variant }: AlertProps) {
  return (
    <ShadcnAlert variant={variant}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </ShadcnAlert>
  );
}

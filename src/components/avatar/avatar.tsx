import {
  AvatarFallback,
  AvatarImage,
  Avatar as ShadcnAvatar,
} from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface AvatarProps {
  src: string;
  fallback?: string;
  className?: string;
}

const Avatar = ({ src, fallback, className }: AvatarProps) => {
  return (
    <>
      <ShadcnAvatar className={cn("size-8", className)}>
        <AvatarImage src={src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </ShadcnAvatar>
    </>
  );
};

export default Avatar;

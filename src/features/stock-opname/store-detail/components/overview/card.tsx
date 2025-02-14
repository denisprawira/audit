import { Card, CardContent } from "@/components/ui/card";

interface CustomCardProps {
  title: string;
  children: React.ReactNode;
  leftComponent?: React.ReactNode;
}

const CustomCard = ({ title, children, leftComponent }: CustomCardProps) => {
  return (
    <Card className="flex-1 w-full p-4 text-sm">
      <CardContent className="flex flex-col p-0 gap-2">
        <div className="flex justify-between items-center">
          <p className="text-muted-foreground">{title}</p>
          {leftComponent && leftComponent}
        </div>
        {children}
      </CardContent>
    </Card>
  );
};

export default CustomCard;

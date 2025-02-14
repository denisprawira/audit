interface EmptyPlaceholderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  className?: string;
}

const EmptyPlaceholder = ({
  icon,
  title,
  description,
  className,
}: EmptyPlaceholderProps) => {
  return (
    <div
      className={`w-full h-full flex justify-center items-center flex-col gap-2 p-4 ${className}`}
    >
      <div>{icon}</div>
      <p className="text-center font-bold text-lg">{title}</p>
      <p className="text-center text-gray-500">{description}</p>
    </div>
  );
};

export default EmptyPlaceholder;

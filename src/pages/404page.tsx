import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-950">
      <div className="container mx-auto flex max-w-3xl flex-col-reverse items-center gap-8 md:flex-row md:gap-12">
        <div className="flex flex-1 flex-col items-center justify-center space-y-4 text-center md:items-start md:text-left">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
            Oops! Page not found.
          </h1>
          <p className="max-w-[450px] text-gray-500 dark:text-gray-400">
            The page you're looking for doesn't exist or has been moved. Let's
            get you back on track.
          </p>
          <Link to={"/"} className="no-underline">
            {" "}
            <Button>Go to Main Page</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

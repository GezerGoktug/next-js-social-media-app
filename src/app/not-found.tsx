import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="flex-center h-screen text-center">
      <div>
        <div className="font-bold text-7xl">404</div>
        <div className="text-2xl mt-2">Not founded page</div>
        <p>The page you were looking for was not found</p>
        <Link href="/">
          <Button variant="link" className="mt-2 gap-2 text-xl">
            <ArrowLeft />
            Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

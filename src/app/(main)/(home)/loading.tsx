import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => (
  <>
    <Skeleton className="w-full h-36" />
    <Skeleton className="w-full h-72 mt-4" />
    <Skeleton className="w-full h-72 mt-4" />
    <Skeleton className="w-full h-72 mt-4" />
    <Skeleton className="w-full h-72 mt-4" />
    <Skeleton className="w-full h-72 mt-4" />
  </>
);

export default Loading;

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="w-full h-80" />
      <Skeleton className="w-full h-24 mt-4" />
      <Skeleton className="w-full h-72 mt-4" />
      <Skeleton className="w-full h-72 mt-4" />
      <Skeleton className="w-full h-72 mt-4" />
    </>
  );
};

export default Loading;

import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="w-full h-28 mb-4" />
      <Skeleton className="w-full h-72 mb-4" />
      <Skeleton className="w-full h-72" />
    </>
  );
};

export default Loading;

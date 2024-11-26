import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <Skeleton className="h-16 rounded-xl w-full " />
      <div className="flex gap-3 my-5 ">
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full" />
        <Skeleton className="w-24 h-8 rounded-full hidden xs:inline" />
        <Skeleton className="w-24 h-8 rounded-full hidden min-[500px]:inline   " />
      </div>
      <Skeleton className="w-full p-4 xs:p-6 h-[450px]">
        <Skeleton className="h-8 w-1/2 xs:w-1/3 mb-4" />
        <Skeleton className="w-full h-16 mb-5" />
        <Skeleton className="w-full h-16 mb-5" />
        <Skeleton className="w-full h-16 mb-5" />
        <Skeleton className="w-full h-16 mb-5" />
      </Skeleton>
    </>
  );
};

export default Loading;

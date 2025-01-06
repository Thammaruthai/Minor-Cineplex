import {
  Skeleton,
  SkeletonText,
} from "@/components/ui/skeleton";

export default function CustomSkeleton() {
  return (
    <div className="flex flex-col px-4 pt-4 pb-6 rounded-lg gap-4 w-full md:w-[350px] h-[650px] bg-[#070C1B]">
      <SkeletonText noOfLines={1} gap="3" width="50%" />
      <div className="flex w-full h-30 gap-3">
        <Skeleton height="120px" width="25%" />
        <div className="flex w-full flex-col gap-4 justify-center">
          <SkeletonText noOfLines={1} gap="3" width="70%" />
          <div className="flex gap-2">
          <Skeleton height="32px" width="25%" />
          <Skeleton height="32px" width="20%" />
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 mt-5">
      <SkeletonText noOfLines={1} gap="3" width="60%" />
      <SkeletonText noOfLines={1} gap="3" width="40%" />
      <SkeletonText noOfLines={2} gap="3" width="20%" />
      </div>
      
      <div className="max-w-md mt-5">
        <div className="mb-8 flex items-end">
        <SkeletonText noOfLines={3} gap="5" width="100%" />
        </div>
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton height="50px" />
          </div>
          <div className="space-y-2">
            <Skeleton height="50px" />
          </div>
        </div>
      </div>
    </div>
  );
}

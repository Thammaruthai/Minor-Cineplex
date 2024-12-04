import { Skeleton } from "@chakra-ui/react";

export default function CustomSkeleton() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="space-y-1 w-full">
        <Skeleton className="bg-[#070C1B] rounded-md h-20 w-full" />
        <Skeleton className="bg-[#070C1B] rounded-md h-48 w-full" />
      </div>
    </div>
  );
}

import { Skeleton } from "../ui/skeleton";

function ProductSkeleton() {
  return (
    <div className="relative">
      <Skeleton
        className="aspect-square w-full rounded-md 
        dark:bg-gray-800 overflow-hidden mb-3"
      />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  );
}

export default ProductSkeleton;

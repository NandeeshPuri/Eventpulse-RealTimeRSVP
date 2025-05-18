import { cn } from "@/lib/utils";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props} data-id="dvfotritn" data-path="src/components/ui/skeleton.tsx" />);


}

export { Skeleton };
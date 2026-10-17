import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "@/lib/utils";

function Slider({
  className,
  thumbProps,
  ...props
}: React.ComponentProps<typeof SliderPrimitive.Root> & {
  thumbProps?: React.ComponentProps<typeof SliderPrimitive.Thumb>;
}) {
  return (
    <SliderPrimitive.Root
      className={cn(
        "relative flex w-full touch-none select-none items-center py-3",
        className,
      )}
      {...props}
    >
      <SliderPrimitive.Track className="relative h-1.5 w-full grow overflow-hidden rounded-full bg-muted">
        <SliderPrimitive.Range className="absolute h-full bg-primary" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        {...thumbProps}
        className="block size-5 rounded-full border border-primary bg-paper shadow-sm ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:pointer-events-none"
      />
    </SliderPrimitive.Root>
  );
}

export { Slider };

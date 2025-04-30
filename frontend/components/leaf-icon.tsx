import { cn } from "@/lib/utils"

interface LeafIconProps {
  className?: string
  variant?: "small" | "medium" | "large"
  position?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
}

export function LeafIcon({ className, variant = "medium", position = "top-right" }: LeafIconProps) {
  const positionClasses = {
    "top-left": "top-0 left-0 -translate-x-1/2 -translate-y-1/2 rotate-45",
    "top-right": "top-0 right-0 translate-x-1/2 -translate-y-1/2 -rotate-45",
    "bottom-left": "bottom-0 left-0 -translate-x-1/2 translate-y-1/2 -rotate-45",
    "bottom-right": "bottom-0 right-0 translate-x-1/2 translate-y-1/2 rotate-45",
  }

  const sizeClasses = {
    small: "w-16 h-16",
    medium: "w-24 h-24",
    large: "w-32 h-32",
  }

  return (
    <div
      className={cn(
        "absolute z-0 opacity-10 text-leaf-500 animate-leaf-sway",
        positionClasses[position],
        sizeClasses[variant],
        className,
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 22c1.25-1.25 2.5-2.5 3.5-4 .83-1.25 1.5-2.5 2-4 .5-1.5.5-3 0-4.5-.5-1.5-1.17-2.75-2-4C4.5 4 3.25 2.75 2 2c0 0 4.5 1 8.5 5s6 8.5 6 8.5-1-4.5-5-8.5S2 2 2 2c1.25 1.25 2.5 2.5 3.5 4 .83 1.25 1.5 2.5 2 4 .5 1.5.5 3 0 4.5-.5 1.5-1.17 2.75-2 4C4.5 20 3.25 21.25 2 22Z" />
        <path d="M17 22c-1 0-2-.5-2.5-1.5-.5-1-.5-2 0-3 .5-1 1.5-1.5 2.5-1.5 1 0 2 .5 2.5 1.5 .5 1 .5 2 0 3-.5 1-1.5 1.5-2.5 1.5Z" />
      </svg>
    </div>
  )
}

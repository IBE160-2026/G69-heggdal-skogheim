"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

// Appen har bare lyst tema, så `next-themes` fra shadcn-malen er tatt bort.
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon aria-hidden="true" className="size-4" />
        ),
        info: (
          <InfoIcon aria-hidden="true" className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon aria-hidden="true" className="size-4" />
        ),
        error: (
          <OctagonXIcon aria-hidden="true" className="size-4" />
        ),
        loading: (
          <Loader2Icon aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "cn-toast",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

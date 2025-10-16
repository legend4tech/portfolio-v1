"use client"

import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

/**
 * Error state component for displaying fetch errors
 * Provides user-friendly error messages and retry functionality
 */
interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the data. Please try again.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Alert className="max-w-md bg-destructive/10 border-destructive/50">
        <AlertCircle className="h-5 w-5 text-destructive" />
        <AlertTitle className="text-lg font-semibold text-destructive">{title}</AlertTitle>
        <AlertDescription className="mt-2 text-muted-foreground">{message}</AlertDescription>
        {onRetry && (
          <Button
            onClick={onRetry}
            variant="outline"
            className="mt-4 w-full bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/50"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </Alert>
    </div>
  )
}

/**
 * Inline error state for smaller error displays
 * Used within tabs or sections
 */
export function InlineErrorState({ message = "Failed to load data", onRetry }: Omit<ErrorStateProps, "title">) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <AlertCircle className="h-12 w-12 text-destructive mb-4" />
      <p className="text-muted-foreground mb-4">{message}</p>
      {onRetry && (
        <Button
          onClick={onRetry}
          variant="outline"
          size="sm"
          className="bg-destructive/10 hover:bg-destructive/20 text-destructive border-destructive/50"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      )}
    </div>
  )
}

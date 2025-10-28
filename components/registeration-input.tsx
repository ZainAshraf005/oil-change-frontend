"use client"

import { useState, useRef } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface RegistrationInputProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  error?: string
}

export function RegistrationInput({
  value,
  onChange,
  label = "Registration Number",
  placeholder = "LEK-09-2061 or ABC-123",
  error,
}: RegistrationInputProps) {
  const [displayValue, setDisplayValue] = useState(value)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Uppercase everything but preserve user's hyphens
    const input = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, "")
    setDisplayValue(input)
    onChange(input)
  }

  // ✅ Smart validation: allows flexible Pakistani-style plates
  const isValid = (): boolean => {
    const pattern = /^[A-Z]{2,4}(-[A-Z0-9]{1,3})?(-[0-9]{1,4})?$/
    return pattern.test(displayValue) || displayValue === ""
  }

  return (
    <div className="grid gap-2">
      {label && <Label>{label}</Label>}
      <div className="relative">
        <Input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={14}
          className={`font-mono border tracking-wider ${
            error || (!isValid() && displayValue)
              ? "border-destructive focus-visible:ring-destructive"
              : ""
          }`}
        />
        {displayValue && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            {isValid() ? (
              <svg
                className="h-5 w-5 text-green-600"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5 text-destructive"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </div>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <p className="text-xs text-muted-foreground">
        Valid formats: LEK-09-2061, LEK-13A-6066, LEK-01-1, ABC-123
      </p>
    </div>
  )
}

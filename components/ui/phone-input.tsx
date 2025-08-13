"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import type { InputProps } from "@/components/ui/input"

interface PhoneInputProps extends Omit<InputProps, 'onChange'> {
  onChange?: (value: string) => void
  value?: string
}

export function PhoneInput({ onChange, value, ...props }: PhoneInputProps) {
  const [displayValue, setDisplayValue] = useState("")

  useEffect(() => {
    if (value) {
      setDisplayValue(formatPhoneNumber(value))
    }
  }, [value])

  const formatPhoneNumber = (input: string): string => {
    // Remove all non-digits
    const digits = input.replace(/\D/g, "")
    
    // Limit to 10 digits
    const limited = digits.slice(0, 10)
    
    // Format as (XXX) XXX-XXXX
    if (limited.length === 0) return ""
    if (limited.length <= 3) return `(${limited}`
    if (limited.length <= 6) return `(${limited.slice(0, 3)}) ${limited.slice(3)}`
    return `(${limited.slice(0, 3)}) ${limited.slice(3, 6)}-${limited.slice(6)}`
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value
    const formatted = formatPhoneNumber(input)
    setDisplayValue(formatted)
    
    // Extract digits for the actual value
    const digits = input.replace(/\D/g, "").slice(0, 10)
    
    if (onChange) {
      onChange(digits)
    }
  }

  return (
    <Input
      {...props}
      type="tel"
      value={displayValue}
      onChange={handleChange}
      placeholder={props.placeholder || "(303) 555-1234"}
    />
  )
}

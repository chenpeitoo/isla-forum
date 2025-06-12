// components/ui/checkbox.js
'use client'

import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { CheckIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

// Checkbox 元件
const Checkbox = ({ className, ...props }) => {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        'peer size-4 shrink-0 rounded-[4px] border border-input shadow-xs transition-shadow outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:border-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground dark:data-[state=checked]:bg-primary dark:bg-input/30 data-[state=checked]:border-primary aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

// CheckboxGroup 元件（僅為包裹群組使用）
const CheckboxGroup = ({ children, className }) => {
  return <div className={cn('space-y-2', className)}>{children}</div>
}

// CheckboxField 元件（包含 Checkbox + Label + Description）
const CheckboxField = ({ children, className }) => {
  return <div className={cn('flex flex-col gap-1', className)}>{children}</div>
}

// Label 元件（for checkbox）
const Label = ({ children, className }) => {
  return (
    <label className={cn('text-sm font-medium', className)}>{children}</label>
  )
}

// Description 元件（副標說明）
const Description = ({ children, className }) => {
  return (
    <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
  )
}

export { Checkbox, CheckboxGroup, CheckboxField, Label, Description }

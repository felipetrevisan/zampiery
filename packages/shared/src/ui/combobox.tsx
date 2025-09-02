import { cn } from '@nathy/shared/lib/utils'
import { Button } from '@nathy/shared/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@nathy/shared/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@nathy/shared/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { type Control, Controller, type FieldPath, type FieldValues } from 'react-hook-form'

type Option = {
  value: string
  label: string
}

type ComboboxFieldProps<TFormValues extends FieldValues> = {
  control: Control<TFormValues>
  name: FieldPath<TFormValues>
  options?: Option[]
  placeholder?: string
  disabled?: boolean
  className?: string
  returnType?: 'object' | 'string'
}

export function ComboboxField<TFormValues extends FieldValues>({
  control,
  name,
  options,
  placeholder = 'Selecionar...',
  disabled = false,
  className,
  returnType = 'object',
}: ComboboxFieldProps<TFormValues>) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Popover open={isOpen} onOpenChange={setIsOpen} modal>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              // biome-ignore lint/a11y/useSemanticElements: <explanation>
              role="combobox"
              aria-expanded={isOpen}
              className={cn('h-12 w-[200px] justify-between', className)}
              aria-disabled={disabled}
              disabled={disabled}
            >
              {returnType === 'object'
                ? (field.value?.name ?? placeholder)
                : (options?.find((opt) => opt.value === field.value)?.label ?? placeholder)}
              <ChevronsUpDown className="opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={placeholder} className="h-9" />
              <CommandList>
                <CommandEmpty>Nenhuma opção encontrada</CommandEmpty>
                <CommandGroup>
                  {options?.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onMouseDown={(e) => {
                        e.preventDefault()
                        if (returnType === 'object') {
                          field.onChange({ id: option.value, name: option.label })
                        } else {
                          console.log(option.value)
                          field.onChange(option.value)
                        }
                        setIsOpen(false)
                      }}
                    >
                      {option.label}
                      <Check
                        className={cn(
                          'ml-auto',
                          returnType === 'object'
                            ? field.value?.id === option.value
                              ? 'opacity-100'
                              : 'opacity-0'
                            : field.value === option.value
                              ? 'opacity-100'
                              : 'opacity-0',
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    />
  )
}

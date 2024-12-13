"use client"

import { useState, useEffect } from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "~/lib/utils"
import { Button } from "~/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import { getNamespaces } from '~/app/actions'

interface NamespaceSelectorProps {
  onNamespaceChange: (namespace: string) => void
}

export function NamespaceSelector({ onNamespaceChange }: NamespaceSelectorProps) {
  const [open, setOpen] = useState(false)
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [selectedNamespace, setSelectedNamespace] = useState<string>("monitoring")

  useEffect(() => {
    async function fetchNamespaces() {
      try {
        const data = await getNamespaces();
        const additionalNamespace = 'all'
        setNamespaces([additionalNamespace, ...data ])
      } catch (error) {
        console.error('Failed to fetch namespaces:', error)
      }
    }
    fetchNamespaces()
  }, [])
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between bg-gray-800 text-white border-gray-700"
        >
          {selectedNamespace}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0  bg-gray-800 border-gray-700">
        <Command className=' bg-gray-800 text-white border-gray-700'>
          <CommandInput placeholder="Search namespace..." className="text-white" />
          <CommandEmpty>No namespace found.</CommandEmpty>
          <CommandGroup>
            {namespaces && namespaces.map((namespace) => (
              <CommandItem
                key={"namespace-" + namespace}
                onSelect={(currentValue) => {
                  setSelectedNamespace(currentValue)
                  onNamespaceChange(currentValue)
                  setOpen(false)
                }}
                className="text-white hover:bg-gray-700"
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedNamespace === namespace ? "opacity-100" : "opacity-0"
                  )}
                />
                {namespace}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}


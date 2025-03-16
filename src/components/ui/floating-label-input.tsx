import { Input } from "@/components/ui/input"
import { useState } from "react"

type Props = {
  label: string
}

export default function FloatingLabelInput({ label, ...props }: Props) {
  const [isFocused, setIsFocused] = useState(false)
  const [value, setValue] = useState("")

  return (
    <div className="relative w-full">
      <label
        className={`absolute left-3 transition-all text-gray-500 pointer-events-none
          ${isFocused || value ? "-top-6 left-0 text-xs text-gray-700" : "top-1/2 -translate-y-1/2 text-base"}`}
      >
        {label}
      </label>
      <Input
        className="w-full py-4 px-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(e) => setValue(e.target.value)}
        value={value}
        {...props}
      />
    </div>
  )
}

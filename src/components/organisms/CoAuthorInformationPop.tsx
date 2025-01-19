import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Info } from "lucide-react"

type Props = {
  children: React.ReactNode
}

export function CoAuthorInformationPop({ children }: Props) {
  return (
    <Popover>
      <PopoverTrigger>
        <Info />
      </PopoverTrigger>

      <PopoverContent className='text-gray-600 text-sm'>
        {children}
      </PopoverContent>
    </Popover>
  )
}

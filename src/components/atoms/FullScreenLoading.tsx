import { Loader } from "lucide-react"

export function FullScreenLoading() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <Loader className='animate-spin' />
    </div>
  )
}

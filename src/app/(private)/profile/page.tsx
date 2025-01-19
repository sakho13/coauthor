import { joinClassName } from "@/utils/functions/joinClassName"

export default function Page() {
  return (
    <div className='w-full px-2'>
      <div
        className={joinClassName(
          "w-full",
          "flex justify-between items-center",
          "border-b",
          "px-16 py-4",
        )}
      >
        <h1 className='font-bold text-xl select-none'>プロフィール</h1>
      </div>

      <div></div>
    </div>
  )
}

import { FeaturesCarousel } from "@/components/molecules/FeaturesCarousel"
import { Button } from "@/components/ui/button"
import { joinClassName } from "@/utils/functions/joinClassName"
import Link from "next/link"

export default function Home() {
  return (
    <main className='h-full'>
      <div
        id='top-banner'
        className={joinClassName(
          "h-72",
          "grid grid-cols-1 grid-rows-4 sm:grid-cols-3 sm:grid-rows-4",
          "select-none",
          "border-b",
          "bg-slate-100",
        )}
      >
        <div
          className={joinClassName(
            "sm:col-start-2 row-start-2",
            "flex justify-center items-center flex-col",
          )}
        >
          <h1 className={joinClassName("font-extrabold text-5xl")}>CoAuthor</h1>
          <p className={joinClassName("text-lg text-slate-500")}>
            - 小説執筆アシスタント -
          </p>
        </div>

        <div
          className={joinClassName(
            "sm:col-start-2 row-start-3",
            "flex justify-center items-center",
          )}
        >
          <Button className='font-bold' asChild>
            <Link href={"/login"}>ログイン - Login</Link>
          </Button>
        </div>
      </div>

      <div className={joinClassName("py-4 px-16 mx-8")}>
        <p className='font-bold text-xl select-none'>機能</p>

        <div className='mt-4 mx-16'>
          <FeaturesCarousel />
        </div>
      </div>
    </main>
  )
}

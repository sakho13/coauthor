"use client"

import { PageTitleParagraph } from "@/components/atoms/PageTitleParagraph"
import { CoAuthorInformationPop } from "@/components/organisms/CoAuthorInformationPop"
import { CoAuthorNovelsList } from "@/components/organisms/CoAuthorNovelsList"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function Page() {
  return (
    <div className='w-full px-2'>
      <PageTitleParagraph title='執筆中小説'>
        <div className='flex items-center gap-4'>
          <Button asChild>
            <Link href='/novel/new'>
              <Plus />
              新規
            </Link>
          </Button>

          <CoAuthorInformationPop>
            <p>執筆中の小説が表示されます。</p>
            <p></p>
          </CoAuthorInformationPop>
        </div>
      </PageTitleParagraph>

      <div className='w-full flex justify-center py-8'>
        <CoAuthorNovelsList />
      </div>
    </div>
  )
}

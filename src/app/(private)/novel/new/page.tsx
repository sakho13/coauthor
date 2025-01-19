"use client"

import { CoAuthorNewNovelForm } from "@/components/organisms/CoAuthorNewNovelForm"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function Page() {
  return (
    <div className='w-full px-2'>
      <div className='flex justify-center'>
        <Card className='w-[400px]'>
          <CardHeader>新しく小説を作成する</CardHeader>

          <CardContent>
            <CoAuthorNewNovelForm />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

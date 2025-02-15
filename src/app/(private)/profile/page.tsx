import { PageTitleParagraph } from "@/components/atoms/PageTitleParagraph"
import { CoAuthorProfile } from "@/components/organisms/CoAuthorProfile"

export default function Page() {
  return (
    <div className='w-full px-2'>
      <PageTitleParagraph title='プロフィール'></PageTitleParagraph>

      <div className='w-full flex justify-center py-8'>
        <CoAuthorProfile />
      </div>
    </div>
  )
}

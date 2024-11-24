import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'
import NovelsCell from 'src/components/Novel/NovelsCell'

/**
 * 小説の執筆ページ
 * @returns
 */
const DeskPage = () => {
  return (
    <>
      <Metadata title="執筆中小説一覧" description="執筆中小説一覧ページ" />

      <div className="border rounded-lg py-4 px-8">
        <div className="flex justify-between">
          <h1>執筆中の小説</h1>

          <Link className="btn" to={routes.newNovel()}>
            新規小説を作成する
          </Link>
        </div>

        <NovelsCell />
      </div>
    </>
  )
}

export default DeskPage

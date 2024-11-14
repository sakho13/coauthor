// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

/**
 * 本棚ページ
 * * 執筆中のNovel
 * * 他のユーザーのNovel
 * @returns
 */
const MyBookshelfPage = () => {
  return (
    <>
      <Metadata title="MyBookshelf" description="MyBookshelf page" />

      <h1>MyBookshelfPage</h1>
      <p>
        Find me in{' '}
        <code>./web/src/pages/MyBookshelfPage/MyBookshelfPage.tsx</code>
      </p>
      {/*
          My default route is named `myBookshelf`, link to me with:
          `<Link to={routes.myBookshelf()}>MyBookshelf</Link>`
      */}
    </>
  )
}

export default MyBookshelfPage

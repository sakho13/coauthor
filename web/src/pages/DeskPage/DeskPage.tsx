// import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

/**
 * 小説の執筆ページ
 * @returns
 */
const DeskPage = () => {
  return (
    <>
      <Metadata title="Desk" description="Desk page" />

      <h1>DeskPage</h1>
      <p>
        Find me in <code>./web/src/pages/DeskPage/DeskPage.tsx</code>
      </p>
      {/*
          My default route is named `desk`, link to me with:
          `<Link to={routes.desk()}>Desk</Link>`
      */}
    </>
  )
}

export default DeskPage

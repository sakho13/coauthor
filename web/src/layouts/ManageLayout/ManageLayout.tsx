import { Link, routes } from '@redwoodjs/router'

type ManageLayoutProps = {
  children?: React.ReactNode
}

const ManageLayout = ({ children }: ManageLayoutProps) => {
  return (
    <>
      <header>
        <h1>
          <Link to={routes.home()}>CoAuthor</Link>
        </h1>
      </header>

      <main>{children}</main>
    </>
  )
}

export default ManageLayout

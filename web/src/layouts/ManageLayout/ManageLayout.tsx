import { Link, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'

type ManageLayoutProps = {
  children?: React.ReactNode
}

const ManageLayout = ({ children }: ManageLayoutProps) => {
  const { logOut } = useAuth()
  return (
    <>
      <header
        id="top-header-a"
        className="border-b-2 px-16 py-4 shadow-sm flex justify-between"
      >
        <h1 className="select-none font-bold text-xl">
          <Link to={routes.myBookshelf()}>CoAuthor</Link>
        </h1>

        <button
          type="button"
          onClick={() => {
            logOut()
          }}
        >
          A
        </button>
      </header>

      <main>{children}</main>
    </>
  )
}

export default ManageLayout

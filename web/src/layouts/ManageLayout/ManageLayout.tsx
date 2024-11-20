import { Link, routes } from '@redwoodjs/router'
import { useAuth } from 'src/auth'
import AccountCircleSvg from './account-circle.svg'

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

        <div tabIndex={0} className="dropdown dropdown-end">
          <div className="btn btn-ghost btn-circle avatar h-fit">
            <div className="w-8">
              <img src={AccountCircleSvg} alt="Logo" />
            </div>
          </div>

          <ul
            tabIndex={0}
            className={[
              'menu menu-sm dropdown-content',
              'shadow-sm',
              'bg-base-100 rounded-box z-[1] mt-3 w-52 p-2',
            ].join(' ')}
          >
            <li>
              <p>プロフィール</p>
            </li>
            <li>
              <button type="button" onClick={() => logOut()}>
                ログアウト
              </button>
            </li>
          </ul>
        </div>
      </header>

      <main>{children}</main>
    </>
  )
}

export default ManageLayout

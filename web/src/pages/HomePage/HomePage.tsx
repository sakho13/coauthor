// import { Link, routes } from '@redwoodjs/router'
import { Link, routes } from '@redwoodjs/router'
import { Metadata } from '@redwoodjs/web'

const HomePage = () => {
  return (
    <>
      <Metadata title="CoAuthorTop" description="Home page" />

      <div id="top-header" className="border-b-2 px-16 py-4 shadow-sm">
        <h1 className="select-none font-bold text-xl">
          CoAuthor - Novel manager
        </h1>
      </div>

      <div className="w-fit my-8 mx-auto">
        <div className="border px-12 py-8 shadow rounded-lg w-[600px]">
          <div className="w-fit">
            <h1 className="text-lg font-bold select-none">CoAuthor - 機能</h1>
          </div>
          <div className="m-4">
            <ul className="select-none menu bg-base-200 rounded-box w-full">
              <li>
                <p>小説管理</p>
              </li>
              <li>
                <p>執筆アシスタント</p>

                <ul>
                  <li>
                    <p>単語辞書</p>
                  </li>
                  {/* <li>
                    <p>AIアシスト</p>
                  </li> */}
                </ul>
              </li>
              <li>
                <p>小説共有</p>
              </li>
            </ul>
          </div>

          <div className="w-full flex justify-center">
            <Link to={routes.login()} className="btn btn-secondary">
              執筆を始める
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomePage

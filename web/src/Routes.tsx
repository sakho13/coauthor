// In this file, all Page components from 'src/pages` are auto-imported. Nested
// directories are supported, and should be uppercase. Each subdirectory will be
// prepended onto the component name.
//
// Examples:
//
// 'src/pages/HomePage/HomePage.js'         -> HomePage
// 'src/pages/Admin/BooksPage/BooksPage.js' -> AdminBooksPage

import { Set as RouteSet, Router, Route, PrivateSet } from '@redwoodjs/router'

import ScaffoldLayout from 'src/layouts/ScaffoldLayout'

import { useAuth } from './auth'
import ManageLayout from './layouts/ManageLayout/ManageLayout'

const Routes = () => {
  return (
    <Router useAuth={useAuth}>
      <Route path="/" page={HomePage} name="home" />

      <RouteSet wrap={ScaffoldLayout} title="Novels" titleTo="novels" buttonLabel="New Novel" buttonTo="newNovel">
        <Route path="/novels/new" page={NovelNewNovelPage} name="newNovel" />
        <Route path="/novels/{novelId}/edit" page={NovelEditNovelPage} name="editNovel" />
        <Route path="/novels/{novelId}" page={NovelNovelPage} name="novel" />
        <Route path="/novels" page={NovelNovelsPage} name="novels" />
      </RouteSet>

      <PrivateSet unauthenticated="home" wrap={ManageLayout}>
        <Route path="/my-bookshelf" page={MyBookshelfPage} name="myBookshelf" />
        <Route path="/desk" page={DeskPage} name="desk" />
      </PrivateSet>

      <Route path="/login" page={LoginPage} name="login" />
      <Route path="/signup" page={SignupPage} name="signup" />
      <Route path="/forgot-password" page={ForgotPasswordPage} name="forgotPassword" />
      <Route path="/reset-password" page={ResetPasswordPage} name="resetPassword" />
      <Route notfound page={NotFoundPage} />
    </Router>
  )
}

export default Routes

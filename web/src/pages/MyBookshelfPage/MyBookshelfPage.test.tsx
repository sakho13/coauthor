import { render } from '@redwoodjs/testing/web'

import MyBookshelfPage from './MyBookshelfPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('MyBookshelfPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<MyBookshelfPage />)
    }).not.toThrow()
  })
})

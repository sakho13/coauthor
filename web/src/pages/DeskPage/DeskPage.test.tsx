import { render } from '@redwoodjs/testing/web'

import DeskPage from './DeskPage'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('DeskPage', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<DeskPage />)
    }).not.toThrow()
  })
})

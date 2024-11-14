import { render } from '@redwoodjs/testing/web'

import ManageLayout from './ManageLayout'

//   Improve this test with help from the Redwood Testing Doc:
//   https://redwoodjs.com/docs/testing#testing-pages-layouts

describe('ManageLayout', () => {
  it('renders successfully', () => {
    expect(() => {
      render(<ManageLayout />)
    }).not.toThrow()
  })
})

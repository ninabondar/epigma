import React from 'react'
import App from '../components/App'

describe("<App />", () => {
  it("smoke test of App component", () => {
    shallow(<App />)
  })
})

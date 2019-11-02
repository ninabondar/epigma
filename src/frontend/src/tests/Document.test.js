import React from 'react'
import Document from '../components/Document'

describe('<Document/>', () => {
  const props = {
    title: 'TestDocument',
    createdAt: Date.now()
  }

  test('should match its snapshot', () => {
    const component = shallow(<Document {...props}/>)
    expect(component).toMatchSnapshot()
  })

  test('should run clickHandler on button click', () => {
    const spy = jest.spyOn(Document.defaultProps, 'clickHandler')
    const component = shallow(<Document {...props}/>)
    const btn = component.find('.Document__more-btn')
    
    expect(btn.exists()).toBeTruthy()
    btn.simulate('click')
    expect(spy.mock.calls.length).toBe(1)
  })
})
import React from 'react';
import Login from '../components/Login'

describe('<Login/>', () => {
  test('should match its snapshot', () => {
    const component = shallow(<Login/>)
    expect(component).toMatchSnapshot()
  })
})
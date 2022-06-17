import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'
import store from './store'


import App from './App'
// import App from './components/mainbody/index'
ReactDOM.render(
  <Provider store={store}>
    <App />
    {/* <TemperaturePage/> */}
  </Provider>
  ,
  document.getElementById('root'))
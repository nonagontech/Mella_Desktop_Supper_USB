// applyMiddleware(中间件1,中间件2)使用中间件
import { createStore, applyMiddleware } from 'redux'

// import {confi} from 'react-redux'

// composeWithDevTools()  redux调试工具
import { composeWithDevTools } from 'redux-devtools-extension'

// thunk中间件  dispath()能够传入函数执行异步请求
import thunk from 'redux-thunk'

// 合并后的reducer
import reducer from './reducers'

// 创建store 传入合并后的reducer
const store = createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))

export default store

import { combineReducers } from 'redux'

import hardwareReduce from './hardwareReduce'
import petReduce from './petReduce'
import userReduce from './userReduce'
import qsmReduce from './qsmReduce'
import systemReduce from './systemReduce'
export default combineReducers({
  hardwareReduce,
  petReduce,
  userReduce,
  qsmReduce,
  systemReduce
})
import { combineReducers } from 'redux'

import hardwareReduce from './hardwareReduce'
import petReduce from './petReduce'
import userReduce from './userReduce'
import qsmReduce from './qsmReduce'
export default combineReducers({
  hardwareReduce,
  petReduce,
  userReduce,
  qsmReduce
})
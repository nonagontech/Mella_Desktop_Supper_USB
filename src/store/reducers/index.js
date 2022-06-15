import { combineReducers } from 'redux'

import hardwareReduce from './hardwareReduce'
import petReduce from './petReduce'
export default combineReducers({
  hardwareReduce,
  petReduce
})
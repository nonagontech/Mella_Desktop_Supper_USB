
// import {JIAN} from './../actionTypes/loginType'
// import {} from ''
import { JIAN, ADD, TITLE } from './../actionTypes'
export const jianNUm = (data = 1) => {
  return {
    type: JIAN,
    data
  }
}


export const addNum = (data = 1) => {
  return {
    type: ADD,
    data
  }
}
export const changeTitle = (data = 1) => {
  return {
    type: TITLE,
    data
  }
}


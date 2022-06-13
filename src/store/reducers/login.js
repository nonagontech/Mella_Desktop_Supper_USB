import { JIAN, TITLE } from './../actionTypes/loginType'
import { ADD } from './../actionTypes/testType'


const initialState = {
  conunt: 100,
  title: '123456'
}
export default function loginReducer (state = initialState, action) {
  console.log('loginReducer', state, action);
  switch (action.type) {
    case JIAN:
      return { ...state, conunt: state.conunt - 1 }

    case ADD:
      return { ...state, conunt: state.conunt + 1 }

    case TITLE:
      return { ...state, title: action.data }

    default:
      return state;
  }

}
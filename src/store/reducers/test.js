import { JIAN } from './../actionTypes/loginType'
import { ADD } from './../actionTypes/testType'

const initialState = {
  conunt: 0
}
export default function testReducer (state = initialState, action) {
  console.log('test.jsx', state, action);
  switch (action.type) {
    // case ADD:
    //   return { ...state, conunt: state.conunt + 1 }


    default:
      return state;
  }

}
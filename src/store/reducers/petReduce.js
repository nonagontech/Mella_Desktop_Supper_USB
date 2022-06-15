import {
  PET_SORT_TYPE,
  PET_DETAIL_INFO,
} from '../actionTypes'

const initialState = {
  //定义宠物排序的方式
  petSortType: 'Pet Name',
  //定义宠物的详细信息
  petDetailInfo: {}
}
export default function testReducer (state = initialState, action) {
  // console.log('test.jsx', state, action);
  switch (action.type) {
    case PET_SORT_TYPE:
      return { ...state, petSortType: action.data }

    case PET_DETAIL_INFO:
      return { ...state, petDetailInfo: action.data }

    default:
      return state;
  }

}
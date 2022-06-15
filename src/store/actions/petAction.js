import {
  PET_SORT_TYPE,
  PET_DETAIL_INFO
} from './../actionTypes'

//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
  return {
    type,
    data
  }
}

//改变宠物排序的方式
export const petSortTypeFun = (data) => getAction(data, PET_SORT_TYPE)
//改变宠物的详细信息
export const petDetailInfoFun = (data) => getAction(data, PET_DETAIL_INFO)
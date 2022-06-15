

import {
  SELECT_HARDWARE_INDEX,
  SELECT_HARDWARE_LIST,
  SELECT_HARDWARE_INFO,
  SELECT_HARDWARE_MODAL_SHOW
} from './../actionTypes'

//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
  return {
    type,
    data
  }
}
//点击了导航栏的硬件种类，获取到硬件种类的index和种类下对应的硬件列表
export const changeselectHardwareIndex = (data) => getAction(data, SELECT_HARDWARE_INDEX)
export const selectHardwareList = (data = {}) => getAction(data, SELECT_HARDWARE_LIST)
//点击了硬件列表的硬件，获取到硬件的信息
export const selectHardwareInfoFun = (data = {}) => getAction(data, SELECT_HARDWARE_INFO)
//是否显示硬件弹框
export const selectHardwareModalShowFun = (data = {}) => getAction(data, SELECT_HARDWARE_MODAL_SHOW)














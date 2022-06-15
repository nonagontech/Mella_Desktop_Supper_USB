

import {
  SELECT_HARDWARE_INDEX,
  SELECT_HARDWARE_LIST,
  SELECT_HARDWARE_INFO,
  SELECT_HARDWARE_MODAL_SHOW,
  ISHAVE_USB_DEVICE,
  MELLA_CONNECT_STATUS,
  MELLA_MEASURE_VALUE,
  MELLA_PREDICT_VALUE,
  MELLA_MEASURE_PART,

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
//是否存在USB设备
export const setIsHaveUsbDeviceFun = (data = {}) => getAction(data, ISHAVE_USB_DEVICE)
//设置mella的连接状态
export const setMellaConnectStatusFun = (data = {}) => getAction(data, MELLA_CONNECT_STATUS)
//设置mella测量数值
export const setMellaMeasureValueFun = (data = {}) => getAction(data, MELLA_MEASURE_VALUE)
//设置mella预测数组数据
export const setMellaPredictValueFun = (data = {}) => getAction(data, MELLA_PREDICT_VALUE)
//设置mella测量部位
export const setMellaMeasurePartFun = (data = {}) => getAction(data, MELLA_MEASURE_PART)












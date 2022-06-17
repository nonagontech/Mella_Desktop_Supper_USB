

import {
  HARDWARE_LIST,
  SELECT_HARDWARE_INDEX,
  SELECT_HARDWARE_LIST,
  SELECT_HARDWARE_INFO,
  SELECT_HARDWARE_MODAL_SHOW,
  ISHAVE_USB_DEVICE,
  MELLA_CONNECT_STATUS,
  MELLA_MEASURE_VALUE,
  MELLA_PREDICT_VALUE,
  MELLA_MEASURE_PART,
  SELECT_HARDWARE_TYPE,
  MELLA_DEVICE_ID,
  BIGGIE_CONNECT_STATUS,
  BIGGIE_BODY_FAT,
  BIGGIE_BODY_WEIGHT,
  BIGGIE_UNIT,
  BIGGIE_SAME_WEIGHT_COUNT,
  RULER_CONNECT_STATUS,
  RULER_MEASURE_VALUE,
  RULER_UNIT,
  RULER_CONFIRM_COUNT,
  RECEIVE_BROADCAST_HARDWARE_INFO
} from './../actionTypes'

//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
  return {
    type,
    data
  }
}
//应用初始化获取的全部硬件集合
export const setHardwareList = (data) => getAction(data, HARDWARE_LIST)
//点击了导航栏的硬件种类，获取到硬件种类的index和种类下对应的硬件列表
export const changeselectHardwareIndex = (data) => getAction(data, SELECT_HARDWARE_INDEX)
export const selectHardwareList = (data = {}) => getAction(data, SELECT_HARDWARE_LIST)
//设置选择硬件的类型
export const setSelectHardwareType = (data) => getAction(data, SELECT_HARDWARE_TYPE)
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
//设置mella设备ID
export const setMellaDeviceIdFun = (data = {}) => getAction(data, MELLA_DEVICE_ID)

//设置biggie体脂称的连接状态
export const setBiggieConnectStatusFun = (data = {}) => getAction(data, BIGGIE_CONNECT_STATUS)
//设置biggie体脂称测量的体脂百分比
export const setBiggieBodyFatFun = (data = {}) => getAction(data, BIGGIE_BODY_FAT)
//设置biggie体脂称测量的体重
export const setBiggieBodyWeightFun = (data = {}) => getAction(data, BIGGIE_BODY_WEIGHT)
//设置biggie体脂称测量的单位
export const setBiggieUnitFun = (data = {}) => getAction(data, BIGGIE_UNIT)
//设置biggie体脂称测量的相同体重次数
export const setBiggieSameWeightCountFun = (data = {}) => getAction(data, BIGGIE_SAME_WEIGHT_COUNT)

//设置尺子的连接状态
export const setRulerConnectStatusFun = (data = {}) => getAction(data, RULER_CONNECT_STATUS)
//设置尺子测量的数值
export const setRulerMeasureValueFun = (data = {}) => getAction(data, RULER_MEASURE_VALUE)
//设置尺子测量的单位
export const setRulerUnitFun = (data = {}) => getAction(data, RULER_UNIT)
//设置尺子测量的确认次数
export const setRulerConfirmCountFun = (data = {}) => getAction(data, RULER_CONFIRM_COUNT)

//设置接受广播中蓝牙的信息
export const setReceiveBroadcastHardwareInfoFun = (data = {}) => getAction(data, RECEIVE_BROADCAST_HARDWARE_INFO)

















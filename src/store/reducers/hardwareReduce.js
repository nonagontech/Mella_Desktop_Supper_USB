import {
  SELECT_HARDWARE_INDEX,
  SELECT_HARDWARE_LIST,
  SELECT_HARDWARE_INFO,
  SELECT_HARDWARE_MODAL_SHOW
} from '../actionTypes/hardwareType'

//这里面是硬件的一些信息存储


const initialState = {
  //选择的硬件类型的index
  selectHardwareIndex: -1,
  //选择硬件类型对应的硬件的列表
  selectHardwareList: {},
  //选择的硬件信息
  selectHardwareInfo: {},
  //选择硬件类型下的硬件弹框是否显示
  selectHardwareModalShow: false

}
export default function HardwareReducer (state = initialState, action) {
  // console.log('state', state);

  switch (action.type) {
    case SELECT_HARDWARE_INDEX:
      return { ...state, selectHardwareIndex: action.data }
    case SELECT_HARDWARE_LIST:
      return { ...state, selectHardwareList: action.data }
    case SELECT_HARDWARE_INFO:
      return { ...state, selectHardwareInfo: action.data }
    case SELECT_HARDWARE_MODAL_SHOW:
      return { ...state, selectHardwareModalShow: action.data }
    default:
      return state;
  }

}
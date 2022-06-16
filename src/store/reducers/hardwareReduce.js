import {
  SELECT_HARDWARE_INDEX,
  SELECT_HARDWARE_TYPE,
  SELECT_HARDWARE_LIST,
  SELECT_HARDWARE_INFO,
  SELECT_HARDWARE_MODAL_SHOW,
  ISHAVE_USB_DEVICE,
  MELLA_CONNECT_STATUS,
  MELLA_MEASURE_VALUE,
  MELLA_PREDICT_VALUE,
  MELLA_MEASURE_PART,
  MELLA_DEVICE_ID
} from '../actionTypes/hardwareType'

//这里面是硬件的一些信息存储


const initialState = {
  //选择的硬件类型的index
  selectHardwareIndex: 0,
  //选择的硬件类型
  selectHardwareType: 'mellaPro',
  //选择硬件类型对应的硬件的列表
  selectHardwareList: {},
  //选择的硬件信息
  selectHardwareInfo: {},
  //选择硬件类型下的硬件弹框是否显示
  selectHardwareModalShow: false,
  //是否存在USB设备
  isHaveUsbDevice: true,
  //mella的连接状态
  mellaConnectStatus: 'disconnected',
  //mella测量数值
  mellaMeasureValue: 0,
  //mella预测数组数据
  mellaPredictValue: [],
  //mella测量部位
  mellaMeasurePart: '腋温',
  //mella设备ID
  mellaDeviceId: '',


}
export default function HardwareReducer(state = initialState, action) {
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
    case ISHAVE_USB_DEVICE:
      return { ...state, isHaveUsbDevice: action.data }
    case MELLA_CONNECT_STATUS:
      return { ...state, mellaConnectStatus: action.data }
    case MELLA_MEASURE_VALUE:
      return { ...state, mellaMeasureValue: action.data }
    case MELLA_PREDICT_VALUE:
      return { ...state, mellaPredictValue: action.data }
    case MELLA_MEASURE_PART:
      return { ...state, mellaMeasurePart: action.data }

    case SELECT_HARDWARE_TYPE:
      return { ...state, selectHardwareType: action.data }
    case MELLA_DEVICE_ID:
      return { ...state, mellaDeviceId: action.data }


    default:
      return state;
  }

}
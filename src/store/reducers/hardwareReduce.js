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

  //biggie体脂称的连接状态
  biggieConnectStatus: 'disconnected',
  //biggie体脂称的体脂值
  biggieBodyFat: 0,
  //biggie体脂称的体重值,这里的数值是kg单位下的值,lb要自行转换
  biggieBodyWeight: 0,
  //biggie体脂称的测量单位
  biggieUnit: 'kg',
  //体脂称重量相同的次数
  biggieSameWeightCount: 0,

  //尺子的连接状态
  rulerConnectStatus: 'disconnected',
  //尺子的测量值
  rulerMeasureValue: 0,
  //尺子的单位
  rulerUnit: 'cm',
  //尺子的确认次数
  rulerConfirmCount: -1,

  //广播的硬件信息
  receiveBroadcastHardwareInfo: {
    deviceType: '',
    macId: '',
    name: ''
  }



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

    case BIGGIE_CONNECT_STATUS:
      return { ...state, biggieConnectStatus: action.data }
    case BIGGIE_BODY_FAT:
      return { ...state, biggieBodyFat: action.data }
    case BIGGIE_BODY_WEIGHT:
      return { ...state, biggieBodyWeight: action.data }
    case BIGGIE_UNIT:
      return { ...state, biggieUnit: action.data }
    case BIGGIE_SAME_WEIGHT_COUNT:
      return { ...state, biggieSameWeightCount: action.data }

    case RULER_CONNECT_STATUS:
      return { ...state, rulerConnectStatus: action.data }
    case RULER_MEASURE_VALUE:
      return { ...state, rulerMeasureValue: action.data }
    case RULER_UNIT:
      return { ...state, rulerUnit: action.data }
    case RULER_CONFIRM_COUNT:
      return { ...state, rulerConfirmCount: action.data }

    case RECEIVE_BROADCAST_HARDWARE_INFO:
      return { ...state, receiveBroadcastHardwareInfo: action.data }




    default:
      return state;
  }

}
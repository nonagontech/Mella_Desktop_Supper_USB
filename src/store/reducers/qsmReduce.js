import {
    QSMCONNECTSTATUS,
    QSMEARPART,
    QSMPART,
    QSMSERIALNUMBER,
    QSMTIMETYPE
} from '../actionTypes'

const initialState = {
    //qsm的连接状态，disconnected,connected
    qsmConnectStatus: 'disconnected',
    //QSM的序列号
    qsmSerialNumber: '',
    //QSM测试的耳朵部位,1是右耳，2是左耳
    qsmEarPart: 1,
    //QSM仪器所在端口号 
    qsmPart: '',
    //QSM等待时间方式,0是1分钟。1是12小时
    qsmTimeType: 0,
}
export default function testReducer(state = initialState, action) {

    switch (action.type) {
        case QSMCONNECTSTATUS:
            return { ...state, qsmConnectStatus: action.data }
        case QSMSERIALNUMBER:
            return { ...state, qsmSerialNumber: action.data }
        case QSMEARPART:
            return { ...state, qsmEarPart: action.data }
        case QSMPART:
            return { ...state, qsmPart: action.data }

        case QSMTIMETYPE:
            return { ...state, qsmTimeType: action.data }
        default:
            return state;
    }
}
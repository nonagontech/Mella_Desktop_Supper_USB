

import {
    QSMCONNECTSTATUS,
    QSMEARPART,
    QSMPART,
    QSMSERIALNUMBER,
    QSMTIMETYPE
} from './../actionTypes'

//定义一个函数，让他返回一个action函数
const getAction = (data, type) => {
    return {
        type,
        data
    }
}
//设置qsm的连接状态
export const setQsmConnectStatus = (data) => getAction(data, QSMCONNECTSTATUS)

//设置qsm的序列号
export const setQsmSerialNumber = (data) => getAction(data, QSMSERIALNUMBER)
//设置qsm测试的耳朵部位
export const setQsmEarPart = (data) => getAction(data, QSMEARPART)
//设置QSM仪器所在端口号 
export const setQsmPart = (data) => getAction(data, QSMPART)

//设置QSM等待时间方式
export const setQsmTimeType = (data) => getAction(data, QSMTIMETYPE)












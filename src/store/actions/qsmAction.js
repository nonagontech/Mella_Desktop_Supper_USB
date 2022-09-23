

import {
    QSMCONNECTSTATUS
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










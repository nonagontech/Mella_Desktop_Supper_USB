import {
    QSMCONNECTSTATUS
} from '../actionTypes'

const initialState = {
    //qsm的连接状态，disconnected,connected
    qsmConnectStatus: 'disconnected'
}
export default function testReducer(state = initialState, action) {

    switch (action.type) {
        case QSMCONNECTSTATUS:
            return { ...state, qsmConnectStatus: action.data }
        default:
            return state;
    }
}
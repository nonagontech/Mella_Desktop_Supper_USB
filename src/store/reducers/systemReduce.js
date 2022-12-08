import {
    SYSTEMTYPE,
    ACTIVEINDEX
} from './../actionTypes/'
const initialState = {
    //系统的类型，分为：mac、windows
    systemType: 'windows',
    activeIndex: '1'
}

export default function systemReducer(state = initialState, action) {
    // console.log('state', state);

    switch (action.type) {
        case SYSTEMTYPE:
            return { ...state, systemType: action.data }
        case ACTIVEINDEX:
            return {...state, activeIndex: action.data}
        default:
            return state;
    }

}

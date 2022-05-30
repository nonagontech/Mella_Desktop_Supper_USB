

import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'

import './selectionBox.less'
import { px } from './../px'
import { stopBubble } from './../current'

import blackTriangle from './../../assets/img/blackTriangle.png'


const SelectionBox = ({ listArr, clickItem, clickitemBgc, clickItemColor, initSelectVale }) => {
    const [selectValue, setSelectValue] = useState('')
    const [mouseValue, setMouseValue] = useState('')
    const [showSelect, setShowSelect] = useState(false)
    // const [bacColor, setBacColor] = useState('#fff')
    // const [textColor, setTextColor] = useState('#000')

    useEffect(() => {
        console.log(listArr[0]);
        setSelectValue(listArr[0].value)
        setMouseValue(listArr[0].value)
        if (initSelectVale) {
            setSelectValue(initSelectVale)
        }
    }, [])

    const selection = () => {
        let option = listArr.map((item, index) => {
            let bacColor = item.value === selectValue ? clickitemBgc : item.value === mouseValue ? '#e7e7e7' : '#fff'
            let textColor = item.value === selectValue ? clickItemColor : '#000'


            // setBacColor(bacColor1)
            // setTextColor(textColor1)
            return <li
                key={item.key}
                style={{ paddingTop: px(5), paddingBottom: px(5), backgroundColor: bacColor, color: textColor }}
                onClick={() => {
                    setSelectValue(item.value)
                    setShowSelect(false)
                    clickItem(item)
                }}
                onMouseMove={() => {
                    console.log();
                    if (item.value !== selectValue) {
                        setMouseValue(item.value)
                    }
                }}
                onMouseLeave={() => {
                    if (item.value !== selectValue) {
                        // setBacColor('#fff')
                        setMouseValue('')
                    }
                }}
            >{item.value}</li>
        })
        return (
            <ul>
                {option}
            </ul>
        )


    }
    return (
        <div className='selectionbox'>

            <div className="select flex" style={{ height: px(26) }}>
                <div className="flex box" onClick={(e) => {
                    setShowSelect(true)
                    stopBubble(e)
                }}>
                    <p style={{ fontSize: px(16), }}>{selectValue}</p>
                    <img src={blackTriangle} alt="" style={{ height: '50%' }} />
                </div>

                {
                    showSelect &&
                    true &&
                    <div className="sortList" style={{ top: px(26), }}>
                        {selection()}
                    </div>
                }


            </div>

        </div>
    )

}
SelectionBox.propTypes = {
    listArr: PropTypes.array.isRequired,
    clickItem: PropTypes.func,
    clickitemBgc: PropTypes.string,
    clickItemColor: PropTypes.string,
    initSelectVale: PropTypes.string


}
SelectionBox.defaultProps = {
    clickitemBgc: '#e1206d',
    clickItemColor: '#fff',
    initSelectVale: '',
    clickItem: () => {

    }
}
export default SelectionBox
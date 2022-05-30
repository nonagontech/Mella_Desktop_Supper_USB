
import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import PropTypes from 'prop-types';

import './minClose.less'
import { px, mTop } from './../px'
import rMin_red from './../../assets/img/min-red.png'
import rClose_red from './../../assets/img/close-red.png'

import rMin_white from './../../assets/img/min-white.png'
import rClose_white from './../../assets/img/close-white.png'

let ipcRenderer = window.electron.ipcRenderer

/**
 * 
 * @param {string} minHeight 最小化、最大化方块的宽高 
 * @param {number} imgWidth 最小化、最大化图片的高度 
 * @returns  封装了最小化和关闭按钮，有鼠标移入、移出的动画
 */
const MinClose = ({ minHeight, imgWidth }) => {
  const [minbgc, setMinbgc] = useState('')
  const [rMin, setRMin] = useState(rMin_red)
  const [closebgc, setClosebgc] = useState('')
  const [rClose, setRClose] = useState(rClose_red)

  const minMouseEnter = () => {
    setMinbgc('rgba(70, 70, 70, 0.5)')
    setRMin(rMin_white)
  }
  const minMouseLeave = () => {
    setMinbgc('')
    setRMin(rMin_red)
  }
  const minClock = () => {
    setMinbgc('')
    setRMin(rMin_red)
    ipcRenderer.send('window-min')

  }


  const closeMouseEnter = () => {
    setClosebgc('rgba(232,17,35)')
    setRClose(rClose_white)
  }
  const closeMouseLeave = () => {
    setClosebgc('')
    setRClose(rClose_red)
  }
  const closeClock = () => {
    ipcRenderer.send('window-close')
  }


  return (
    <div
      id='minClose'
    >
      <div
        className='min_icon'
        onClick={minClock}
        style={{ backgroundColor: minbgc, height: minHeight, width: minHeight }}
        onMouseEnter={minMouseEnter}
        onMouseLeave={minMouseLeave}
      >
        <img src={rMin} alt="" style={{ width: imgWidth }} />
      </div>
      <div
        className='min_icon'
        onClick={closeClock}
        style={{ backgroundColor: closebgc, height: minHeight, width: minHeight }}
        onMouseEnter={closeMouseEnter}
        onMouseLeave={closeMouseLeave}
      >
        <img src={rClose} alt="" style={{ width: imgWidth }} />
      </div>
    </div>
  )
}

MinClose.propTypes = {
  minHeight: PropTypes.string,
  imgWidth: PropTypes.number,
}
MinClose.defaultProps = {
  minHeight: '40px',
  imgWidth: `${px(20)}px`

}

export default MinClose
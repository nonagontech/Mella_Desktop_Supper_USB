
import React, { useState, useEffect } from 'react'
import { useHistory } from "react-router-dom";

import PropTypes from 'prop-types';

import './minClose.less'
import { px, mTop } from './../px'
import rMin_red from './../../assets/img/min-red.png'
import rClose_red from './../../assets/img/close-red.png'

import rMin_white from './../../assets/img/min-white.png'
import rClose_white from './../../assets/img/close-white.png'
import { connect } from 'react-redux';

let ipcRenderer = window.electron.ipcRenderer

/**
 *
 * @param {string} minHeight 最小化、最大化方块的宽高
 * @param {number} imgWidth 最小化、最大化图片的高度
 * @returns  封装了最小化和关闭按钮，有鼠标移入、移出的动画
 */
const MinClose = ({ minHeight, imgWidth, systemType }) => {
  const [minbgc, setMinbgc] = useState('')
  const [rMin, setRMin] = useState(rMin_red)
  const [closebgc, setClosebgc] = useState('')
  const [rClose, setRClose] = useState(rClose_red)

  const [closeText, setCloseText] = useState('')
  const [minText, setMinText] = useState('')

  const minMouseEnter = () => {
    setMinbgc('rgba(70, 70, 70, 0.5)')
    setRMin(rMin_white)
    setMinText('-')
    setCloseText('x')
  }
  const minMouseLeave = () => {
    setMinbgc('')
    setRMin(rMin_red)
    setMinText('')
    setCloseText('')
  }
  const minClock = () => {
    setMinbgc('')
    setRMin(rMin_red)
    ipcRenderer.send('window-min')

  }


  const closeMouseEnter = () => {
    setClosebgc('rgba(232,17,35)')
    setRClose(rClose_white)
    setMinText('-')
    setCloseText('x')
  }
  const closeMouseLeave = () => {
    setClosebgc('')
    setRClose(rClose_red)
    setMinText('')
    setCloseText('')
  }
  const closeClock = () => {
    ipcRenderer.send('window-close')
  }
  // console.log('systemType', systemType);

  const body = () => {
    if (systemType === 'mac') {
      return (
        <>
          <div
            className='macStyle'
            // style={{ marginLeft: '21px' }}
            onClick={closeClock}
            onMouseEnter={closeMouseEnter}
            onMouseLeave={closeMouseLeave}
          >
            <div className='mactext'>{closeText} </div>
          </div>

          <div
            className='macStyle'
            onClick={minClock}
            style={{ backgroundColor: 'rgb(254,180,41' }}
            onMouseEnter={minMouseEnter}
            onMouseLeave={minMouseLeave}
          >
            <div className='mactext'>{minText} </div>
          </div>
        </>
      )
    } else {
      return (
        <>
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
        </>
      )
    }
  }

  return (
    <div id='minClose' >
      {body()}
    </div>
  )
}

MinClose.propTypes = {
  minHeight: PropTypes.string,
  imgWidth: PropTypes.string,
}
MinClose.defaultProps = {
  minHeight: '40px',
  imgWidth: `${px(20)}px`

}

export default connect(
  (state) => ({
    systemType: state.systemReduce.systemType
  })
)(MinClose)


import React, { useState, useEffect } from 'react'


import PropTypes from 'prop-types';

import { px, mTop } from './../px'
import './mouseDiv.less'

/**
 * 
 * @param {string} minHeight 最小化、最大化方块的宽高 
 * @param {number} imgWidth 最小化、最大化图片的高度 
 * @returns  封装了最小化和关闭按钮，有鼠标移入、移出的动画
 */
const MinClose = ({ minHeight, beforeDiv, afterDiv, divClick }) => {
  const [minbgc, setMinbgc] = useState('')
  const [rMin, setRMin] = useState(beforeDiv)

  const minMouseEnter = () => {
    setMinbgc('rgba(70, 70, 70, 0.5)')
    setRMin(afterDiv)
  }
  const minMouseLeave = () => {
    setMinbgc('')
    setRMin(beforeDiv)
  }
  const minClock = () => {
    setMinbgc('')
    setRMin(beforeDiv)
    divClick()

  }




  return (
    <div id='mouseDiv'>
      <div
        className='min_icon'
        onClick={minClock}
        style={{ backgroundColor: minbgc, height: minHeight, width: minHeight }}
        onMouseEnter={minMouseEnter}
        onMouseLeave={minMouseLeave}
      >
        {rMin}
      </div>

    </div>
  )
}

MinClose.propTypes = {
  minHeight: PropTypes.string,
  imgWidth: PropTypes.number,
  divClick: PropTypes.func,
  afterDiv: PropTypes.func,
  beforeDiv: PropTypes.func,


}
MinClose.defaultProps = {
  minHeight: '40px',
  imgWidth: px(20)

}

export default MinClose
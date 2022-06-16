import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import { SyncOutlined, createFromIconfontCN } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import { px, mTop } from './../../utils/px'
import cir from './../../assets/images/cir.png'
import xia from './../../assets/img/xia.png'

//import 'antd/dist/antd.css';
import './biggie.less'

/**
 * 
 * @param {string} weight   体重值
 * @param {string} bodyFat   体脂
 * @param {string} score   健康指数
 * @param {string} impedance   阻抗值
 * @param {boolean} issave   按钮文本，为true展示save，为false展示send to pms
 * @param {function} onPress   点击按钮调用的函数
 * 
 * @returns 
 */

const Biggie = ({ weight, bodyFat, score, impedance, issave, onPress, discardOnPress, isIbs }) => {

  // let { weight, bodyFat, score } = this.props

  let lTColor = bodyFat !== null && bodyFat >= 0 ? '#87C563' : '#D8D9D9'
  let rTColor = score !== null && score >= 0 ? '#87C563' : '#D8D9D9'
  let lTtext = bodyFat !== null && bodyFat >= 0 ? `${bodyFat}%` : `Not Available`
  let lTtextSize = bodyFat !== null && bodyFat >= 0 ? px(16) : px(15)
  let rTtext = score !== null && score >= 0 ? `${score}` : `Not\nAvailable`
  let rTtextSize = score !== null && score >= 0 ? px(16) : px(15)

  return (
    <div className="biggie" >
      <div className="top">

        <div style={{ marginTop: px(150), height: px(160), borderRadius: px(150) }} className='biggiel'>
          <div style={{ backgroundColor: lTColor, borderRadius: px(75), }} className='lT'>
            <div className='lTText' style={{ fontSize: lTtextSize }}>{lTtext}</div>
          </div>
          <div style={{ fontSize: px(14) }}>{`Body Fat\nPercent`}</div>
          <img
            src={xia}
            style={{ width: px(20), marginBottom: px(5) }}
          />
        </div>


        <div style={{ height: px(240), borderRadius: px(150), marginBottom: px(50) }} className='cen'>
          <div style={{ borderRadius: px(75) }} className='lT'>
            <img
              src={cir}
              width={'100%'}
            />
          </div>
          <div className='cTText' style={{ top: px(45), fontSize: px(32), fontWeight: '800' }}>{weight}</div>
          <div style={{ top: px(95), fontSize: px(25) }} className='cTText'>{`${isIbs ? 'lbs' : 'kgs'}`}</div>
          <div className='cenCText' style={{ fontSize: px(24) }}>Weight</div>
          <img
            src={xia}
            style={{ width: px(20), marginBottom: px(6) }}
          />
        </div>



        <div style={{ marginTop: px(150), height: px(160), borderRadius: px(150) }} className='biggiel'>
          <div style={{ backgroundColor: rTColor, borderRadius: px(75) }} className='lT'>
            <div className='lTText' style={{ fontSize: rTtextSize }}>{rTtext}</div>
          </div>
          <div style={{ fontSize: px(14) }}>{`Body\nCondition\nScore`}</div>
          <img
            src={xia}
            style={{ width: px(20), marginBottom: px(5) }}
          />
        </div>
      </div>




      <div className='biggiefoot' style={{ marginTop: px(10), }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
          <div
            className='biggiefootbtn'
            style={{ height: px(36), }}
            onClick={() => {
              discardOnPress()
            }}
          >
            <div style={{ color: '#fff', fontSize: px(16) }}>{`Discard`}</div>
          </div>


          <div
            className='biggiefootbtn'
            style={{ height: px(36), }}
            onClick={() => {
              onPress()
            }}
          >
            <div style={{ color: '#fff', fontSize: px(16) }}>{issave ? `Save` : `Send to PMS`}</div>
          </div>


        </div>


        {(impedance && impedance > 0) ? <div style={{ color: '#000', fontSize: px(18), marginTop: mTop(10) }}>{`Impedance ${impedance} Ohms`}</div> : null}
      </div>
    </div>
  )

}

Biggie.propTypes = {
  weight: PropTypes.string || PropTypes.number,
  bodyFat: PropTypes.number || PropTypes.string,
  score: PropTypes.number || PropTypes.string,
  impedance: PropTypes.number || PropTypes.string,
  issave: PropTypes.bool,
  onPress: PropTypes.func,
  isIbs: PropTypes.bool
}
export default Biggie
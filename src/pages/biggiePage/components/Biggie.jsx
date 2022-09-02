import React, { } from 'react'
import PropTypes from 'prop-types';
import { px, mTop } from '../../../utils/px'
import cir from '../../../assets/images/cir.png'
import xia from '../../../assets/img/xia.png'
import './biggie.less'
/**
 *
 * @param {string} weight   体重值
 * @param {string} bodyFat   体脂
 * @param {string} score   健康指数
 * @param {string} impedance   阻抗值
 * @param {boolean} issave   按钮文本，为true展示save，为false展示send to pms
 * @param {function} onPress   点击按钮调用的函数
 * @returns
 */
const Biggie = ({ weight, bodyFat, score, impedance, issave, onPress, discardOnPress, isIbs, isHaveSaveBtn = true }) => {
  let lTColor = bodyFat !== null && bodyFat >= 0 ? '#87C563' : '#D8D9D9'
  let rTColor = score !== null && score >= 0 ? '#87C563' : '#D8D9D9'
  let lTtext = bodyFat !== null && bodyFat >= 0 ? `${bodyFat}%` : `Not Available`
  let lTtextSize = bodyFat !== null && bodyFat >= 0 ? px(16) : px(15)
  let rTtext = score !== null && score >= 0 ? `${score}` : `Not\nAvailable`
  let rTtextSize = score !== null && score >= 0 ? px(16) : px(15)

  return (
    <div className="biggie" >
      <div className="top">

        <div style={{ borderRadius: px(150) }} className='biggiel'>
          <div style={{ backgroundColor: lTColor, borderRadius: px(75), }} className='lT'>
            <div className='lTText' style={{ fontSize: lTtextSize }}>{lTtext}</div>
          </div>
          <div style={{ fontSize: px(14) }}>{`Body Fat\nPercent`}</div>
          <img
            src={xia}
            style={{ width: px(20), marginBottom: px(5) }}
          />
        </div>
        <div style={{ borderRadius: px(150) }} className='cen'>
          <div style={{ borderRadius: px(75) }} className='lT'>
            <img
              src={cir}
              width={'100%'}
            />
          </div>
          <div className='cTText' style={{ fontWeight: '800' }}>{weight}</div>
          <div className='cTTextUnit'>{`${isIbs ? 'lbs' : 'kgs'}`}</div>
          <div className='cenCText'>Weight</div>
          <img
            src={xia}
            style={{ width: px(20), marginBottom: px(6) }}
          />
        </div>
        <div style={{ borderRadius: px(150) }} className='biggiel'>
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
      <div className='biggiefoot'>
        {isHaveSaveBtn &&
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around', width: '100%' }}>
            <div
              className='biggiefootbtn'
              onClick={() => {
                discardOnPress()
              }}
            >
              <div style={{ color: '#fff', fontSize: px(16) }}>{`Discard`}</div>
            </div>
            <div
              className='biggiefootbtn'
              onClick={() => {
                onPress()
              }}
            >
              <div style={{ color: '#fff', fontSize: px(16) }}>{issave ? `Save` : `Send to PMS`}</div>
            </div>
          </div>
        }
        <div style={{ color: '#000', fontSize: px(18), marginTop: mTop(10), height: '28px' }}>{(impedance && impedance > 0) ? `Impedance ${impedance} Ohms` : ''}</div>
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

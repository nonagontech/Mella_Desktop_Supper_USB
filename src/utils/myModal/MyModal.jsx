
/**
 * 
 * @param {boolean} visible 控制modal框是否显示
 * @param {element} element 自定义modal框里面的内容，默认是组件是加载中。。。
 * @returns {element} 这是自己写的一个modal框
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { LoadingOutlined } from '@ant-design/icons';
import './myModal.less'
import { px, pX, MTop, mTop } from '../px'

class MyModal extends Component {

  render () {
    let { visible, element, text } = this.props
    // console.log('---上层组件传来的值---', this.props);

    if (visible) {
      let body = element ? element :
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div className="loadIcon" style={{ marginBottom: MTop(5) }}>
            <LoadingOutlined style={{ fontSize: 30, color: '#fff', marginTop: mTop(-30), }} />
          </div>
          <p>
            {text ? text : 'loading...'}
          </p>
        </div>
      return (
        <div className="myModal">
          {body}
        </div>
      )
    } else {
      return (null)
    }

  }
}

MyModal.propTypes = {
  visible: PropTypes.bool,
  element: PropTypes.element,
  text: PropTypes.string

}
MyModal.defaultProps = {
  visible: false,
  text: 'loading...'
}

export default MyModal
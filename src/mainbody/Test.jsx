import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jianNUm, addNum, changeTitle } from '../store/actions'


class Test extends Component {

  jian = () => {
    console.log('点击了', this.propsstate);
    this.props.jianNUm()
  }
  add = () => {
    this.props.addNum()
  }
  changeTitle = () => {
    this.props.changeTitle('---------')
  }
  changeTitle1 = () => {
    this.props.changeTitle('-894846-')
  }


  render () {
    console.log('初始化', this.props.state);
    return (
      <div style={{ backgroundColor: 'red' }}>
        <div>{`num的值为：${this.props.conunt}`}</div>
        <div onClick={this.add}>加</div>
        <div onClick={this.jian}>减</div>
        <div onClick={this.changeTitle}>改标题</div>

        <div onClick={this.changeTitle1}>改标题</div>
      </div>

    )
  }
}

export default connect(
  state => ({ conunt: state.login.conunt, state }),
  { jianNUm, addNum, changeTitle }
)(Test)
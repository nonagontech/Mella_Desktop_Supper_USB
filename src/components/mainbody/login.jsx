import React, { Component } from 'react'
import { connect } from 'react-redux'
import { jianNUm, addNum, changeTitle } from './../store/actions'


class Login extends Component {

  add = () => {
    console.log('点击了', this.propsstate);
    this.props.jianNUm()
  }


  render () {
    console.log('初始化', this.props.state);
    return (
      <div style={{ backgroundColor: 'hotpink' }}>
        <div>{`num的值为：${this.props.conunt}`}</div>
        <div>加</div>
        <div onClick={this.add}>减</div>
        <div>{`111：${this.props.title}`}</div>
      </div>

    )
  }
}

export default connect(
  state => ({ conunt: state.login.conunt, title: state.login.title }),
  { jianNUm }
)(Login)
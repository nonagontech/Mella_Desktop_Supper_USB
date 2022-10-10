import React, {
} from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import './numericInput.less'
import { useEffect } from 'react';

const NumericInput = (props) => {
  const { value, onChange, getinput, onClick, onKey, index, ChangeSize = '' } = props;
  //输入框输入
  const handleChange = (e) => {
    const { value: inputValue } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;

    if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
      onChange(inputValue);
    }
  }
  //失去焦点
  const handleBlur = () => {
    let valueTemp = value;
    if (`${value}`.charAt(`${value}`.length - 1) === '.' || value === '-') {
      valueTemp = value.slice(0, -1);
    }
    onChange(`${valueTemp}`.replace(/0*(\d+)/, '$1'));
  };
  //输入框点击事件
  const handleClick = () => {
    onClick();
  }
  //修改样式
  let bordercolor = onKey === index ? '#e1206d' : '#d9d9d9';


  return (
    <Input
      {...props}
      className='inputNum'
      onChange={handleChange}
      onBlur={handleBlur}
      maxLength={25}
      ref={getinput}
      onClick={handleClick}
      style={{ borderColor: bordercolor, textAlign: "center", fontSize: ChangeSize }}
    />
  );

};

export default NumericInput;

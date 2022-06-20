import React, {
} from 'react';
import { Input } from 'antd';
import _ from 'lodash';
import './numericInput.less'

const NumericInput = (props) => {
    const { value, onChange, getInput ,key} = props;
    //输入框输入
    const handleChange = (e) => {
        const { value: inputValue } = e.target;
        const reg = /^-?\d*(\.\d*)?$/;

        if (reg.test(inputValue) || inputValue === '' || inputValue === '-') {
            onChange(inputValue);
        }
    }

    const handleBlur = () => {
        let valueTemp = value;
        if (`${value}`.charAt(`${value}`.length - 1) === '.' || value === '-') {
            valueTemp = value.slice(0, -1);
        }
        onChange(`${valueTemp}`.replace(/0*(\d+)/, '$1'));
    };

    return (
        <Input
            {...props}
            className='inputNum'
            onChange={handleChange}
            onBlur={handleBlur}
            maxLength={25}
            ref={getInput}
            onClick={console.log('点击了输入框')}
            key={key}
        />
    );

};

export default NumericInput;

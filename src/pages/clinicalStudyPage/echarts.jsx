import React, { Component } from 'react'
import ReactECharts from "echarts-for-react";
import { px } from '../../utils/px';

export default class Echarts extends Component {

    render() {
        return (

            <ReactECharts
                option={this.props.option}
                theme="Imooc"
                style={{ height: px(400), width: px(500) }}
                notMerge={true}
                lazyUpdate={true}
                //   ref={echartsElement}
                className={"charts"}
            />

        )
    }
}
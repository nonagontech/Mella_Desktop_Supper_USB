import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import Animation from './../../../assets/img/Animation.png';
import caught from './../../../assets/img/caught.png';
import './measurement.less';

const Measurement = () => {
    const [percent, setPercent] = useState(0);
    const decline = () => {
        let newPercent = percent + 10;
        if (newPercent > 100) {
            newPercent = 100;
        }
        setPercent(newPercent);
    }
    return (
        <div className='measurementBox'>
            <Progress type="dashboard" percent={percent} gapDegree={30} width={'260px'} strokeWidth={'8'} format={percent => `${percent} ℉`} />
            <Button onClick={decline} icon={<PlusOutlined />} />
            {
                percent === 0 ? (<img src={Animation} />) : (<img src={caught} />)
            }

        </div>
    );
};

export default Measurement;
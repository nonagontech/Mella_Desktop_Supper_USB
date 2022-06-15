import React, {
    useEffect,
    useState,
} from 'react';
import { Button, Progress, Space, Table, Tag, Badge } from 'antd';
import measuredTable_1 from './../../../assets/img/measuredTable_1.png';
import measuredTable_2 from './../../../assets/img/measuredTable_2.png';
import measuredTable_3 from './../../../assets/img/measuredTable_3.png';
import EditCircle from './../../../assets/img/EditCircle.png';
import Delete from './../../../assets/img/Delete.png';
import _ from 'lodash';
import './measuredData.less';

const { Column, ColumnGroup } = Table;
const data = [
    {
        key: '1',
        dat: 'Nov 26',
        tim: '09:05 AM',
        temp: '101.2℉',
        placeme: 0,
        note: ['nice', 'developer'],
    },
    {
        key: '2',
        dat: 'Nov 22',
        tim: '10:35 AM',
        temp: '99.2℉',
        placeme: 1,
        note: ['nice', 'developer'],
    },
    {
        key: '3',
        dat: '06:05 PM',
        tim: 'Brown',
        temp: '104.2℉',
        placeme: 2,
        note: ['nice', 'developer'],
    },
];

const MeasuredData = () => {
    const [percent, setPercent] = useState(91.2);
    return (
        <div className='measurementBox'>
            <Progress
                type="dashboard"
                percent={percent}
                gapDegree={30}
                width={'260px'}
                strokeWidth={'8'}
                format={percent => `${percent} ℉`}
                strokeColor={{
                    '0%': '#7bd163',
                    '100%': '#19ade4',
                }}
            />
            <div className='listTitleBox'>
                <p className='listTitle'>History</p>
            </div>
            <Table dataSource={data} className='measuredTable'>
                <Column title="Dat" dataIndex="dat" key="dat" />
                <Column title="Tim" dataIndex="tim" key="tim" />
                <Column title="Temp" dataIndex="temp" key="temp"
                    render={(tags) => (
                        <>
                            <Badge color="#87d068" text={tags} />
                        </>
                    )}
                />
                <Column title="Placeme" dataIndex="placeme" key="placeme"
                    render={(tags) => {
                        if (tags === 0) {
                            return <img src={measuredTable_1} />
                        } else if (tags === 1) {
                            return <img src={measuredTable_2} />
                        } else {
                            return <img src={measuredTable_3} />
                        }
                    }}
                />
                <Column title="Note" dataIndex="note" key="note"
                    render={(tags) => (
                        _.map(tags, (item) => {
                            return (
                                _.isEqual(item, 'nice') ? (<img className='operationIcon' src={EditCircle} />) : (<img src={Delete} />)
                            );
                        })
                    )}
                />
            </Table>
        </div>
    );
};

export default MeasuredData;
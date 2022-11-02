import React, { useState, useEffect } from 'react';
import { ConfigProvider, Table, Select, message } from 'antd';

import { mTop, px, MTop, pX } from '../../utils/px';
import { getPetByPetNameOrPatientId } from '../../api';

import { petDetailInfoFun, setMenuNum, } from '../../store/actions';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import moment from 'moment';

import './petTable.less';


let storage = window.localStorage;
const PetTable = ({ petListArr, loading, bodyHeight, petDetailInfoFun, setMenuNum, resetPetList, type, onScroll }) => {
  let history = useHistory()
  const [heardSearchText, setHeardSearchText] = useState('')
  //搜索后展示的宠物列表
  const [searchData, setSearchData] = useState([]);
  const columns = [
    {
      title: 'Time',
      dataIndex: 'insertedAt',
      key: 'insertedAt',
      ellipsis: true,
      align: "center",
      render: (text, record, index) => moment(parseInt(text) * 1000).format('YYYY-MM-DD hh:mm a'),

    },
    {
      title: 'Pet ID',
      dataIndex: 'patientId',
      key: 'patientId',
      ellipsis: true,
      align: "center",
    },
    {
      title: 'Pet Name',
      dataIndex: 'petName',
      key: 'petName',
      ellipsis: true,
      align: "center",
    },
    {
      title: 'Owner',
      dataIndex: 'owner',
      key: 'owner',
      ellipsis: true,
      align: "center",
    },
    {
      title: 'Breed',
      dataIndex: 'breed',
      key: 'breed',
      ellipsis: true,
      align: "center",
      render: (text, record, index) => {
        if (!text || text === 'defaultdog' || text === 'defaultother' || text === 'defaultcat') {
          return (
            'unknown'
          )
        } else {
          return (
            text
          )
        }

      }
    },

    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      ellipsis: true,
      align: "center",
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      ellipsis: true,
      align: "center",
      render: (text, record, index) => {
        if (`${text}` === 'NaN') {
          return (
            'unknown'
          )
        } else {
          return (
            text
          )
        }

      }
    },


  ];
  //搜索宠物
  const _search = (value) => {
    //去除前后空格
    let search = value.replace(/(^\s*)|(\s*$)/g, "");
    let params = {
      searchValue: search,
    }
    if (storage.lastOrganization) {
      params.orgId = storage.lastOrganization
    }
    getPetByPetNameOrPatientId(storage.userId, params)
      .then((res) => {
        if (res.msg === 'success') {
          setSearchData(res.success);
        } else {
          message.warning('system error');
        }
      })
      .catch((err) => {
        message.warning('system error');
      })
  }
  const noData = () => {
    return (
      <div className='flex nodata' style={{ paddingTop: px(60), paddingBottom: px(60) }}>
        <p style={{ fontSize: px(22) }}> {`No Pets Scheduled &`}</p>  &nbsp;&nbsp;
        <a style={{ fontSize: px(22) }} href="#"
          onClick={(e) => {
            try {
              if (type === 'scheduled') {
                setMenuNum('AddScheduledPet')
              } else {
                setMenuNum('AddPet')
              }
            } catch (error) {
              console.log('错误信息', error);
            }
            e.preventDefault();

          }}

        >{`Schedule a Pet`}</a>
      </div>
    )
  }
  const options = [
    { key: 'time', value: 'Time' },
    { key: 'petid', value: 'Pet ID' },
    { key: 'owner', value: 'Owner' },
    { key: 'breed', value: 'Breed' },
    { key: 'petname', value: 'Pet Name' },
    { key: 'gender', value: 'Gender' },
  ]
  const handleChange = (value, option) => {
    let petList = [].concat(petListArr)
    switch (option.key) {
      case 'time':
        petList.sort((a, b) => { return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1 })
        break;
      case 'petid':
        petList.sort((a, b) => { return a.patientId >= b.patientId ? 1 : -1 })
        break;
      case 'owner':
        petList.sort((a, b) => { return a.owner >= b.owner ? 1 : -1 })
        break;
      case 'breed':
        petList.sort((a, b) => { return a.breed >= b.breed ? 1 : -1 })
        break;
      case 'petname':
        petList.sort((a, b) => { return a.petName >= b.petName ? 1 : -1 })
        break;
      case 'gender':
        petList.sort((a, b) => { return a.gender >= b.gender ? 1 : -1 })
        break;
    }
    resetPetList(petList)
  };
  //滚动监听
  const onScrollCapture = () => {
    // 滚动的容器
    let tableEleNodes = document.querySelectorAll(`.table .ant-table-body`)[0];
    //是否滚动到底部
    let bottomType = Math.round(tableEleNodes?.scrollTop) + tableEleNodes?.clientHeight === tableEleNodes?.scrollHeight;
    if (bottomType) {
      onScroll();
    }
  }
  return (
    <div className='petTable' >
      <div className="pet_table_heard">
        <div className="search" style={{ height: px(32) }}>
          <input
            type="text"
            placeholder="&#xe61b;    search"
            value={heardSearchText}
            onChange={(e) => {
              setHeardSearchText(e.target.value);
              _search(e.target.value);
            }
            }
          />
        </div>

        <div className="walkBtn1" style={{ marginRight: px(28) }}>
          <div
            className="walkbtnBox"
            style={{ height: px(28), width: px(80) }}
            onClick={_search}
          >
            <div className="walkText">Search</div>
          </div>
        </div>

      </div>
      <div className="heard2 flex" style={{ marginBottom: px(8), marginLeft: px(20) }}>
        <div className="sort flex" >
          <p style={{ fontSize: px(16), marginRight: px(10) }}>Sort By:</p>
          <Select
            defaultValue={['Time']}
            onChange={handleChange}
            options={options}
            className="selectFilter"
          />
        </div>
      </div>
      <div className="table" onScrollCapture={onScrollCapture}>
        <ConfigProvider renderEmpty={noData}>
          <Table
            style={{
              padding: 0,
              margin: 0,
              width: '95%',
            }}
            rowKey={data => data.id}
            bordered={false}
            columns={columns}
            dataSource={(heardSearchText.length === 0) ? petListArr : searchData}
            loading={loading}
            pagination={false}
            scroll={{
              // y: px(480),
              y: '80 %'
            }}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  setMenuNum('1')
                  petDetailInfoFun(record)
                }, // 点击行
              };
            }}
            className="allPetTable"
          />
        </ConfigProvider>
      </div>
    </div >
  )
}

PetTable.propTypes = {
  petListArr: PropTypes.array,
  resetPetList: PropTypes.func,
}
//默认值
PetTable.defaultProps = {
  bodyHeight: 0,
  petListArr: [],
  test: () => { },
  resetPetList: () => { },
}
export default connect(
  state => ({

  }),
  { petDetailInfoFun, setMenuNum, }
)(PetTable)

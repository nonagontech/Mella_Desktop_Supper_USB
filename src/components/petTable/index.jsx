import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { ConfigProvider, Table, Select } from 'antd';
import { useHistory } from 'react-router-dom'
import moment from 'moment'
import { mTop, px, MTop, pX } from '../../utils/px';
import './petTable.less'
import { petDetailInfoFun, setMenuNum, } from '../../store/actions';
import SelectionBox from '../../utils/selectionBox/SelectionBox'

const PetTable = ({ petListArr, loading, bodyHeight, petDetailInfoFun, setMenuNum, resetPetList, type }) => {
  let history = useHistory()
  const [heardSearchText, setHeardSearchText] = useState('')
  //搜索后展示的宠物列表
  const [searchData, setSearchData] = useState([])
  const _search = (value) => {       //这个是搜索功能 ，怎么展示列表的内容进行搜索
    let keyWord = value || heardSearchText
    /**
     * 使用indexof方法实现模糊查询
     *     语法：stringObject.indexOf(searchvalue, fromindex)
     *   参数：searchvalue 必需。规定需检索的字符串值。 fromindex 可选的整数参数。规定在字符串中开始检索的位置。它的合法取值是 0 到 stringObject.length - 1。如省略该参数，则将从字符串的首字符开始检索。
     *    说明：该方法将从头到尾地检索字符串 stringObject，看它是否含有子串 searchvalue。开始检索的位置在字符串的 fromindex 处或字符串的开头（没有指定 fromindex 时）。如果找到一个 searchvalue，则返回 searchvalue 的第一次出现的位置。stringObject 中的字符位置是从 0 开始的。如果没有找到，将返回 -1。
     *
     * list         原数组
     * keyWord      查询关键词
     * searchData   查询的结果
     *
     * toLowerCase（）方法：将字符串统一转成小写
     * toUpperCase（）方法：将字符串统一转成大写
     *
     */
    let list = petListArr
    let searchData = []
    for (let i = 0; i < list.length; i++) {
      let petName = list[i].petName.toLowerCase() || ''
      let patientId = list[i].patientId.toLowerCase() || ''
      let rfid = list[i].rfid || ''
      if (`${petName}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${patientId}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${rfid}`.indexOf(keyWord) !== -1
      ) {
        searchData.push(list[i])
      }
    }
    setSearchData(searchData)
  }
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
  const handleChange = (value,option) => {
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
  return (
    <div className='petTable' >
      <div className="pet_table_heard">
        <div className="search" style={{ height: px(32) }}>
          <input
            type="text"
            placeholder="&#xe61b;    search"
            value={heardSearchText}
            onChange={(e) => {
              setHeardSearchText(e.target.value)
              _search(e.target.value)
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
          {/* <SelectionBox
            listArr={[
              { key: 'time', value: 'Time' },
              { key: 'petid', value: 'Pet ID' },
              { key: 'owner', value: 'Owner' },
              { key: 'breed', value: 'Breed' },
              { key: 'petname', value: 'Pet Name' },
              { key: 'gender', value: 'Gender' },
            ]}
            clickItem={(item) => {
              let petList = [].concat(petListArr)
              switch (item.key) {
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
            }}
          /> */}
          <Select
            defaultValue={['Time']}
            onChange={handleChange}
            options={options}
            className="selectFilter"
          />
        </div>
      </div>
      <div className="table" >
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
  resetPetList: () => { },
}
export default connect(
  state => ({

  }),
  { petDetailInfoFun, setMenuNum, }
)(PetTable)

////这是普通用户的选择界面，后期集成时候别忘了identity，进入测量界面的身份，是vetspire、ezyvet、普通医生
import React, { Component } from 'react'
import {
  Table,
  Input,
  Button,
  Space,
  message,
  Menu,
  Modal,
  ConfigProvider
} from 'antd';
import { SyncOutlined, createFromIconfontCN,SearchOutlined } from '@ant-design/icons';

import jinggao from '../../assets/img/jinggao.png'
import redclose from '../../assets/img/redclose.png'

import Button1 from '../../utils/button/Button'
import Heard from '../../utils/heard/Heard'
import { fetchRequest } from '../../utils/FetchUtil1'
import temporaryStorage from '../../utils/temporaryStorage';
import { pX, px, win } from '../../utils/px';
import { fetchRequest4 } from '../../utils/FetchUtil4';
import { fetchRhapsody } from '../../utils/FetchUtil5';
import SelectionBox from '../../utils/selectionBox/SelectionBox'
import electronStore from '../../utils/electronStore';

import moment from 'moment';
import Draggable from "react-draggable";
import Highlighter from 'react-highlight-words';

import './index.less';

const { SubMenu } = Menu;
const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js'
})
let storage = window.localStorage;



export default class DoctorSelecScheduledtExam extends Component {
  state = {
    loading: false,
    api: '',
    id: '',  //选择location的id
    locations: [],
    data: [],
    searchData: [],
    searchText: '',
    searchedColumn: '',
    seleceID: '',  //宠物医生id
    spin: false,   //刷新按钮是否旋转
    unixToURI: '',
    ezyVetToken: '',
    current: 1,
    closebgc: '',
    minbgc: '',
    closeColor: '',
    heardSearchText: '',

    isNotFound: true,
    modalVis: false,

    disabled: true,       //model是否可拖拽
    bounds: { left: 0, top: 0, bottom: 0, right: 0 },

    sortBy: 'Time',
    showsortBy: false
  }
  componentWillMount () {
    // console.log('------------', this.props.location.listDate);
    try {
      if ((this.props.location.listDate && this.props.location.listDate !== 'undefined')) {
        // console.log('------------', this.props.location);
        let data = JSON.parse(this.props.location.listDate)
        this.setState({
          data,
        })
      }
    } catch (error) {
      console.log(error);
    }
  }

  componentDidMount () {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    console.log(windowsHeight, height, width);
    if (windowsHeight < 900) {
      ipcRenderer.send('table', win())
    } else {
      ipcRenderer.send('big', win())
    }
    // ipcRenderer.send('big')
    message.destroy()



    storage.identity = '3'

    if ((this.props.location.listDate && this.props.location.listDate !== 'undefined')) {
      let data = JSON.parse(this.props.location.listDate)
      this.setState({
        data,
      })
    } else {
      this.setState({
        loading: true,
      })
    }
    this._getExam()
    temporaryStorage.logupVetInfo = {}
    temporaryStorage.logupSelectOrganization = {}
    temporaryStorage.logupSuccessData = {}
    temporaryStorage.logupOrganization = {}
    temporaryStorage.logupEmailCode = ''

    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)


    let items = document.querySelectorAll('#doctorSelectExam .ant-table-thead .ant-table-cell')
    for (let i = 0; i < items.length; i++) {
      let style = items[i].style
      style.padding = "5px 5px"
      style.textAlign = 'center'


    }

  }
  componentWillUnmount () {
    message.destroy()
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    console.log(windowsHeight, height, width);
    if (windowsHeight < 900) {
      ipcRenderer.send('table', win())
    } else {
      ipcRenderer.send('big', win())
    }
    this.setState({

    })
  }

  rhapsody = async (patientsArr) => {

    // console.log(patientsArr);
    let dataArr = []
    try {
      for (let i = 0; i < patientsArr.length; i++) {
        let params = { query: `query { patient (id:"${patientsArr[i].patientId}") {  vitals { data{ id, weight{value}, createdAt, updatedAt}}}}` }
        let item = await fetchRhapsody('', 'POST', params, storage.connectionKey)
        if (item.data) {

          let { vitals } = item.data.patient
          let vitalData = vitals.data
          console.log('-----------', vitalData);
          let weight = ''
          if (vitalData.length > 0) {
            vitalData.sort((a, b) => {
              return moment(parseInt(a.createdAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.createdAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
            })
            if (vitalData[0].weight && vitalData[0].weight.value) {
              patientsArr[i].weight = (vitalData[0].weight.value * 0.45).toFixed(1)
            }
          }

        }

      }
      console.log(patientsArr);
      patientsArr.sort((a, b) => {
        return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
      })
      this.setState({
        data: patientsArr,
        loading: false
      })

      electronStore.set('doctorExam', patientsArr)
    } catch (error) {
      this.setState({
        loading: false,
      })
      message.destroy()
      message.error('Medical record acquisition failed')
    }


  }

  _getExam = async () => {
    console.log('进来了');





    //现在Rhapsody组织数据还没有集成到后台，因此这里就先做临时处理
    if (storage.lastOrganization === '34') {

      console.log(storage.connectionKey);
      //1.获取用户id

      let params = { query: `query { business { id, name, state } }` }
      fetchRhapsody('', 'POST', params, storage.connectionKey)

        .then(res => {
          console.log('---', res);
          if (res.errors) {
            this.setState({
              loading: false,
              spin: false
            })
            message.destroy()
            message.error('Data acquisition failed')

          } else {
            console.log('获取到了businessId');
            let businessId = res.data.business.id
            // let param = {
            //   query: `query  { patients (businessId:"${businessId}") { data{ id, clientId, name,gender, dateOfBirth
            //   species{id,name},
            //   breeds{id,name},
            //   createdAt,owners{owner{firstName,lastName} }}}` }
            let param = {
              query: `query {
                patients (businessId:"${businessId}") {
                    data{
                         id,
                         clientId,
                         businessId,
                         name
                         gender,
                         dateOfBirth,
                         species{id,name},
                         breeds{id,name},
                         createdAt ,
                         owners{owner{firstName,lastName}}
                    }
                }
            }`
            }

            console.log('获取病历单的入参', param, JSON.stringify(param));
            fetchRhapsody('', 'POST', param, storage.connectionKey)
              .then(res => {
                console.log(res);
                if (res.errors) {
                  this.setState({
                    loading: false,
                    spin: false
                  })
                  message.destroy()
                  message.error('Failed to get pet list')

                } else {
                  let patientsArr = res.data.patients.data
                  let dataArr = []
                  for (let i = 0; i < patientsArr.length; i++) {
                    const patient = patientsArr[i];
                    let { id, name, gender, dateOfBirth, breeds, owners, createdAt } = patient

                    createdAt = moment(createdAt).format('X')
                    let owner = 'unknown'
                    if (owners.length > 0) {
                      let ownerItem = owners[0]
                      if (ownerItem && ownerItem.owner) {
                        let { firstName, lastName } = ownerItem.owner
                        if (firstName || lastName) {
                          owner = `${lastName} ${firstName}`
                        }
                      }

                    }

                    let breed = 'unknown'
                    if (breeds.length > 0 && breeds[0].name) {
                      breed = breeds[0].name
                    }

                    let petAge = 'unknown'
                    if (dateOfBirth) {
                      petAge = moment(new Date()).diff(moment(dateOfBirth), 'years')
                      // console.log('petAge', petAge);
                    }

                    let json = {
                      insertedAt: createdAt,
                      patientId: id,
                      petName: name,
                      owner,
                      breed,
                      gender: gender || 'unknown',
                      age: petAge,
                      petId: '',
                      id: `${i}`,
                      weight: null,
                      rfid: null,
                      url: null,
                      speciesId: null,
                    }
                    dataArr.push(json)


                  }

                  console.log(dataArr);



                  this.rhapsody(dataArr)
                }

              })
              .catch(err => {
                console.log(err);
                this.setState({
                  loading: false,
                  spin: false
                })
                message.destroy()
                message.error('Failed to get pet list')
              })
          }
        })
        .catch(err => {
          console.log(err);
          this.setState({
            loading: false,
            spin: false
          })
          message.destroy()
          message.error('Data acquisition failed')
        })




      return
    }






    let startDay = moment().startOf('day').format('YYYY-MM-DD HH:mm:ss')
    let endDay = moment().endOf('day').format('YYYY-MM-DD HH:mm:ss')
    let chazhi = new Date().getTimezoneOffset()
    let newstartTime = moment(startDay).add(chazhi, 'm').format('YYYY-MM-DD HH:mm:ss');
    let newendTime = moment(endDay).add(chazhi, 'm').format('YYYY-MM-DD HH:mm:ss');

    let params = {
      doctorId: storage.userId,
      offset: 0,
      size: 100,
      subStartTime: newstartTime,
      subEndTime: newendTime
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }









    console.log('查询宠物的入参', params,);
    const isUnKnow = (val) => {
      if (val) {
        return val
      } else {
        return 'unknown'
      }
    }

    // fetchRequest('/user/listAllPetInfo', 'GET', params)
    fetchRequest('/new/pet/subscribe/page', 'POST', params)

      .then(res => {
        console.log('查询到的宠物列表,/new/pet/subscribe/page', res);

        if (res.flag === true && res.data) {
          let data = []
          // let oldList = res.data
          let oldList = res.data.list
          for (let i = 0; i < oldList.length; i++) {
            let { age, url, createTime, patientId, speciesId, petName, firstName, birthday, lastName, breedName, gender, petId, weight, rfid, l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference, pethubId, macId,
              h2tLength, torsoLength } = oldList[i]
            let owner = ''
            patientId = isUnKnow(patientId)
            petName = isUnKnow(petName)
            breedName = isUnKnow(breedName)
            age = isUnKnow(age)
            weight = isUnKnow(weight)
            if (!firstName) {
              firstName = ''
            }
            if (!lastName) {
              lastName = ''
            }
            if (lastName === '' && firstName === '') {
              owner = 'unknown'
            } else {
              owner = `${lastName} ${firstName}`
            }
            createTime = moment(createTime).format('X')
            let petGender = ''
            switch (`${gender}`) {
              case '1': petGender = 'F'

                break;
              case '0': petGender = "M"
                break;
              default: petGender = 'unknown'
                break;
            }
            let petAge = 'unknown'
            if (birthday) {
              petAge = moment(new Date()).diff(moment(birthday), 'years')
            }

            let json = {
              insertedAt: createTime,
              patientId,
              petName,
              owner,
              breed: breedName,
              gender: petGender,
              age: petAge,
              petId,
              id: i,
              weight,
              rfid,
              url,
              speciesId,
              l2rarmDistance, neckCircumference, upperTorsoCircumference, lowerTorsoCircumference,
              h2tLength, torsoLength,
              pethubId, macId,

            }
            data.push(json)

          }
          data.sort((a, b) => {
            return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
          })
          console.log('列表的数据：', data);
          storage.doctorList = JSON.stringify(data)
          this.setState({
            data,
            loading: false,
            spin: false
          })

          electronStore.set('doctorExam', data)


        } else {
          this.setState({
            loading: false,
            spin: false
          })
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false,
          spin: false
        })
      })



  }


  getColumnSearchProps = dataIndex => ({
    //dataIndex 是标题名称
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => ( //通过 filterDropdown 自定义的列筛选功能，并实现一个搜索列的示例。
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    //自定义Icon
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    //	本地模式下，确定筛选的运行函数 value:输入框里输入的内容     record:所有的项，相当于遍历
    onFilter: (value, record) => {
      console.log(value, record, dataIndex);
      return record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : ''
    },
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select(), 100);
      }
    },
    render: text =>
      this.state.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[this.state.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };
  _refresh = () => {
    console.log('点击了');
    this.setState({
      spin: true
    })
    // this._getData()
    this._getExam()
  }

  /**------------------顶部start------------------------ */
  _close = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('关闭程序');
    ipcRenderer.send('window-close')
  }
  _min = () => {
    let ipcRenderer = window.electron.ipcRenderer
    console.log('最小化程序');
    ipcRenderer.send('window-min')
    this.setState({
      minbgc: '',
    })
  }
  _minMove = () => {

    this.setState({
      minbgc: 'rgb(211, 205, 205)'
    })
  }
  _minLeave = () => {
    this.setState({
      minbgc: ''
    })
  }
  _closeMove = () => {
    this.setState({
      closeColor: 'red',
      closebgc: '#fff'
    })
  }
  _closeLeave = () => {
    this.setState({
      closeColor: '#fff',
      closebgc: ''
    })
  }

  handleClick = e => {
    console.log('click ', e);

    switch (e.key) {
      case '1': this.props.history.push('/page11'); break;
      case '2': this.props.history.push('/'); break;
      case '3':
        try {

          let selectNum = document.getElementsByClassName('ant-pagination-item-active')
          // storage.defaultCurrent = selectNum[0].title
          storage.doctorList = JSON.stringify(this.state.data)
        } catch (error) {
          console.log('错误信息', error);
        }


        this.props.history.push('/page8'); break;
      case '4': this.props.history.push('/page12'); break;

      default:
        break;
    }

  };

  _search1 = (search) => {       //这个是搜索调用后台的函数，现在废弃20210929
    let params = {
      doctorId: storage.userId,
      petName: search,
    }
    this.setState({
      loading: true
    })
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    const isUnKnow = (val) => {
      if (val) {
        return val
      } else {
        return 'unknown'
      }
    }
    console.log('搜索的数据', params);
    fetchRequest('/pet/listPetsLike', "POST", params)
      .then(res => {
        console.log(res);

        if (res.flag === true) {
          let data = []
          for (let i = 0; i < res.data.length; i++) {
            let { age, createTime, patientId, petName, firstName, birthday, lastName, breedName, gender, petId, weight } = res.data[i]
            let owner = ''
            patientId = isUnKnow(patientId)
            petName = isUnKnow(petName)
            breedName = isUnKnow(breedName)
            age = isUnKnow(age)
            weight = isUnKnow(weight)
            if (!firstName) {
              firstName = ''
            }
            if (!lastName) {
              lastName = ''
            }
            if (lastName === '' && firstName === '') {
              owner = 'unknown'
            } else {
              owner = `${lastName} ${firstName}`
            }
            createTime = moment(createTime).format('X')
            let petGender = ''
            switch (`${gender}`) {
              case '1': petGender = 'F'

                break;
              case '0': petGender = "M"
                break;
              default: petGender = 'unknown'
                break;
            }
            let petAge = 'unknown'
            if (birthday) {
              petAge = moment(new Date()).diff(moment(birthday), 'years')
              // console.log('petAge', petAge);
            }

            let json = {
              insertedAt: createTime,
              patientId,
              petName,
              owner,
              breed: breedName,
              gender: petGender,
              age: petAge,
              petId,
              id: i,
              weight

            }
            data.push(json)

          }
          data.sort((a, b) => {
            return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
          })
          this.setState({
            searchData: data,
            loading: false
          })
        } else {
          this.setState({
            searchData: [],
            loading: false
          })
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({
          loading: false
        })
      })
  }

  _search = (keyWord) => {       //这个是搜索功能 ，怎么展示列表的内容进行搜索

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
    this.setState({
      loading: true
    })
    let list = this.state.data
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
    console.log(searchData);
    this.setState({
      searchData,
      loading: false
    })





  }

  RFIDSearch = () => {
    this.setState({
      loading: true
    })
    fetchRequest4(`/pet/getPetInfoByRFID/${this.state.heardSearchText}/${storage.lastOrganization}`, 'GET')
      .then(res => {
        console.log('----RFID搜索结果', res);

        if (res.flag === true && res.data) {
          let { createTime, patientId, petName, firstName, lastName, breedName, gender, birthday, petId, rfid, weight } = res.data
          patientId = patientId || 'unknown'
          petName = petName || 'unknown'
          breedName = breedName || 'unknown'
          weight = weight || 'unknown'
          let owner = ''
          if (!firstName) {
            firstName = ''
          }
          if (!lastName) {
            lastName = ''
          }
          if (lastName === '' && firstName === '') {
            owner = 'unknown'
          } else {
            owner = `${lastName} ${firstName}`
          }
          createTime = moment(createTime).format('X')
          let petGender = ''
          switch (`${gender}`) {
            case '1': petGender = 'F'

              break;
            case '0': petGender = "M"
              break;
            default: petGender = 'unknown'
              break;
          }
          let petAge = 'unknown'
          if (birthday) {
            petAge = moment(new Date()).diff(moment(birthday), 'years')
            // console.log('petAge', petAge);
          }
          let json = {
            insertedAt: createTime,
            patientId,
            petName,
            owner,
            breed: breedName,
            gender: petGender,
            age: petAge,
            petId,
            id: 0,
            weight,
            rfid
          }
          let searchData = []
          searchData.push(json)
          this.setState({
            searchData,
            loading: false
          })




        } else if (res.flag === true && res.msg === '该组织下无此宠物信息') {
          console.log('找到了但是不是在这个组织下');
          this.setState({
            loading: false,
            modalVis: true,
            isNotFound: false,
            heardSearchText: ''
          })
        } else {
          console.log('没有找到');
          this.setState({
            loading: false,
            modalVis: true,
            isNotFound: true,
            heardSearchText: ''
          })
        }
      })
      .catch(err => {

        console.log('抛出异常:', err);
        this.setState({
          loading: false,
        })
      })
  }
  draggleRef = React.createRef();
  onStart = (event, uiData) => {
    const { clientWidth, clientHeight } = window?.document?.documentElement;
    const targetRect = this.draggleRef?.current?.getBoundingClientRect();
    this.setState({
      bounds: {
        left: -targetRect?.left + uiData?.x,
        right: clientWidth - (targetRect?.right - uiData?.x),
        top: -targetRect?.top + uiData?.y,
        bottom: clientHeight - (targetRect?.bottom - uiData?.y)
      }
    });
  };


  render () {
    const columns = [
      {
        title: 'Time',
        dataIndex: 'insertedAt',
        key: 'insertedAt',
        width: '16%',
        // ...this.getColumnSearchProps('insertedAt'),
        render: (text, record, index) => {
          let chazhi = new Date().getTimezoneOffset()
          // console.log(moment(parseInt(text) * 1000).format('YYYY-MM-DD HH:mm'));
          let year = moment(parseInt(text) * 1000).format('YYYY-MM-DD');
          let time = moment(parseInt(text) * 1000).format('hh:mm a');
          let newTime = moment(parseInt(text) * 1000).format('YYYY-MM-DD HH:mm');
          // console.log(moment(parseInt(text) * 1000).add(chazhi, 'm').format('YYYY-MM-DD HH:mm'));
          return (
            <div className='flex' style={{ paddingTop: pX(3), paddingBottom: pX(3), paddingLeft: px(10), justifyContent: 'flex-start', alignItems: 'flex-start' }}>
              <p>{`${year}`}</p>
              <p>{`${time}`}</p>
            </div>
          )
        },

      },
      {
        title: 'Pet ID',
        dataIndex: 'patientId',
        key: 'patientId',
        width: '15%',
        // ...this.getColumnSearchProps('patientId'),
      },
      {
        title: 'Pet Name',
        dataIndex: 'petName',
        key: 'petName',
        width: '15%',
        // ...this.getColumnSearchProps('petName'),
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        key: 'owner',
        width: '15%',
        // ...this.getColumnSearchProps('owner'),
      },
      {
        title: 'Breed',
        dataIndex: 'breed',
        key: 'breed',
        width: '15%',
        // ...this.getColumnSearchProps('breed'),
        render: (text, record, index) => {
          if (!text || text === 'defaultdog' || text === 'defaultother' || text === 'defaultcat') {
            return (
              <p style={{ textAlign: 'center' }}>{'unknown'}</p>
            )
          } else {
            return (
              <p style={{ textAlign: 'center' }}>{text}</p>
            )
          }

        }
      },

      {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
        width: '12%',
        // width: '30%',
        // ...this.getColumnSearchProps('gender'),
      },
      {
        title: 'Age',
        dataIndex: 'age',
        key: 'age',
        width: '12%',
        // width: '20%',
        render: (text, record, index) => {
          // console.log(text);

          if (`${text}` === 'NaN') {
            return (
              <p style={{ textAlign: 'center', justifyItems: 'center' }}>{'unknown'}</p>
            )
          } else {
            return (
              <p style={{ textAlign: 'center' }}>{text}</p>
            )
          }

        }
      },


    ];
    const { loading, data, api, id, seleceID, spin, closeColor, closebgc, minbgc, disabled, bounds, modalVis, sortBy, showsortBy } = this.state

    let items = document.querySelectorAll('#doctorSelectExam .ant-table-thead .ant-table-cell')
    for (let i = 0; i < items.length; i++) {
      let style = items[i].style
      style.padding = `5px 5px`
      style.textAlign = 'center'
    }
    const noData = () => {
      return (
        <div className='flex nodata' style={{ paddingTop: px(60), paddingBottom: px(60) }}>
          <p style={{ fontSize: px(22) }}>No pet found, </p>  &nbsp;&nbsp;
          <a style={{ fontSize: px(22) }} href="#"
            onClick={(e) => {
              console.log('我要去添加宠物');
              // try {

              //   storage.doctorList = JSON.stringify(this.state.data)
              // } catch (error) {
              //   console.log('错误信息', error);
              // }
              // // /pet/doctorAddPet
              // this.props.history.push({ pathname: '/pet/doctorAddPet' })
              this.props.history.push({ pathname: '/AddYuding', })
              e.preventDefault();

            }}

          >{`go to add`}</a>
        </div>
      )
    }





    return (

      <div id="doctorSelectExam" onClick={(e) => {
        console.log('隐藏');
        this.setState({
          showsortBy: false
        })
      }}>
        {/* 关闭缩小 */}
        <Heard
          onReturn={() => {
            this.props.history.push('/page11')

          }}
          onSearch={(data) => {

            storage.doctorExam = JSON.stringify(data)

            storage.doctorList = JSON.stringify(this.state.data)
            if (storage.isClinical === 'true') {
              this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: data.patientId })
            } else {
              this.props.history.push({ pathname: '/page10', })
            }
          }}
          menu10Click={() => {
            this.props.history.push({ pathname: '/uesr/DoctorSelectAllExam', })
          }}
          blueSearch={true}
        />


        <div className="hread flex">
          <div className="hread1 flex" style={{ marginTop: px(30) }}>
            <div className="heard1L flex">
              <div className="title" style={{ fontSize: px(25) }}>Scheduled Patients</div>
              <div className="refresh flex"
                style={{ fontSize: px(25), marginLeft: px(10) }}
              >
                <SyncOutlined onClick={this._refresh} spin={spin} />
              </div>
            </div>

            <div className="walkin flex"
              style={{ borderRadius: px(50), height: px(45), fontSize: px(20) }}
              onClick={() => {
                storage.doctorExam = JSON.stringify('')
                storage.doctorList = JSON.stringify(this.state.data)
                if (storage.isClinical === 'true') {
                  this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: null })
                } else {
                  this.props.history.push({ pathname: '/page10', })
                }

              }}
            >Walk-In</div>

          </div>
          <div className="heard2 flex" style={{ marginTop: px(8), marginBottom: px(8) }}>

            <div className="sort flex" >
              <p style={{ fontSize: px(16), marginRight: px(10) }}>sort By:</p>

              <SelectionBox
                listArr={[
                  { key: 'time', value: 'Time' },
                  { key: 'petid', value: 'Pet ID' },
                  { key: 'owner', value: 'Owner' },
                  { key: 'breed', value: 'Breed' },
                  { key: 'petname', value: 'Pet Name' },
                  { key: 'gender', value: 'Gender' },
                ]}
                clickItem={(item) => {
                  let petList = [].concat(data)
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

                  this.setState({
                    sortBy: item.value,
                    showsortBy: false,
                    data: petList
                  })
                }}
              />
            </div>

          </div>
        </div>


        <div className="table" >
          <ConfigProvider renderEmpty={noData}>
            <Table
              style={{
                // border: ' #979797 1px solid',
                padding: 0,
                margin: 0,
                width: '95%',
                // height: px(500)
              }}
              rowKey={data => data.id}
              bordered={false}
              columns={columns}
              dataSource={(this.state.heardSearchText.length === 0) ? this.state.data : this.state.searchData}
              loading={loading}
              locale={{ filterConfirm: <div>111</div> }}
              // pagination={{ showSizeChanger: false, showQuickJumper: true, defaultCurrent: this.state.current }}
              pagination={false}
              scroll={{
                y: px(600)
              }}
              onRow={(record) => {
                return {
                  onClick: (event) => {

                    console.log('record', record);
                    storage.doctorExam = JSON.stringify(record)
                    storage.doctorList = JSON.stringify(this.state.data)

                    if (storage.isClinical === 'true') {
                      this.props.history.push({ pathname: '/page8', identity: storage.identity, patientId: record.patientId })
                    } else {
                      this.props.history.push({ pathname: '/page10', })
                    }


                  }, // 点击行

                };
              }}
            />
          </ConfigProvider>
        </div>
        <div className="hread flex" style={{ alignItem: 'center' }}>
          <div className="hread1" style={{ marginTop: px(10), justifyContent: 'flex-end', display: 'flex', }}>
            <div className="walkin flex"
              style={{ borderRadius: px(50), height: px(45), fontSize: px(20), marginRight: px(10) }}
              onClick={() => {
                this.props.history.push({ pathname: '/AddYuding', })

              }}
            >Create New Scheduled</div>

          </div>
        </div>



        <Modal

          // visible={isOrg}
          visible={modalVis}
          onCancel={() => this.setState({ modalVis: false })}
          width={350}
          footer={[]}
          modalRender={(modal) => (
            <Draggable
              disabled={disabled}
              bounds={bounds}
              onStart={(event, uiData) => this.onStart(event, uiData)}
            >
              <div ref={this.draggleRef}>{modal}</div>
            </Draggable>
          )}
          destroyOnClose={true}
          wrapClassName="doctorSelectExamModal"
        >
          <div id='doctorSelectExamModal'>
            <div className="text"
              onMouseOver={() => {
                if (disabled) {
                  this.setState({
                    disabled: false,
                  });
                }
              }}
              onMouseOut={() => {
                this.setState({
                  disabled: true,
                });
              }}

            >{this.state.isNotFound ? 'Pet not found!' : 'Pet found!'}</div>
            <div className='Img'>
              {this.state.isNotFound ?
                <img src={redclose} width="50px" /> :
                <img src={jinggao} width="50px" />
              }

            </div>




            {this.state.isNotFound ? <p > This pet is not on your database</p> :
              <p >Pet Identified but does not <br /> belong to your organization.</p>}


            <div style={{ marginTop: px(20) }}>
              <Button1
                text={'OK'}

                onClick={() => this.setState({
                  modalVis: false
                })}
              />
            </div>








          </div>

        </Modal>



      </div>
    )
  }
}


import React, { Component } from 'react'
import {
  Select,
  Button,
} from 'antd'

import parent from '../../assets/img/parent.png'
import dog from '../../assets/images/reddog.png'
import cat from '../../assets/images/redcat.png'
import other from '../../assets/images/redother.png'

import Heart from '../../utils/heard/Heard'
import { px } from '../../utils/px';
import MyModal from '../../utils/myModal/MyModal'

import moment from 'moment'
import { connect } from 'react-redux'
import { petDetailInfoFun } from '../../store/actions';

import './index.less';
import { pet_petall } from '../../api'

const { Option } = Select;
let storage = window.localStorage;

class PetAndParents extends Component {

  state = {
    parentList: [],       //宠物主人列表
    petList: [],          //宠物列表
    loading: false,       //加载中
    parentSearchArr: [],  //搜索后的宠物主人列表
    petSearchArr: [],     //搜索后的宠物列表
    searchText: '',        //搜索文本
    parentAndPetList: [],  //宠物主人下的所有宠物,
  }
  componentDidMount() {
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    ipcRenderer.send('Lowbig')
    ipcRenderer.on('changeFenBianLv', this.changeFenBianLv)

    this._getExam()

  }
  componentWillUnmount() {
    let ipcRenderer = window.electron.ipcRenderer

    ipcRenderer.removeListener('changeFenBianLv', this.changeFenBianLv)
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer
    let { height, width } = window.screen
    let windowsHeight = height > width ? width : height
    ipcRenderer.send('Lowbig')
    this.setState({

    })
  }
  _getExam = async () => {
    this.setState({
      loading: true,
      spin: false
    })
    let params = {
      offset: 0,
      size: 500,
    }
    pet_petall(storage.lastOrganization, params)
      .then(res => {
        this.setState({
          loading: false
        })
        if (res.flag === true) {
          let data = []
          let list = res.data.list
          let owerList = []
          let parentAndPetList = []
          for (let i = 0; i < list.length; i++) {
            let { url, patientId, speciesId, petName, petId, rfid, createTime, userId, firstName, lastName, phone, email, userImageUrl, birthday, breedName, gender } = list[i]
            petName = petName ? petName : (patientId ? patientId : 'unknown')
            let json = {
              insertedAt: createTime,
              name: petName,
              petId,
              rfid,
              url,
              speciesId,
              type: 'pet',
              patientId,
              petBirthday: birthday,
              breedName,
              gender
            }
            data.push(json)
            if (userId) {
              let flogNum = -1

              for (let i = 0; i < owerList.length; i++) {
                let ower = owerList[i]
                if (ower.userId === userId) {
                  flogNum = i
                  break;
                }

              }
              if (flogNum === -1) {     //这是一个不在数组里的宠物主人
                let owerJson = {
                  userId, firstName, lastName, phone, email, userImageUrl, name: `${lastName} ${firstName}`
                }
                owerList.push(owerJson)
                let parentAndPetJson = {
                  parent: owerJson,
                  pets: [json]
                }
                parentAndPetList.push(parentAndPetJson)
              } else {
                parentAndPetList[flogNum].pets.push(json)
              }
            }
          }
          data.sort((a, b) => {
            return moment(parseInt(a.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') > moment(parseInt(b.insertedAt) * 1000).format('YYYY-MM-DD HH:mm') ? -1 : 1
          })
          this.setState({
            petList: data,
            parentList: owerList,
            parentAndPetList
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
  list = (value) => {
    let { petList, parentList, petSearchArr, parentSearchArr, searchText, parentAndPetList } = this.state
    let data = []
    if (value === 'parent') {
      if (searchText.length > 0) {
        data = parentSearchArr
      } else {
        data = parentList
      }
    } else {
      if (searchText.length > 0) {
        data = petSearchArr
      } else {
        data = petList
      }
    }
    let options = data.map((item, index) => {
      let { speciesId, url, userImageUrl, patientId, petId, name } = item
      let images = null
      if (value === 'parent') {
        images = `url(${userImageUrl}?download=0&width=150)`
        if (!userImageUrl) {
          images = `url(${parent})`
        }
      } else {
        images = `url(${url}?download=0&width=150)`
        if (!url) {
          switch (speciesId) {
            case 1: images = `url(${cat})`
              break;
            case 2: images = `url(${dog})`
              break
            default: images = `url(${other})`
              break;
          }
        }
      }
      return (
        <li
          key={`${index}`}
          style={{ margin: `0 8px ${px(15)}px 0`, borderRadius: px(20) }}
          onClick={() => {
            let params = []
            if (item.type !== 'pet') {
              for (let i = 0; i < parentAndPetList.length; i++) {
                if (item.userId === parentAndPetList[i].parent.userId) {
                  params = parentAndPetList[i]
                  break
                }
              }
              this.props.history.push({ pathname: '/menuOptions/editParent', parent: params })
            } else {
              this.props.petDetailInfoFun(item);
              this.props.history.push({ pathname: '/page9', parent: params })
            }
          }}
        >
          <div className='item' style={{ padding: `${px(15)}px 0 ${px(15)}px  ${px(20)}px`, }}>
            <div
              className='img'
              style={{
                width: px(50),
                height: px(50),
                marginRight: px(20),
                borderRadius: px(60),
                backgroundImage: images,
              }}>
            </div>

            <div className='petInfo' >
              <p style={{ color: '#141414', fontWeight: 600, fontSize: px(20) }}>{name}</p>
            </div>
          </div>
        </li >
      )
    })

    let liStyle = { backgroundColor: '#fff', }
    if (this.state.petList.length > 6) {
      liStyle = { height: px(560), overflowY: 'auto' }
    }
    return (
      <div className='petList'>
        <ul style={liStyle}>
          {options}
        </ul>
      </div>
    )

  }
  inputChange = (text) => {
    let search = text.target.value
    this.setState({
      searchText: search
    })

    let { parentList, petList } = this.state
    console.log(parentList, petList);
    let keyWord = search

    let parentSearchData = []
    for (let i = 0; i < parentList.length; i++) {
      let petName = parentList[i].name.toLowerCase() || ''
      if (`${petName}`.indexOf(keyWord.toLowerCase()) !== -1) {
        parentSearchData.push(parentList[i])
      }
    }

    let petSearchData = []
    for (let i = 0; i < petList.length; i++) {
      let petName = petList[i].name ? petList[i].name.toLowerCase() : ''
      let patientId = petList[i].patientId ? petList[i].patientId.toLowerCase() : ''
      let rfid = petList[i].rfid ? petList[i].rfid : ''
      if (`${petName}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${patientId}`.indexOf(keyWord.toLowerCase()) !== -1
        || `${rfid}`.indexOf(keyWord) !== -1
      ) {
        petSearchData.push(petList[i])
      }
    }
    this.setState({
      petSearchArr: petSearchData,
      parentSearchArr: parentSearchData
    })


  }

  render() {
    return (
      <div id="PetAndParents">
        <div className="heard">
          <Heart />
        </div>
        <div className="body">
          <div className='titleBox'>
            <h1 style={{ fontSize: px(20) }}>{`Pet & Parents Profile Management`}</h1>
          </div>
          <div className="search">
            <div className="searchL">
              <input
                type="text"
                style={{ paddingLeft: px(25), height: px(34) }}
                placeholder="&#xe62c; Search "
                value={this.state.searchText}
                onChange={(text) => {
                  this.inputChange(text)
                }}
              />
            </div>
            <Button
              type="primary"
              shape="round"
            >
              Search
            </Button>
          </div>
          <div className="btns">
            <Button
              type="primary"
              shape="round"
            >
              + New Parent
            </Button>
            <Button
              type="primary"
              shape="round"
              onClick={() => {
                this.props.history.push('/pet/doctorAddPet')
              }}
            >
              + New Pet
            </Button>
          </div>
          <div className="lists">
            <div className="listsL">
              {this.list('parent')}
            </div>
            <div className="listsL">
              {this.list('pet')}
            </div>
          </div>
        </div>
        <MyModal visible={this.state.loading} />
      </div>
    )
  }
}

export default connect(
  (state) => ({

  }),
  {
    petDetailInfoFun
  }
)(PetAndParents);

import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  message,
  Spin,
  Button,
  Avatar,
  List
} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import redcat from "../../assets/images/redcat.png";
import reddog from "../../assets/images/reddog.png";
import redother from "../../assets/images/redother.png";

import { fetchRequest } from '../../utils/FetchUtil1';
import { calculateAge, petPicture } from '../../utils/commonFun'

import _ from 'lodash';

import './index.less';

const SelectPet = ({ visible, width, title, destroyOnClose, value, onSelect, onCancel, onLoading, onAddPet }) => {
  let storage = window.localStorage;
  const [isModalVisible, setIsModalVisible] = useState(false);//控制弹窗的显隐
  const [isdestroyOnClose, setIsdestroyOnClose] = useState(false);//是否清除弹窗里面的内容
  const [isWidth, setIsWidth] = useState(520);//弹窗的宽度
  const [petList, setPetList] = useState([]);//当前组织下所有宠物
  const [searchPetList, setSearchPetList] = useState([]);//搜索宠物列表
  const [searchValue, setSearchValue] = useState('');//搜索框的值
  const [selePetValue, setSelePetValue] = useState();//选中的宠物值
  const [selePetIndex, setSelePetIndex] = useState(-1);//选中的宠物下标
  const [loading, setLoading] = useState(false);//数据加载
  const [btnLoading, setBtnLoading] = useState(false);//按钮加载

  //获取所有宠物
  const getAllPet = () => {
    setLoading(true);
    let params = {
      doctorId: storage.userId,
      offset: 0,
      size: 100,
    }
    if (storage.lastWorkplaceId) {
      params.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      params.organizationId = storage.lastOrganization
    }
    fetchRequest('/user/listAllPetInfo', 'GET', params)
      .then((res) => {
        setLoading(false);
        if (res.flag === true) {
          let newData = [];
          _.map(res.data, (item, index) => {
            newData.push({
              petId: item.petId,
              petIndex: index,
              birthday: item.birthday,
              breedName: item.breedName,
              patientId: item.patientId,
              petName: item.petName,
              petSpeciesBreedId: item.petSpeciesBreedId,
              gender: item.gender,
              url: item.url,
            })
          });
          setPetList(newData);
        }
      })
      .catch((err) => {
        setLoading(false);
      })
  }
  //确认选择
  const handleOk = () => {
    if (_.isEmpty(selePetValue)) {
      message.error('Please choose a pet!');
    } else {
      onSelect(selePetValue);
      setIsModalVisible(visible);
    }
  };
  //关闭弹窗
  const handleCancel = () => {
    onCancel(false);
    setIsModalVisible(visible);
  };
  //输入框输入值
  const onChange = (e) => {
    setSearchValue(e.target.value);
  }
  //展示宠物照片
  const shoePetPicture = (petSpeciesBreedId, url) => {
    if (_.isEmpty(url)) {
      switch (petPicture(petSpeciesBreedId)) {
        case 'cat':
          return redcat
        case 'dog':
          return reddog
        case 'other':
          return redother
        default:
          return redother
      }
    } else {
      return url
    }
  }
  //选择宠物事件
  const selectPet = (index, item) => {
    setSelePetValue(item);
    setSelePetIndex(index);
  }
  //搜索宠物名字或patientId
  const searchPetByPetNameOrPatientId = () => {
    let list = petList;
    let searchData = [];
    for (let i = 0; i < list.length; i++) {
      let name = list[i].petName ? list[i].petName.toLowerCase() : "";
      let patientId = list[i].patientId ? list[i].patientId.toLowerCase() : "";
      if (
        `${name}`.indexOf(searchValue.toLowerCase()) !== -1 ||
        `${patientId}`.indexOf(searchValue.toLowerCase()) !== -1
      ) {
        searchData.push(list[i]);
      }
    }
    setSearchPetList(searchData);
  }
  //取消或添加宠物
  const handleCancelOrAddPet = () => {
    onAddPet(false);
    setIsModalVisible(visible);
  }

  useEffect(() => {
    if (visible === true || visible === false) {
      setIsModalVisible(visible);
    } else {
      setIsModalVisible(false);
    }
    return (() => { })
  }, [visible]);

  useEffect(() => {
    getAllPet();
    return (() => { })
  }, []);

  useEffect(() => {
    if (searchValue.length > 0) {
      searchPetByPetNameOrPatientId();
    }
    return (() => { })
  }, [searchValue]);

  useEffect(() => {
    if (destroyOnClose === true) {
      setIsdestroyOnClose(destroyOnClose);
    }
    if (_.isNumber(width)) {
      setIsWidth(width)
    }
    return (() => { })
  }, []);

  useEffect(() => {
    if (onLoading === true || onLoading === false) {
      setBtnLoading(onLoading);
    } else {
      setBtnLoading(false);
    }
    return(() => {})
  }, [onLoading]);

  return (
    <>
      <Modal
        title="Assign Measurement"
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        footer={null}
        width={isWidth}
        destroyOnClose={isdestroyOnClose}
        className="selectPetModal"
      >
        <Spin spinning={loading}>
          <div className='modalContentBox'>
            <div className="searchBox">
              <Input
                placeholder="Search Name"
                bordered={false}
                allowClear={true}
                prefix={<SearchOutlined />}
                onChange={onChange}
              />
            </div>
            <div className='list'>
              <List
                itemLayout="horizontal"
                dataSource={searchValue.length > 0 ? searchPetList : petList}
                renderItem={(item, index) => (
                  <List.Item
                    extra={selePetIndex === index ? <span className="search">&#xe614;</span> : null}
                    onClick={() => selectPet(item.petIndex, item)}
                  >
                    <List.Item.Meta
                      avatar={<Avatar src={shoePetPicture(item.petSpeciesBreedId, item.url)} />}
                      title={
                        <div className='petListItemTitle'>
                          {item.petName ? item.petName : 'unKnown'},{item.patientId ? item.patientId : 'unKnown'}
                        </div>
                      }
                      description={
                        <div>
                          {calculateAge(item.birthday) === 'unknown' ? 'unknown' : `${calculateAge(item.birthday)} yrs`},
                          {item.gender === 0 ? "Male" : "Venter"},
                          {item.breedName ? item.breedName : 'unKnow'}
                        </div>
                      }
                    />
                  </List.Item>

                )}
              />
            </div>
            <div className='foot'>
              <div className="btnBox">
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleCancelOrAddPet}
                >
                  +Add New Pet
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleOk}
                  loading={btnLoading}
                >
                  Confirm
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default SelectPet;

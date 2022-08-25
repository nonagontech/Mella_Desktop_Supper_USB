import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  message,
  Spin,
  Button,
} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import PhoneBook from '../../utils/phoneBook/PhoneBook';
import { fetchRequest } from '../../utils/FetchUtil1'

import _ from 'lodash';

import './index.less';

const SelectPetBreed = ({ visible, width, title, destroyOnClose, value, onSelect, onCancel }) => {

  const [isModalVisible, setIsModalVisible] = useState(false);//控制弹窗的显隐
  const [isdestroyOnClose, setIsdestroyOnClose] = useState(false);//是否清除弹窗里面的内容
  const [isWidth, setIsWidth] = useState(520);//弹窗的宽度
  const [breedList, setBreedList] = useState([]);//所有宠物品种
  const [searchValue, setSearchValue] = useState();//搜索框的值
  const [selePetBreedValue, setSelePetBreedValue] = useState();//选择的宠物品种
  const [loading, setLoading] = useState(false);//加载

  //获取所有宠物品种
  const getAllPetBreed = () => {
    let data = {
      speciesId: null,//null是获取所有宠物品种不分猫和狗
    }
    setLoading(true);
    fetchRequest(`/pet/selectBreedBySpeciesId`, 'POST', data)
      .then((res) => {
        setLoading(false);
        if (res.msg === 'success') {
          setBreedList(res.petlist);
        } else {
          message.error('Failed to obtain pet breed')
        }
      })
      .catch((err) => {
        setLoading(false);
      })
  }
  //确认选择
  const handleOk = () => {
    onSelect(selePetBreedValue);
    setIsModalVisible(visible);
  };
  //关闭弹窗
  const handleCancel = () => {
    onCancel(false);
    setIsModalVisible(visible);
  };
  //输入框输入内容
  const onChange = (e) => {
    setSearchValue(e.target.value);
  }

  useEffect(() => {
    if (visible === true || visible === false) {
      setIsModalVisible(visible);
    } else {
      setIsModalVisible(false);
    }
    return (() => { });
  }, [visible]);

  useEffect(() => {
    getAllPetBreed();
    return (() => { });
  }, []);

  useEffect(() => {
    if (destroyOnClose === true) {
      setIsdestroyOnClose(destroyOnClose);
    }
    if (_.isNumber(width)) {
      setIsWidth(width)
    }
    return (() => { })
  }, []);

  return (
    <>
      <Modal
        title="Choose Breed"
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        footer={null}
        width={isWidth}
        destroyOnClose={isdestroyOnClose}
        className="selectPetBreedModal"
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
              <PhoneBook
                listDate={breedList}
                confirmSelectBreed={value}
                selectFun={(val) => {
                  setSelePetBreedValue(val);
                }}
                searchText={searchValue}
              />
            </div>
            <div className='foot'>
              <div className="btnBox">
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleOk}
                >
                  Select
                </Button>
              </div>
            </div>
          </div>
        </Spin>
      </Modal>
    </>
  );
};

export default SelectPetBreed;

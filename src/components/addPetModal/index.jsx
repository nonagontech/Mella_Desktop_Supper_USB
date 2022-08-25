import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  message,
  Spin,
  Button,
  Select,
} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import UploadImg from "../../utils/uploadImg/UploadImg";

import {
  checkPatientId,
} from '../../api';

import _ from 'lodash';

import './index.less';

const AddPetModal = ({ visible, width, title, destroyOnClose, value, onSelect, onCancel }) => {
  const { Option } = Select;
  let storage = window.localStorage;
  const [isModalVisible, setIsModalVisible] = useState(false);//控制弹窗的显隐
  const [isdestroyOnClose, setIsdestroyOnClose] = useState(false);//是否清除弹窗里面的内容
  const [isWidth, setIsWidth] = useState(520);//弹窗的宽度
  const [loading, setLoading] = useState(false);//加载
  const [breedList, setBreedList] = useState([]);//
  const [imageId, setImageId] = useState('');//上传后图片id
  const [patientId, setPatientId] = useState('');//用户输入的病人id
  const [petName, setPetName] = useState('');//用户输入的宠物名字
  const [ownerName, setOwnerName] = useState('');//用户输入的主人名字
  const [breedId, setBreedId] = useState();//用户选择的宠物品种id
  const [petAge, setPetAge] = useState();//用户输入的宠物年龄
  const [petWeight, setPetWeight] = useState();//用户输入的宠物体重


  //确认选择
  const handleOk = () => {
    setIsModalVisible(visible);
  };
  //关闭弹窗
  const handleCancel = () => {
    onCancel(false);
    setIsModalVisible(visible);
  };
  //判断用户输入的patientId是否存在
  const getPetInfoByPatientId = () => {
    let datas = {
      patientId: patientId,
      doctorId: storage.userId
    }
    if (storage.lastWorkplaceId) {
      datas.workplaceId = storage.lastWorkplaceId
    }
    if (storage.lastOrganization) {
      datas.organizationId = storage.lastOrganization
    }
    checkPatientId(datas).then((res) => {
      console.log('res: ', res);
    })

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
        title="Add a Pet"
        visible={isModalVisible}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        footer={null}
        width={isWidth}
        destroyOnClose={isdestroyOnClose}
        className="addPetModal"
      >
        <Spin spinning={loading}>
          <div className='modalContentBox'>
            <div className='petMsgBox'>
              <div className='addPhoto'>
                <UploadImg
                  getImg={(val) => {
                    setImageId(val.imageId);
                  }}
                />
              </div>
              <div className="item">
                <p>Patient ID:</p>
                <Input
                  value={patientId}
                  bordered={false}
                  onChange={(e) => {
                    setPatientId(e.target.value)
                  }}
                  onBlur={() => {
                    if (patientId.length > 0) {
                      getPetInfoByPatientId();
                    }
                  }}
                />
              </div>
              <div className="item">
                <p>Pet Name:</p>
                <Input
                  value={petName}
                  bordered={false}
                  onChange={(e) => {
                    setPetName(e.target.value)
                  }}
                />
              </div>
              <div className="item">
                <p>Owner Name:</p>
                <Input
                  value={ownerName}
                  bordered={false}
                  onChange={(e) => {
                    setOwnerName(e.target.value)
                  }}
                />
              </div>

              <div className="item">
                <p>Breed:</p>
                <div className='selectBox'>
                  <Select
                    showSearch
                    style={{ width: "100%" }}
                    bordered={false}
                    value={breedId}
                    placeholder="Search to Select"
                    optionFilterProp="children"
                    listHeight={256}
                    // onSelect={(value, data) => this._select(value, data)}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >=
                      0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {
                      _.map(breedList, (item, index) => {
                        <Option key={item.petSpeciesBreedId}>{item.breedName}</Option>
                      })
                    }
                  </Select>
                </div>
              </div>

              <div className="item">
                <p>Pet Age:</p>
                <Input
                  value={petAge}
                  bordered={false}
                  onChange={(e) => {
                    setPetAge(e.target.value)
                  }}
                />
              </div>
              <div className="item">
                <p>Pet Weight:</p>
                <Input
                  value={petWeight}
                  bordered={false}
                  onChange={(e) => {
                    setPetWeight(e.target.value)
                  }}
                />
                <div className="unit">{`kg`}</div>
              </div>
            </div>
            <div className='foot'>
              <div className="btnBox">
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  block
                  onClick={handleOk}
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

export default AddPetModal;

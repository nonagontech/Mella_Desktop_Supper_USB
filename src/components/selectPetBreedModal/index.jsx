import React, { useEffect, useState } from 'react'
import {
  Modal,
  Input,
  message,
  Select,
  Spin,
} from "antd";
import { SearchOutlined } from '@ant-design/icons';

import _ from 'lodash';

import './index.less';

const SelectPetBreed = ({ visible, width, title, destroyOnClose, value, onSelect, onCancel }) => {

  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const inputPlaceholder = () => {
    return (
      <>

      </>
    );
  }

  useEffect(() => {
    if (visible === true || visible === false) {
      setIsModalVisible(visible);
    } else {
      setIsModalVisible(false);
    }
    return (() => { })
  }, [visible])

  return (
    <>
      <Modal
        title="Choose Breed"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        className="selectPetBreedModal"
      >
        <div className='modalContentBox'>
          <div className="searchBox">
            <Input
              placeholder="Search Name"
              bordered={false}
              allowClear={true}
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default SelectPetBreed;

import React, { useEffect, useState } from 'react'
import { Modal, Input, message, Select, Spin } from "antd";
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
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        centered
        maskClosable={false}
        className="selectPetBreedModal"
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
    </>
  );
};

export default SelectPetBreed;

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Table, Popconfirm, Modal, Input, message, Select, Spin } from "antd";

const AssignPetPopovers = ({ getassignVisible ,onCancel}) => {
  console.log('getassignVisible: ', getassignVisible);
  const [assignVisible, setAssignVisible] = useState(false);//选择宠物列表弹窗
  const [addPetVisible, setAddPetVisible] = useState(false);//新增宠物弹窗

  const handleCancel = () => {
    onCancel(false);
    setAssignVisible(false);
  };

  useEffect(() => {
    setAssignVisible(getassignVisible);
    return (() => { })
  }, [getassignVisible])

  return (
    <>
      <Modal
        visible={assignVisible}
        maskClosable={false}
        destroyOnClose={true}
        centered
        // footer={[]}
        onCancel={handleCancel}
      >
        <div style={{ padding: '24px', textAlign: 'center' }}>
          Assign Measurement
        </div>
      </Modal>
    </>
  )
}

export default AssignPetPopovers;

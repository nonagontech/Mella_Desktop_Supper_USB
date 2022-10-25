import React, { useState } from 'react';
import { Upload, Modal } from 'antd';
import ImgCrop from 'antd-img-crop';

const Demo = (props) => {
  const [fileList, setFileList] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewTitle, setPreviewTitle] = useState('')
  const [previewImage, setPreviewImage] = useState('')


  const onChange = (file) => {
    // { fileList: newFileList }
    // console.log('===========', fileList);
    // setFileList(newFileList);
    if (file.fileList) {
      setFileList(file.fileList);
    }
    if (file.file && file.file.status === "done") {
      console.log('--------------', file.file.response);
      let res = file.file.response
      if (res.flag) {
        let imageId = res.data.imageId
        console.log(imageId, props);
        props.getinfo(imageId)
        if (props.getAllInfo) {
          props.getAllInfo(res.data)
        }
      } else {
        console.log('我是上传返回函数状态为false');
        props.getinfo(0)
      }
    }
    if (file.file) {
      if (file.file.status === "removed" || file.file.status === "error") {
        console.log('图片已经被移除了或删除失败，', file.file.status);
        props.getinfo(0)
      }
    }
    // console.log('数据改变', file);


  };


  const onPreview = async file => {
    console.log(file);
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewVisible(true)
    setPreviewImage(file.url || file.preview)
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
  };
  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  const init = props.init

  return (
    <>
      <ImgCrop
        rotate={true}
      // shape={'round'}
      // grid={true}

      >
        <Upload
          action="http://ec2-3-214-224-72.compute-1.amazonaws.com:8080/mellaserver/image/uploadImage"
          listType="picture-card"
          name='img'
          fileList={fileList}
          onChange={onChange}
          onPreview={onPreview}
          data={(file) => {
            console.log('--文件信息---', file);
          }}
          accept="image/*"
        >
          {fileList.length < 1 && (init || '+ Upload')}
        </Upload>

      </ImgCrop>

      <Modal
        open={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={() => { setPreviewVisible(false) }}
      >
        <img alt="example" style={{ width: '100%' }} src={previewImage} />
      </Modal>
    </>
  );
};

export default Demo

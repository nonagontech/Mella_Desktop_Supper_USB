import React, { useEffect, useState } from 'react'
import {
  Modal,
  Form,
  Input,
  message,
  Button,
  Upload,
} from "antd";
import { PlusOutlined } from '@ant-design/icons';

import { px } from '../../utils/px';
import Heard from '../../utils/heard/Heard'
import { fetchRequest } from '../../utils/FetchUtil1';

import using from '../../assets/images/using.png'
import measuring from '../../assets/images/measuring.png'
import unassigned from '../../assets/images/unassigned.png'
import adding from '../../assets/images/adding.png'
import email from '../../assets/images/email.png'
import phone from '../../assets/images/phone.png'
import complaint from '../../assets/images/complaint.png'

import { useHistory } from 'react-router-dom';
import _ from 'lodash';

import './index.less';

let storage = window.localStorage;
const Help = () => {
  const [form] = Form.useForm();
  const { TextArea } = Input;
  let list = [
    {
      img: using,
      title: 'Using the app'
    }, {
      img: measuring,
      title: 'Measuring with Mella'
    }, {
      img: unassigned,
      title: 'Unassigned Readings'
    },
    {
      img: adding,
      title: 'Adding New Users'
    },
  ];
  let num = 150 / list.length;
  let mar = num + 'px';
  let history = useHistory();
  const [opinionsVisible, setOpinionsVisible] = useState(false);//弹窗显隐
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();
  const [fileList, setFileList] = useState([]);//图片组

  const changeFenBianLv = (e) => {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big');
  }
  //关闭弹窗
  const handleCancel = () => {
    setOpinionsVisible(false);
    setFileList([]);
  };
  //提交bug优化信息
  const onFinish = (e) => {
    setLoading(true);
    let imageIds = []
    _.map(fileList, (item) => {
      imageIds.push(item.response.data.imageId)
    })
    let data = {
      ...e,
      imageIds: _.toString(imageIds),
      userId: storage.userId
    };
    fetchRequest(`/userfeedback/savefeedback`, 'POST', data)
      .then((res) => {
        setLoading(false);
        if (res.msg === 'success') {
          setOpinionsVisible(false);
          message.success('Submit Successfully~');
        } else {
          message.success('submit Failure!');
        }
      })
      .catch((err) => {
        message.success('submit Failure!');
      })


  };
  //提交异常
  const onFinishFailed = (e) => {
    message.error('Please fill in the correct information!');
  };
  /**
 * 上传文件前校验
 */
  const beforeNormFile = (e) => {
    // 检查图片类型
    const isJPG = e.type === 'image/jpeg';
    const isPNG = e.type === 'image/png';
    const isBMP = e.type === 'image/bmp';
    const isGIF = e.type === 'image/gif';
    const isWEBP = e.type === 'image/webp';
    const isPic = isJPG || isPNG || isBMP || isGIF || isWEBP;
    //文件大小校验
    const isLt2M = e.size / 1024 / 1024 < 4;
    if (!isPic) {
      message.error(`${e.name} not a picture file`);
    } else if (!isLt2M && isPic) {
      message.error(`${e.name}Upload is not allowed if the limit exceeds 4M~`);
    }
    return isPic && isLt2M ? true : Upload.LIST_IGNORE;
  };
  /**
   * Base64
   */
  const getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  };
  /**
 * 文件上传后处理
 */
  const handleChange = async (info) => {
    console.log('info: ', info);
    if (info.file.status === 'done') {
      setFileList(info.fileList);
    }
    if (info.file.status === 'removed') {
      setFileList(info.fileList);
    }

    // getBase64(info.file.originFileObj, (imageUrl) => {
    //   setLoading(false);
    //   setImageUrl(imageUrl);
    // });
  };
  //添加图片按钮
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );

  useEffect(() => {
    let ipcRenderer = window.electron.ipcRenderer
    ipcRenderer.send('big')
    //监听屏幕分辩率是否变化，变化就去更改界面内容距离大小
    ipcRenderer.on('changeFenBianLv', changeFenBianLv)
    return (() => {
      let ipcRenderer = window.electron.ipcRenderer
      ipcRenderer.removeListener('changeFenBianLv', changeFenBianLv)
    })
  }, [])

  useEffect(() => {
    console.log('fileList', fileList);
  }, [fileList])

  return (
    <>
      <div id="help">
        <div className="heard">
          <Heard
            menu8Click={() => {
              switch (storage.identity) {
                case '2': history.push({ pathname: '/EzyVetSelectExam', listDate: storage.ezyVetList, defaultCurrent: storage.defaultCurrent })
                  break;
                case '1': history.push('/VetSpireSelectExam')
                  break;
                case '3': history.push({ pathname: '/uesr/selectExam', listDate: storage.doctorList, defaultCurrent: storage.defaultCurrent })
                  break;
                default:
                  break;
              }
            }}
            onReturn={() => {
              history.goBack()
            }}
          />
        </div>
        <div className="body">
          <div className="title">How can we help you?</div>
          <div className="input">
            <input
              type="text"
              placeholder="Describe you issue     &#xe63f;"
            />
          </div>
          <div className="list">
            <ul>
              {list.map((data, index) => (
                <li key={index}>
                  <>
                    <img src={data.img} alt="" />
                    <p>{data.title}</p>
                  </>
                </li>
              ))}
            </ul>
          </div>
          <div className="popularArticles">
            <div className="text">Popular Articles</div>
            <span className=" iconfont  icon-jiantou3 dropDown" />
          </div>
          <div className="popularArticles tutorials">
            <div className="text">Tutorials</div>
            <span className=" iconfont  icon-jiantou3 dropDown" />
          </div>
          <div className="time">
            <p style={{ fontSize: px(24) }}>Still need help?</p>
            <div className="line" style={{ height: px(6) }}></div>
            <p style={{ fontSize: px(24) }}>Monday - Friday: 9am - 5pm (ET)</p>
          </div>
        </div>
        <div className="foot">
          <div className="l">
            <img src={complaint} alt="" />
            <div className="text">Make a Suggestion</div>
            <p
              onClick={() => { setOpinionsVisible(true) }}
            >
              Submit Opinions
            </p>
          </div>
          <div className="l">
            <img src={email} alt="" />
            <div className="text">Drop us a line</div>
            <a href="mailto:support@mella.ai"
              onClick={(e) => { }}
            >support@mella.ai</a>
          </div>
          <div className="l r">
            <img src={phone} alt="" />
            <div className="text">Bark at Us!</div>
            <div className="text">201.977.6411</div>
          </div>
        </div>
        <Modal
          visible={opinionsVisible}
          destroyOnClose={true}
          centered
          maskClosable={false}
          width={700}
          onCancel={handleCancel}
          className="opinionsModal"
          footer={[]}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="title"
              label="Title"
              rules={[
                {
                  required: true,
                  message: 'Please input title!',
                },
              ]}
            >
              <Input placeholder="Clear titles can be verified more quickly" />
            </Form.Item>
            <Form.Item
              name="description"
              label="Description"
              rules={[
                {
                  required: true,
                  message: 'Please input description!',

                },
                {
                  min: 15,
                  message: 'No less than 15 words'
                }
              ]}
            >
              <TextArea
                showCount
                maxLength={500}
                autoSize={{
                  minRows: 3,
                  maxRows: 5,
                }}
                placeholder="Please describe your proposed use scenario and your optimization/improvement plan in detail (no less than 15 words)"
              />
            </Form.Item>
            <Form.Item
              name="imageIds"
              label={`${'Related pictures or screenshots' + '(' + fileList.length + '/' + 5 + ')'}`}
            // valuePropName="fileList"
            >
              <Upload
                accept="image/*"
                name="img"
                action="http://ec2-3-214-224-72.compute-1.amazonaws.com:8080/mellaserver/image/uploadImage"
                beforeUpload={beforeNormFile}
                onChange={handleChange}
                withCredentials={true}
                listType="picture-card"
              >
                {fileList.length >= 5 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item>
              <div className='bugSubmitBox'>
                <Button type="primary" htmlType="submit" size='large' loading={loading} block>
                  Submit
                </Button>
              </div>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </>
  );

};

export default Help;

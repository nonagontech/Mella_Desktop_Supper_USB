import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { } from "../../store/actions";
import {
  Layout,
  Button,
  Form,
  Input,
  Radio,
  Col,
  Row,
  Checkbox,
  Upload,
  Select,
  message,
} from "antd";
import { UserOutlined } from '@ant-design/icons';
import Avatar from '../../components/avatar/Avatar'
import _ from "lodash";
import { px, mTop } from "../../utils/px";
import changePhoto from '../../assets/images/changePhoto.png';
import countryList from '../../utils/areaCode/country';
import { fetchRequest } from '../../utils/FetchUtil1';
import PropTypes from 'prop-types';
import "./index.less";


const MyAccount = ({bodyHeight}) => {
  let storage = window.localStorage;
  const [form] = Form.useForm();
  const { Option } = Select;
  const [imageId, setImageId] = useState();
  const [petUrl, setPetUrl] = useState();
  const [imgUrl, setImgUrl] = useState();
  const [country, setCountry] = useState('US');
  const [countryArr, setCountryArr] = useState();
  const [infoData, setInfoDate] = useState();

  const onFinish = (values) => {
    let array = ['0', '0', '0', '0', '0', '0', '0', '0', '0', '0', '0'];
    for (let index = 0; index < _.size(values.domain); index++) {
      array[_.toNumber(values.domain[index])] = '1';
    }
    let reg = new RegExp(',',"g");
    let res = _.toString(array).replace(reg,'');
    let data = {
      ...values,
      imageId: imageId,
      domain: res,
      userId: storage.userId
    };
    fetchRequest(`/user/update`, "POST", data)
      .then((res) => {
        if (res.msg === 'success') {
          message.success('The user information is updated successfully');
        } else {
          message.error('Description Failed to update user information');
        }
      })
  };

  useEffect(() => {
    let arr = countryList.map(item => item.locale)
    arr.sort(function (a, b) {
      return a.localeCompare(b)
    })
    setCountryArr(arr);
  }, []);

  useEffect(() => {
    fetchRequest(`/user/getUserInfoByUserId/${storage.userId}`, "GET")
      .then((res) => {
        if (res.flag === true) {
          let newData = {
            ...res.data,
            domain: _.toArray(res.data.domain)

          }
          let arr = [];
          for (let index = 0; index < _.size(newData.domain); index++) {
            if (newData.domain[index] === '1') {
              arr.push(_.toString(index));
            }
          }
          newData.domain = arr;
          form.setFieldsValue(newData);
          setInfoDate(newData);
          setImgUrl(res.data?.userImage?.url);
        }
      })
  }, [])

  return (
    <Layout className="myAccountBox" style={{ height: bodyHeight }}>
      <div className="headerContentBox" style={{ background: "#fff", position: 'relative' }}>
        <div style={{
          height: '100%',
          backgroundColor: '#FFFFFF',
          borderBottom: '2px solid #979797',
          display: 'flex'
        }}>
          <span className="headerTitle">My Account</span>
        </div>
      </div>
      <div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="accountForm"
        >
          <Row>
            <Col flex={1} className="leftColBox">
              <Form.Item valuePropName="fileList" name="imageId" className="imageFormItem">
                <div style={{ display: 'grid', justifyItems: 'center', alignItems: 'center' }}>
                  <Avatar
                    init={
                      <div className="ciral">
                        <img src={imgUrl ? imgUrl : changePhoto} alt="" id="touxiang" height="300px" />
                        <p style={{ fontSize: px(14), height: mTop(35) }}>Change Photo</p>
                      </div>
                    }
                    getinfo={(val) => {
                      if (val) {
                        setImageId(val);
                      }

                    }}
                    getAllInfo={(val) => {
                      if (val.url) {
                        setPetUrl(val.url);
                      }
                    }}
                  />
                </div>
              </Form.Item>
              <Form.Item label="Email" name="email">
                <Input placeholder="input placeholder" bordered={false} className="accountInput" />
              </Form.Item>
            </Col>
            <Col flex={1} className="rightColBox">
              <Form.Item label="FirstName" name="firstName">
                <Input placeholder="input placeholder" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item label="LastName" name="lastName">
                <Input placeholder="input placeholder" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item label="Phone" name="phone">
                <Input placeholder="input placeholder" bordered={false} className="accountInput" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item className="addressFormItem" label="Address">
            <div style={{ display: 'flex' }}>
              <Form.Item name="address1" style={{ marginRight: px(16) }}>
                <Input placeholder="address1" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item name="address2" style={{ marginRight: px(16) }}>
                <Input placeholder="address2" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item name="city" style={{ marginRight: px(16) }}>
                <Input placeholder="city" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item name="state" style={{ marginRight: px(16) }}>
                <Input placeholder="state" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item name="zipcode" style={{ marginRight: px(16) }}>
                <Input placeholder="zipcode" bordered={false} className="accountInput" />
              </Form.Item>
              <Form.Item name="country">
                <Select
                  showSearch
                  style={{ width: 100, borderBottom: '1px solid rgba(216,216,216,1)' }}
                  bordered={false}
                  optionFilterProp="children"
                  defaultValue="US"
                  // onChange={onChange}
                  onSelect={(val) => { setCountry(val) }}
                  filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                  // open
                  // dropdownClassName="addressSelectBox"
                >
                  {_.map(countryArr, (item, index) => (
                    <Option key={index} value={item}>{item}</Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </Form.Item>
          <Form.Item className="expertiseFormItem" label="Areas of Expertise" name="domain">
            <Checkbox.Group>
              <Row>
                <Col span={6}>
                  <Checkbox
                    value='0'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Dogs
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='1'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Cats
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='2'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Small Pets
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='3'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Nutrition
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='4'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Surgery
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='5'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Zoo
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='6'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Wildlife
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='7'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Cardiology
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='8'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Neurology
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='9'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Anaesthesia
                  </Checkbox>
                </Col>
                <Col span={6}>
                  <Checkbox
                    value='10'
                    style={{
                      lineHeight: '32px',
                    }}
                  >
                    Other
                  </Checkbox>
                </Col>
              </Row>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item className="btnFormItem">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button type="primary" htmlType="submit" shape="round" size="large" style={{ width: px(260) }}>Save Changes</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </Layout>
  );
}

MyAccount.propTypes = {
  bodyHeight: PropTypes.number,
  devicesTypeList: PropTypes.array
}

export default connect(
  (state) => ({}),
)(MyAccount);

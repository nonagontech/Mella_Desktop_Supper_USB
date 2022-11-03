import React, { Component } from "react";
import { Input, message, Spin } from "antd";
import {
  createFromIconfontCN,
  LoadingOutlined,
} from "@ant-design/icons";

import mellaLogo from "./../../assets/images/mellaLogo.png";
import dui from "./../../assets/images/dui.png";
import back_white from "./../../assets/img/back-white.png";
import back_hui from "./../../assets/img/back-hui.png";

import { getLoginQRcode, loginWithQRcode, mellaLogin } from "../../api"

import temporaryStorage from "../../utils/temporaryStorage";
import { px, win } from "../../utils/px";
import MinClose from "./../../utils/minClose/MinClose";
import MouseDiv from "./../../utils/mouseDiv/MouseDiv";
import { addLogin } from "../../utils/axios";

import "./index.less";

let storage = window.localStorage;
const MyIcon = createFromIconfontCN({
  scriptUrl: "//at.alicdn.com/t/font_2326495_7b2bscbhvvt.js",
});
let num = 0;
//有可能出现,登录成功跳转后获取到了二维码,这样就会导致出现一直轮询,未解决这个问题设置变量isSign
let isSign = true;

export default class SignIn extends Component {
  state = {
    isRemember: false,
    email: "",
    hash: "",
    isCode: false,
    baseUrl: "",
    QRToken: "",
    isExpired: false, //二维码是否过期
    spin: false,
    isLoadQrCode: false, //是否正在加载二维码
  };
  componentDidMount() {
    isSign = true;
    storage.lastOrganization = "";
    //通知main.js渲染一个small窗口
    let ipcRenderer = window.electron.ipcRenderer;
    ipcRenderer.send("small", win());
    //如果有保存的账号密码则展示出来
    if (storage.signIn !== undefined && storage.signIn !== "") {
      let data = storage.signIn;
      data = JSON.parse(data);
      this.setState({
        email: data.email,
        hash: data.hash,
        QRToken: "",
      });
    }
    //是否勾选了保持登录
    if (storage.isRemember !== undefined) {
      let isRemember = storage.isRemember === "true" ? true : false;
      this.setState({
        isRemember,
      });
    }
    // 监听分辨率是否改变
    ipcRenderer.on("changeFenBianLv", this.changeFenBianLv);
    //清空本地的注册界面的信息
    temporaryStorage.logupVetInfo = {};
    this._getQRCode();
  }
  componentWillUnmount() {
    isSign = false;
    this.timer && clearInterval(this.timer);
    let ipcRenderer = window.electron.ipcRenderer;
    ipcRenderer.removeListener("changeFenBianLv", this.changeFenBianLv);
  }
  changeFenBianLv = (e) => {
    console.log(e);
    let ipcRenderer = window.electron.ipcRenderer;
    // ipcRenderer.send('small')
    ipcRenderer.send("small", win());
    this.setState({});
  };
  _getQRCode = () => {
    this.setState({
      isLoadQrCode: true,
    });
    num = 0;

    getLoginQRcode()
      // addQRCode()
      .then((res) => {
        message.destroy();

        console.log("---获取二维码", res);
        if (res.flag === true) {
          this.setState({
            baseUrl: res.data.QRcode,
            QRToken: res.data.QRToken,
            isLoadQrCode: false,
          });
          this.timer = setInterval(() => {
            if (!isSign) {
              this.timer && clearInterval(this.timer);
            }
            num++;
            console.log("lunxin");
            this._polling();

            if (num > 280) {
              //超过280秒则去显示二维码过期，要重新获取
              this.setState({
                isExpired: true,
              });
              num = 0;
              this.timer && clearInterval(this.timer);
            }
          }, 1000);
        } else {
          message.error("Failed to obtain QR code", 10);
          this.setState({
            isLoadQrCode: false,
          });
        }
      })
      .catch((err) => {
        message.error("Failed to obtain QR code", 10);
        this.setState({
          isLoadQrCode: false,
        });
        console.log(err);
      });
  };
  //轮询
  _polling = () => {

    loginWithQRcode(this.state.QRToken)
      .then((res) => {
        console.log("轮询结果：", res);
        if (res.flag === true) {
          switch (res.code) {
            case 10001:
              console.log("未扫码");

              break;

            case 11033:
              console.log("扫码未点击登录");
              this.timer && clearInterval(this.timer);
              temporaryStorage.QRToken = this.state.QRToken;
              let { name, url } = res.data;
              this.props.history.replace({
                pathname: "/user/login/scanCodeLogin",
                params: { name, url },
              });

              break;

            case 11023:
              console.log("过期");
              this.setState({
                isExpired: true,
              });
              num = 0;
              this.timer && clearInterval(this.timer);

              break;

            default:
              break;
          }
        }
        console.log("code", res.code);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  //登录接口
  _continue = () => {
    const { email, hash, isRemember } = this.state;

    message.destroy();
    let params = {
      email: email.replace(/(^\s*)/g, ""),
      hash,
      identityTypeId: "1",
    };
    if (email === "") {
      message.error("please input your email");
      return;
    }
    if (hash === "") {
      message.error("please input your password");
      return;
    }
    console.log(params);
    this.setState({
      spin: true,
    });
    mellaLogin(params)
      .then((res) => {
        console.log(res);
        this.setState({
          spin: false,
        });
        if (res.status && res.status === 404) {
          message.error("system error");
          return;
        }
        if (res.status === 500) {
          message.error("system error");

          return;
        }
        if (res.code === 10001 && res.msg === "账号错误") {
          message.error("Account error");
          return;
        }
        if (res.code === 10002 && res.msg === "密码错误") {
          message.error("wrong password");
          return;
        }
        if (
          res.code === 0 &&
          res.msg === "success" &&
          res.success.roleId === 1
        ) {
          message.error(
            "You do not have the authority of a doctor, please contact the administrator or customer service",
            10
          );
          return;
        }
        if (res.code === 10004 && res.msg === "账号被限制") {
          message.error(
            "The account is restricted, please contact the management",
            10
          );
          return;
        }
        if (res.code === 10003) {
          message.error("The password or email is incorrect, please re-enter");
          return;
        }

        if (res.code === 0 && res.msg === "success") {
          this.timer && clearInterval(this.timer);
          console.log("账号密码正确，登录进去了");
          let { userWorkplace, lastOrganization, token, firstName, lastName } = res.success;
          storage.token = token;
          storage.userId = "";
          storage.userName = `${lastName} ${firstName}`
          storage.userEmail = email
          let data = {
            email: email.replace(/(^\s*)/g, ""),
            hash,
          };
          data = JSON.stringify(data);
          if (isRemember === true) {
            storage.signIn = data;
          } else {
            storage.signIn = "";
          }
          storage.saveSign = data;

          storage.userId = res.success.userId;
          storage.roleId = res.success.roleId;

          //每次登陆后清空宠物列表缓存的数据
          storage.doctorList = "";
          storage.defaultCurrent = "";

          //由于后台接口原因，导致这里的最后工作场所可能不是自己的，因此下面全注释掉。改成如果有多个工作场所则跳转到选择工作场所界面，不是多个则跳转到选择宠物界面
          if (res.success.lastWorkplaceId) {
            storage.lastWorkplaceId = res.success.lastWorkplaceId;
          } else {
            storage.lastWorkplaceId = "";
          }

          if (res.success.lastOrganization) {
            storage.lastOrganization = res.success.lastOrganization;
          } else {
            storage.lastOrganization = "";
          }

          // console.log("----------", userWorkplace, userWorkplace.length);

          if (userWorkplace) {
            storage.userWorkplace = JSON.stringify(userWorkplace);
            let connectionKey = "";
            for (let i = 0; i < userWorkplace.length; i++) {
              const element = userWorkplace[i];
              if (element.organizationEntity) {
                if (element.organizationEntity.organizationId === lastOrganization) {
                  if (element.organizationEntity.connectionKey) {
                    connectionKey = element.organizationEntity.connectionKey;
                  }
                  if (element.roleId) {
                    console.log(element.roleId);
                    storage.roleId = element.roleId;

                  }
                  storage.orgName = element.organizationEntity.name

                  break;
                }
              }
            }
            console.log("----------key值为：", connectionKey);
            storage.connectionKey = connectionKey;
          } else {
            storage.userWorkplace = "";
            storage.connectionKey = "";
          }
          console.log('storage.orgName', storage.orgName);
          this.props.history.push("/MainBody");
        }
      })
      .catch((err) => {
        this.setState({
          spin: false,
        });
        console.log(err);
      });
  };

  _signUp = (e) => {
    e.preventDefault();
    this.props.history.push("/uesr/logUp/VetPrifile");
  };
  _change = () => {
    let { isCode } = this.state;
    message.destroy();
    if (isCode === false) {
      this._getQRCode();
    } else {
      this.timer && clearInterval(this.timer);
      num = 0;
      this.setState({
        isExpired: false,
      });
    }
    this.setState({ isCode: !this.state.isCode });
  };
  //二维码界面
  _qrCode = () => {
    let { isCode, baseUrl, isExpired, isLoadQrCode } = this.state;
    let imgOpacity = isLoadQrCode ? (baseUrl ? 0.1 : 0.5) : 1;

    if (!isExpired) {
      const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
      return (
        <div className="qrcode">
          <img
            src={`data:image/jpeg;base64,${baseUrl}`}
            alt=""
            style={{
              width: px(120),
              height: px(120),
              opacity: imgOpacity,
            }}
          />
          {isLoadQrCode && (
            // true &&

            <div className="err">
              <Spin
                indicator={antIcon}
                tip="Loading..."
                style={{ fontSize: 16, color: "#e1206d" }}
              />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="qrcode">
          <img
            src={`data:image/jpeg;base64,${baseUrl}`}
            alt=""
            style={{ opacity: "0.1", width: px(120), height: px(120) }}
          />

          <div className="err">
            <div className="errText">QR code has expired</div>
            <div
              className="btn"
              style={{ width: px(145), height: px(35), marginTop: px(10) }}
              onClick={this.refresh}
            >
              Refresh
            </div>
          </div>
        </div>
      );
    }
  };
  //点击refresh按钮
  refresh = () => {
    this.setState({
      isExpired: false,
    });
    num = 0;
    this._getQRCode();
  };
  beforeDiv = () => {
    return <img src={back_hui} alt="" style={{ width: px(15) }} />;
  };
  afterDiv = () => {
    return <img src={back_white} alt="" style={{ width: px(15) }} />;
  };

  render() {
    let { isCode, baseUrl } = this.state;
    let code = isCode ? "icon-diannao-copy" : "icon-erweima-copy";
    return (
      <div id="signIn">
        <div
          className="heaed"
          style={{ paddingTop: px(10), paddingRight: px(20) }}
        >
          <div className="l">
            <MouseDiv
              className="mouseDiv"
              beforeDiv={this.beforeDiv}
              afterDiv={this.afterDiv}
              divClick={() => {
                this.props.history.push("/");
              }}
            />
          </div>
          <div className="r">
            <MinClose />
          </div>
        </div>

        <div className="body">
          <div className="logo">
            <img src={mellaLogo} alt="" />
          </div>
          <div className="body" style={{ position: "relative" }}>
            <div
              className="text"
            // style={{
            //   fontSize: px(28),
            //   marginBottom: px(20),
            //   marginTop: px(30),
            // }}
            >
              Please enter email <br />
              and password
            </div>

            <div className="inpF">
              <Input
                className="inp"
                // style={{
                //   width: px(310),
                //   height: px(45),
                //   fontSize: px(18),
                // }}
                value={this.state.email}
                placeholder="rachel@friends.com"
                bordered={false}
                onChange={(item) => {
                  let str = item.target.value;
                  this.setState({
                    email: str,
                  });
                }}
              />
              <Input.Password
                className="inp"
                // style={{
                //   width: px(310),
                //   height: px(45),
                //   marginLeft: px(6),
                //   marginBottom: px(18),
                //   fontSize: px(18),
                // }}
                visibilityToggle={false}
                value={this.state.hash}
                placeholder="********"
                bordered={false}
                onChange={(item) => {
                  let str = item.target.value;
                  this.setState({
                    hash: str,
                  });
                }}
                onKeyDown={(e) => {
                  if (e.keyCode === 13) {
                    this._continue();
                  }
                }}
              />

              <div
                className="text"
              // style={{
              //   fontSize: px(28),
              //   lineHeight: px(1),
              //   marginTop: px(10),
              //   marginBottom: px(20),
              // }}
              >
                {"Or scan QR Code"}
              </div>
            </div>

            {this._qrCode()}
            <div
              className="littleText flex"
              style={{
                fontSize: px(12),
                marginTop: px(10),
                marginBottom: px(10),
              }}
            >
              Go to your Mella mobile app to access
              <br />
              the QR scanner
            </div>
            <div className="stay">
              <div className="remember">
                <p style={{ fontSize: px(16) }}>Stay Signed In</p>
                <div
                  className="box"
                  style={{ width: px(20), height: px(20), marginLeft: px(12) }}
                  onClick={() => {
                    let { isRemember } = this.state;
                    this.setState({
                      isRemember: !isRemember,
                    });
                    storage.isRemember = !isRemember;
                  }}
                >
                  {this.state.isRemember && <img src={dui} alt="" />}
                </div>
              </div>
              <div
                className="forgot"
                style={{ fontSize: px(16) }}
                onMouseDown={() => {
                  let forget = document.querySelectorAll("#signIn .forgot");
                  forget[0].style.opacity = 0.5;
                }}
                onMouseUp={() => {
                  document.querySelectorAll(
                    "#signIn .forgot"
                  )[0].style.opacity = 1;
                  if (this.state.email) {
                    temporaryStorage.forgotPassword_email = this.state.email;
                  }

                  this.props.history.push("/user/login/forgotPassword");
                }}
              >
                Forgot?
              </div>
            </div>
          </div>
        </div>

        <div
          className="button11"
          style={{ backgroundColor: "#E7E7E7" }}
        >
          <div
            className="btn1 flex"
            onClick={this._continue}
          // style={{ height: px(40) }}
          >
            <p>{`CONTINUE`}</p>
          </div>

          <div className="text2" style={{ marginTop: px(12) }}>
            <p style={{ fontSize: px(17) }}>
              Do not have an account?{" "}
              <a href="#" onClick={this._signUp}>
                Sign Up
              </a>
            </p>
          </div>
        </div>

        {this.state.spin && (
          <div className="modal">
            <div className="loadIcon" style={{ marginBottom: px(5) }}>
              <LoadingOutlined
                style={{ fontSize: 30, color: "#fff", marginTop: px(-30) }}
              />
            </div>
            <p>loading...</p>
          </div>
        )}
      </div>
    );
  }
}

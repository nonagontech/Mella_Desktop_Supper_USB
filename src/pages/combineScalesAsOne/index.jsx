import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { Layout, Avatar, Button, Card, Space } from "antd";
import { CheckCircleFilled } from "@ant-design/icons";
import { setMenuNum } from "../../store/actions";
import _ from "lodash";
import { devicesTitleHeight } from "../../utils/InitDate";
import scaleImage from "./../../assets/img/scaleImage.png";
import "./index.less";
const { Header, Content, Footer, Sider } = Layout;
const combineScalesAsOne = ({ petMessage, hardwareMessage, userMessage ,setMenuNum}) => {

}
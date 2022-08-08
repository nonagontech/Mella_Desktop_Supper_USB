/**
 *  path.join(__dirname, '')    C:\Users\nonagon\AppData\Local\Programs\mella\resources\app.asar
 *
 *
 */
const Store = require("electron-store");
Store.initRenderer();

const {
  app,
  BrowserWindow,
  ipcMain,
  Tray,
  Menu,
  MenuItem,
  session,
} = require("electron");
const os = require("os");
const request = require("request");
const dialog = require("electron").dialog;
let remote = require("electron").remote;
const path = require("path");
const isDev = require("electron-is-dev");
const { autoUpdater } = require("electron-updater");
const updateElectronApp = require("update-electron-app");
const {
  keyboard,
  Key,
  mouse,
  left,
  right,
  up,
  down,
} = require("@nut-tree/nut-js");
if (isDev) {
  const {
    default: installExtension,
    REACT_DEVELOPER_TOOLS,
    REDUX_DEVTOOLS,
  } = require("electron-devtools-installer");

  app.whenReady().then(async () => {
    if (isDev) {
      installExtension(REACT_DEVELOPER_TOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
      installExtension(REDUX_DEVTOOLS)
        .then((name) => console.log(`Added Extension:  ${name}`))
        .catch((err) => console.log("An error occurred: ", err));
    }
  });
}

const devWidth = 1920;
const devHeight = 1040;
//每次在检测到底座后都会发送打开底座的指令去打开底座,但是在发送升级指令后设备会断开重连检测.这就会导致在发送升级文件前会发送一段数据,导致mac升级时文件效验不通过,导致升级失败.因此加了此标志位,当发送了升级指令则为true,发送文件后重置为false
let enterUpgradeFlog = false;

let dataIndex = 0;

let mainWindow = null;
var port = null;

app.allowRendererProcessReuse = false;
const ex = process.execPath; //自启动的参数
const fs = require("fs");
let device = null, //usb所在的设备
  file = "", //给底座进行升级的文件地址
  upload = false, //是否正在给底座进行升级
  deviceUSB = { productId: -1, vendorId: -1 };
let HID = require("node-hid");

let windowOpen = true;

/**
 * 检测usb的插拔，
 * {
        locationId: 0,
        vendorId: 5824,
        productId: 1155,
        deviceName: 'Teensy USB Serial (COM3)',
        manufacturer: 'PJRC.COM, LLC.',
        serialNumber: '',
        deviceAddress: 11
    }
    对比vid与pid来确认拔的是不是底座设备
 */
let usbDetect = require("usb-detection");
usbDetect.startMonitoring();
usbDetect.on("add", function (device) {
  console.log("add", device);
  mainWindow.webContents.send("usbDetect", true);
});
usbDetect.on("remove", function (device) {
  console.log("remove", device);
  mainWindow.webContents.send("usbDetect", false);

  if (
    device.vendorId === deviceUSB.vendorId &&
    device.productId === deviceUSB.productId
  ) {
    console.log("拔出来的设备是底座，要去搜索设备了");

    openUsb();
  }
});

/**
 * openUsb  搜索底座是否存在
 *
 */

function openUsb() {
  //搜索底座存不存在，不存在就去展示
  let flog = false,
    path = ""; //usb所在的接口路径
  let devices = HID.devices();
  device = null; //这里一定要清理一下，不然退出的话会有异常
  for (let i = 0; i < devices.length; i++) {
    if (devices[i].manufacturer === "wch.cn") {
      flog = true;
      path = devices[i].path;
      deviceUSB.vendorId = devices[i].vendorId;
      deviceUSB.productId = devices[i].productId;
      break;
    }
  }
  if (windowOpen) {
    //如果没有点击退出
    if (!flog) {
      console.log("没找到设备");
      deviceUSB = { productId: -1, vendorId: -1 };
      const timer = setTimeout(() => {
        openUsb();
        clearTimeout(timer);
      }, 2000);
      mainWindow.webContents.send("noUSB", true);
    } else {
      console.log(
        "找到了设备",
        deviceUSB,
        `${enterUpgradeFlog ? "升级状态" : "非升级状态"}`
      );
      device = new HID.HID(path);
      device.on("data", (data) => {
        //监听底座发送过来的数据
        let hex = data.toString("hex");
        // console.log('----------', hex);
        let str = "",
          dataArr = [];
        for (let i = 0; i < hex.length; i = i + 2) {
          str += `${hex[i]}${hex[i + 1]} `;
          dataArr.push(`${hex[i]}${hex[i + 1]}`);
        }
        // console.log(dataIndex++, upload, "接受的数据位：", str);
        if (upload) {
          const timer = setTimeout(() => {
            sendUpload();
            clearTimeout(timer);
          }, 30);
        } else {
          let processedData = processed_data(dataArr);
          // console.log('装换的数据：', processedData);
          for (let i = 0; i < processedData.length; i++) {
            const element = processedData[i];

            mainWindow.webContents.send("sned", element);
          }
        }
      });
      device.on("error", function (err) {
        console.log(
          "----err",
          err,
          `${err}`,
          `${err}` === "Error: could not read from HID device"
        );
        if (`${err}` === "Error: could not read from HID device") {
          console.log(
            "两种可能，一种是usb被拔出了，一种是点击了重新切换的按钮"
          );
          //想个法子看是那种情况
        }
      });
      if (!enterUpgradeFlog) {
        open_USB_Communication();
      }

      mainWindow.webContents.send("noUSB", false);
    }
  }
}

/**
 * 打开底座usb的蓝牙通信
 */
function open_USB_Communication() {
  console.log("打开了底座通信");
  device.write([0x00, 0xaa, 0x04, 0x36, 0x11, 0x23, 0x55]);
}
/**
 * 关闭底座usb的蓝牙通信
 */
function close_USB_Communication() {
  device && device.write([0x00, 0xaa, 0x04, 0x36, 0x00, 0x32, 0x55]);
}
/**
 * 对接收的数据进行处理
 */
let testFlog = 0; //为了模拟体脂称数据
function processed_data(arr) {
  let j,
    newArr = [],
    trueArr = [],
    length = arr.length;

  // console.log('入参', arr);
  for (let i = 0; i < length; i++) {
    //这是判断温度计的
    if (arr[i] === "aa") {
      j = i;
      let dataLength = parseInt(arr[j + 1], 16);
      if (arr[dataLength + 1] === "55" || arr[dataLength + 1] === "00") {
        for (; j <= dataLength + 1 + i; j++) {
          newArr.push(parseInt(arr[j], 16));
        }
        // console.log(newArr,check(newArr),newArr[newArr.length-2]);
        if (check(newArr) === newArr[newArr.length - 2]) {
          trueArr.push(newArr);
          newArr = [];
          break;
        } else {
          newArr = [];
        }
      }
    }
    //这是判断体脂称样机的
    // if (arr[i] === 'ca'
    //     && arr[i + 1] === '20'
    //     && arr[i + 2] === '0b'
    //     && arr[i + 3] === '55'
    // ) {
    //     let weight1 = parseInt(arr[i + 10], 16)
    //     let weight2 = parseInt(arr[i + 11], 16)
    //     let impedance1 = parseInt(arr[i + 12], 16)
    //     let impedance2 = parseInt(arr[i + 13], 16)
    //     let arrDate = [170, 07, 99, weight1, weight2, impedance1, impedance2, 255, 85]
    //     console.log('------体重秤出参-----,arrDate', arrDate);
    //     return [arrDate]

    // }
  }
  // console.log("-----出参-------", trueArr);
  return trueArr;
}
//校验数据是否有误
function check(arr) {
  if (arr.length < 3) {
    return;
  }
  let i;
  let checkFloag = arr[1];

  for (i = 2; i < arr.length - 2; i++) {
    checkFloag = checkFloag ^ arr[i];
  }
  return checkFloag;
}

//向蓝牙发送的数据进行转换，
//入参 十六进制的控制命令字符串、数据位数组，数组的内容也是十六进制字符串
//返回值：返回要发送的数组，数组里的每一位都是十进制的数字
function sendData(command, arr) {
  //帧长,如果帧长是一位,前面加0
  let sendArr = [];

  let length = arr.length + 3;

  //开始生成校验位
  console.log(
    parseInt(length, 16),
    parseInt(command, 16),
    parseInt(length, 16) ^ parseInt(command, 16)
  );
  let Check = length ^ parseInt(command, 16);
  for (let i = 0; i < arr.length; i++) {
    // console.log(Check, parseInt(arr[i].toString(16), 16));
    Check = Check ^ parseInt(arr[i].toString(16), 16);
  }
  // console.log('------------', Check);
  sendArr[0] = 170;
  sendArr[1] = length;
  sendArr[2] = parseInt(command, 16);
  for (let i = 0; i < arr.length; i++) {
    sendArr.push(parseInt(arr[i], 16));
  }
  sendArr.push(Check);
  sendArr.push(parseInt(`55`, 16));
  // console.log(sendArr);
  return sendArr;
}

//托盘对象
var appTray = null;

function show(val) {
  let size = require("electron").screen.getPrimaryDisplay().workAreaSize;
  // console.log('-----===========---------', require('electron').screen.getAllDisplays());
  //1920 1080
  //size{width:1880,height:1080}
  let width = parseInt(size.width);
  let height = parseInt(size.height + 40);
  // console.log({
  //     width,
  //     height
  // });
  if (width < height) {
    let a = width;
    width = height;
    height = a;
  }
  // height = 1080 / 1920 * width

  let windowWidth = parseInt((val / devWidth) * width);
  let windowHeight = parseInt((val / devHeight) * height);

  // console.log(val, width, height, {
  //     width: windowWidth,
  //     height: windowHeight
  // });
  return {
    width: windowWidth,
    height: windowHeight,
  };
}

//创建加载中的窗口
let loadingWindow=null
function createLoadingWindow() {
  //加载页面窗口
  loadingWindow = new BrowserWindow({
    height: show(800).height,
    useContentSize: true,
    width: show(400).height,
    show: true,
    transparent: true,
    maximizable: false, //禁止双击放大
    frame: false, // 去掉顶部操作栏
    // backgroundColor: '#000',
  });

  const urlLocation = isDev
    ? require("path").join(__dirname, "/public/loading.html")
    : `file://${path.join(__dirname, "./build/loading.html")}`;
  loadingWindow.loadURL(urlLocation);
  Menu.setApplicationMenu(null);

  loadingWindow.on("closed", () => {
    loadingWindow = null;
  });

}

function createWindow() {
  const windowOptions = {
    height: show(800).height,
    width: show(400).height,
    backgroundColor: '#00FFFFFF',
    resizable: true, //能否改变窗体大小
    frame: false, //为false则是无边框窗口
    webPreferences: {
      // devTools:false,
      nodeIntegration: true, // 是否集成 Nodejs,把之前预加载的js去了，发现也可以运行
      // preload: path.join(__dirname, './public/renderer.js')
    },
    show: false, // newBrowserWindow创建后先隐藏，
    transparent: true,
  };
  mainWindow = new BrowserWindow(windowOptions);
  const urlLocation = isDev
    ? "http://localhost:3000"
    : `file://${path.join(__dirname, "./build/index.html")}`;
  // 开发
  mainWindow.loadURL(urlLocation);
  // 生产
  // mainWindow.loadURL(`file://${path.join(__dirname, './build/index.html')}`)
  // mainWindow.loadURL(`file://${__dirname}/index.html`);
  //是否打开开发者
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  // 设置窗口是否可以由用户手动最大化。
  mainWindow.setMaximizable(false)

  //系统托盘右键菜单
  let trayMenuTemplate = [
    {
      label: "设置",
      click: function () { }, //打开相应页面
    },
    {
      label: "帮助",
      click: function () { },
    },
    {
      label: "关于",
      click: function () { },
    },
    {
      label: "退出",
      click: function () {
        app.quit();
        app.quit(); //因为程序设定关闭为最小化，所以调用两次关闭，防止最大化时一次不能关闭的情况
      },
    },
  ];
  //系统托盘图标目录
  // trayIcon = path.join(__dirname, './');//app是选取的目录

  // appTray = new Tray(path.join(__dirname,'./logo.png'));//app.ico是app目录下的ico文件

  // //图标的上下文菜单
  // const contextMenu = Menu.buildFromTemplate(trayMenuTemplate);

  // //设置此托盘图标的悬停提示内容
  // appTray.setToolTip('Mella');

  // //设置此图标的上下文菜单
  // appTray.setContextMenu(contextMenu);
  // //单击右下角小图标显示应用
  // appTray.on('click',function(){
  //   mainWindow.show();
  // })

  mainWindow.on("closed", function () {
    mainWindow = null;
  });
  mainWindow.on("ready-to-show", function () {

    setTimeout(() => {
      mainWindow.show(); // 初始化后再显示
    }, 20)
  });
}

//app主进程的事件和方法
let fenbianlvTimer = null,
  winWidth,
  winHeight;
const statusMessage = {
  error: { status: -1, msg: "检测更新查询异常" },
  checking: { status: 0, msg: "正在检查应用程序更新" },
  updateAva: { status: 1, msg: "检测到新版本，正在下载,请稍后" },
  updateNotAva: { status: 2, msg: "您现在使用的版本为最新版本,无需更新!" },
  downloadSuccess: { status: 3, msg: "下载新版成功" },
  cencleUpdate: { status: 4, msg: "取消背景下载" },
  cencleInstall: { status: 5, msg: "取消安装" },
  downLoading: { status: 6, msg: "正在下载" },
};

const menu = new Menu();
menu.append(
  new MenuItem({
    label: "mella",
    submenu: [
      {
        role: "about",
        label: "About Mella",
        click: () => {
          console.log("点击了关于");
        },
      },
      {
        // type: 'separator',
        type: "separator",
      },
      {
        role: "services",
        // label: 'Quit Mella',

        click: () => {
          console.log("点击了server");
        },
      },
      {
        type: "separator",
      },
      {
        role: "hide",
        // accelerator: 'Cmd+Q',
        label: "Hide Mella",
        click: () => {
          console.log("点击了hide");
        },
      },
      {
        role: "hideOthers",
        // accelerator: 'Cmd+Q',
        // label: 'Quit Mella',
        click: () => {
          console.log("点击了hideOthers");
        },
      },

      {
        type: "separator",
      },
      {
        // role: 'hideOthers',
        accelerator: `Cmd+Q`,
        label: "Quit Mella",
        // type: 'separator',
        click: () => {
          console.log("关闭USB插拔监控");
          windowOpen = false;
          console.log(1);
          usbDetect.stopMonitoring();
          console.log(2);
          close_USB_Communication();
          console.log(3);
          device && device.close();
          console.log(4);
          fenbianlvTimer && clearInterval(fenbianlvTimer);
          console.log("退出");
          app.quit();
        },
      },
    ],
  })
);
menu.append(
  new MenuItem({
    label: "Edit",
    role: "editMenu",
  })
);
Menu.setApplicationMenu(menu);
const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
}
//软件升级相关内容
function checkUpdate() {
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
  autoUpdater.on("error", (err) => {
    console.log("升级错误", err);
    mainWindow.webContents.send("uploadMessage", {
      payload: statusMessage.error,
      output: err,
    });
    //升级错误提示
    // dialog.showErrorBox('Error:', err === null ? 'unknown' : `${err}`)
  });
  autoUpdater.on("update-available", (val) => {
    console.log("我要开始更新了", val);
    mainWindow.webContents.send("uploadMessage", {
      payload: statusMessage.updateAva,
      output: val,
    });
    dialog
      .showMessageBox({
        type: "info",
        title: "App has a new version",
        message:
          "A new version is found, do you want to update it in the background?",
        buttons: ["Yes", "No"],
      })
      .then((res) => {
        console.log(res);
        if (res.response === 0) {
          autoUpdater.downloadUpdate();
        } else {
          mainWindow.webContents.send("uploadMessage", {
            payload: statusMessage.cencleUpdate,
            output: null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  autoUpdater.on("update-downloaded", (val) => {
    console.log("update-downloaded", val);
    mainWindow.webContents.send("uploadMessage", {
      payload: statusMessage.downloadSuccess,
      output: val,
    });
    dialog
      .showMessageBox({
        type: "info",
        title: "Install",
        message: "Do you want to install the update now?",
        buttons: ["Yes", "No"],
      })
      .then((res) => {
        console.log("安装更新", res);
        if (res.response === 0) {
          setImmediate(() => autoUpdater.quitAndInstall());
        } else {
          mainWindow.webContents.send("uploadMessage", {
            payload: statusMessage.cencleInstall,
            output: null,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  });
  autoUpdater.on("download-progress", (data) => {
    console.log(
      data.progress,
      "-----",
      data.bytesPerSecond,
      "-----",
      data.percent,
      "-----",
      data.total,
      "-----",
      data.transferred
    );

    try {
      mainWindow.setProgressBar(data.percent / 100, { mode: "normal" });
      mainWindow.webContents.send("uploadMessage", {
        payload: statusMessage.downLoading,
        output: data.percent / 100,
      });
    } catch (error) {
      console.log(error);
    }
  });
  autoUpdater.on("update-not-available", (info) => {
    console.log("当前版本为最新版本");
    mainWindow.webContents.send("uploadMessage", {
      payload: statusMessage.updateNotAva,
      output: info,
    });
  });
}

app.on("ready", () => {
  createLoadingWindow();
  checkUpdate();
  createWindow();
  openUsb();

});

app.on("window-all-closed", () => {
  console.log("关闭USB插拔监控");
  windowOpen = false;
  console.log(1);
  usbDetect.stopMonitoring();
  console.log(2);
  close_USB_Communication();
  console.log(3);
  device && device.close();
  console.log(4);
  fenbianlvTimer && clearInterval(fenbianlvTimer);
  console.log("退出");
  app.quit();
});
app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
    mainWindow.webContents.send(
      "show",
      require("electron").screen.getPrimaryDisplay().workAreaSize
    );
  }
});

let isCloseLoading = false;
ipcMain.on("close-loading-window", function () {
  if (!isCloseLoading) {
    isCloseLoading = true;
    console.log(loadingWindow);
    loadingWindow.close();
    console.log(loadingWindow);
  }
});

//登录窗口最小化
ipcMain.on("window-min", function () {
  mainWindow.minimize();
});
//登录窗口最大化
ipcMain.on("window-max", function () {
  if (mainWindow.isMaximized()) {
    mainWindow.restore();
  } else {
    mainWindow.maximize();
  }
});
ipcMain.on("window-close", function () {
  loadingWindow && loadingWindow.close();
  mainWindow.close();
});
function wind(width1, height1, data) {
  let width = show(width1).height;
  let height = show(height1).height;
  if (data) {
    width = parseInt((width1 / devHeight) * data.height);
    height = parseInt((height1 / devHeight) * data.height);
  }

  // mainWindow.setMaximumSize(width, height);
  mainWindow.setMinimumSize(width, height);
  mainWindow.setSize(width, height);
}

ipcMain.on("big", (e, data) => {
  wind(900, 900, data);

  // mainWindow.setMaximumSize(show(800).height, show(900).height);
  // mainWindow.setMinimumSize(show(800).height, show(900).height);
  // mainWindow.setSize(show(800).height, show(1000).height)
});
ipcMain.on("setting", (e, data) => {
  wind(850, 900, data);
  // mainWindow.setMaximumSize(show(850).height, show(900).height);
  // mainWindow.setMinimumSize(show(850).height, show(900).height);
  // mainWindow.setSize(show(850).height, show(1000).height)
});

ipcMain.on("Lowbig", (e, data) => {
  wind(800, 950, data);
  // mainWindow.setMaximumSize(show(800).height, show(1000).height);
  // mainWindow.setMinimumSize(show(800).height, show(950).height);
  // mainWindow.setSize(show(800).height, show(950).height)
});
ipcMain.on("table", (e, data) => {
  wind(1100, 900, data);
  // mainWindow.setMaximumSize(show(1100).height, show(900).height);
  // mainWindow.setMinimumSize(show(1100).height, show(900).height);
  // mainWindow.setSize(show(1100).height, show(900).height)
});
ipcMain.on("middle", (e, data) => {
  wind(700, 800, data);
  // mainWindow.setMaximumSize(700, 800);
  // mainWindow.setMinimumSize(700, 800);
  // mainWindow.setSize(700, 800)
});
ipcMain.on("small", (e, data) => {
  wind(400, 830, data);

  // let width = show(400).height
  // let height = show(800).height
  // if (data) {
  //     width = parseInt(400 / devHeight * data.height)
  //     height = parseInt(800 / devHeight * data.height)
  // }

  // mainWindow.setMaximumSize(width, height);
  // mainWindow.setMinimumSize(width, height);
  // mainWindow.setSize(width, height);
});

ipcMain.on("changeFenBianLv", (e, data) => {
  mainWindow.webContents.send("changeFenBianLv", true);
});

ipcMain.on("mesasure", (e, data) => {
  mainWindow.setMaximumSize(show(400).height, show(900).height);
  mainWindow.setMinimumSize(show(400).height, show(900).height);
  mainWindow.setSize(show(400).height, show(900).height);
});

ipcMain.on("num", (event, data) => {
  /**
   * 渲染端发来的数据
   * 要把接收到的字符串每两位截取并转换成10进制的数并存进数组里
   * 把数组发给蓝牙
   */

  if (port === null) {
    return;
  }
  let arr = sendData(data.command, data.arr);
  // console.log('渲染端发来的数据并经过转化：', arr);
  port.write(arr, "hex", function (err) {
    console.log(2);
    if (err) {
      console.log("写渲染端发来的数据Error on write: ", err.message);
    } else {
      console.log("send: " + arr);
    }
    // port.close()
  });
});

// 开启 开机自启动
ipcMain.on("openAutoStart", () => {
  if (!isDev) {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: ex,
      args: [],
    });
  }
});
// 关闭 开机自启动
ipcMain.on("closeAutoStart", () => {
  if (!isDev) {
    app.setLoginItemSettings({
      openAtLogin: false,
      path: ex,
      args: [],
    });
  }
});
ipcMain.on("clickUpdateBtn", () => {
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdatesAndNotify();
});

ipcMain.on("usbdata", (event, data) => {
  /**
   *
   * 要把接收到的字符串每两位截取并转换成10进制的数并存进数组里
   * 把数组发给串口
   */

  let arr = sendData(data.command, data.arr);
  // console.log('渲染端发来的数据并经过转化：', arr);
  let sendArr = [0x00].concat(arr);
  try {
    device && device.write(sendArr);
  } catch (error) {
    console.log(error);
  }
});
//底座重新配对
ipcMain.on("qiehuan", (event, data) => {
  /**
   *
   * 要把接收到的字符串每两位截取并转换成10进制的数并存进数组里
   * 把数组发给蓝牙
   */
  console.log("进入了点击切换的函数");
  let sendArr = [
    0x00, 0x56, 0x56, 0x56, 0x56, 0x56, 0x56, 0x56, 0x56, 0x56, 0x56,
  ];
  device && device.write(sendArr);
  device = null;
});

ipcMain.on("keyboardWriting", (event, data) => {
  if (data) {
    const timer = setTimeout(() => {
      console.log(`'开始去写：${data}`);
      // keyboard.type(`${data}`)
      keyboardWritingFun(data);
      clearTimeout(timer);
    }, 500);
  }
});

//进入升级状态
ipcMain.on("enterUpgrade", (event, data) => {
  /**
   *
   * 要把接收到的字符串每两位截取并转换成10进制的数并存进数组里
   * 把数组发给串口
   */

  let arr = sendData(data.command, data.arr);
  // console.log('升级指令转化：', arr);
  let sendArr = [0x00].concat(arr);
  try {
    // console.log('升级指令转化：', device, arr);
    device && device.write(sendArr);
    enterUpgradeFlog = true;
  } catch (error) {
    console.log(error);
    upload = false;
    enterUpgradeFlog = false;
    mainWindow.webContents.send("uploadBaseInfo", {
      status: "error1",
      data: "",
    });
  }
});
//进入升级状态
ipcMain.on("startUpload", (event, data) => {
  /**
   *
   * 要把接收到的字符串每两位截取并转换成10进制的数并存进数组里
   * 把数组发给串口
   */

  enterUpgradeFlog = true;
});
//打开开发者选项
ipcMain.on("openDevTools", () => {
  mainWindow.webContents.openDevTools();
});

// const timerr = setTimeout(() => {
//     console.log('----------', app.getAppPath('cache'));
//     let dirPath = path.join(__dirname, 'binfile')
//     console.log('--文件夹地址', dirPath);
//     if (!fs.existsSync(dirPath)) {   //以同步的方法检测目录是否存在。 如果目录存在 返回true,如果目录不存在 返回false
//         fs.mkdirSync(dirPath);
//         console.log("文件夹创建成功");
//     } else {
//         console.log("文件夹已存在");
//     }
//     let url = 'http://ec2-3-214-224-72.compute-1.amazonaws.com:18886/group1/image/2_no_aes_ota_MellaPro_Charger(1).bin'
//     let fileName = '1.bin';
//     let stream = fs.createWriteStream(path.join(dirPath, fileName));
//     request(url).pipe(stream).on("close", function (err) {
//         console.log("第", "个文件[" + fileName + "]下载完毕");
//     });

//     clearTimeout(timerr)
// }, 5000);

//发送了底座升级指令
let dataArr = new Array(),
  sendNum = 0;
ipcMain.on("updateBase", (event, data) => {
  let fileUrl = `${path.join(
    __dirname,
    "./build/2_no_aes_ota_MellaPro_Charger(1).bin"
  )}`;
  if (data.state === "reset") {
    fileUrl = `${path.join(__dirname, "./build/reset.bin")}`;
  }

  let newData = fileUrl.replace(/\\/g, "/");

  let fsData = fs.readFileSync(newData);
  file = fsData.toString("hex");

  if (!file) {
    mainWindow.webContents.send("uploadBaseInfo", {
      status: "error",
      data: "Upgrade file not found",
    });
  } else {
    let arr = [];
    for (let i = 0; i < file.length; i = i + 2) {
      arr.push(parseInt(`${file[i]}${file[i + 1]}`, 16));
    }

    dataArr = new Array();
    console.log(arr);
    for (let i = 0; i < arr.length / 64; i++) {
      let end = (i + 1) * 64 > arr.length ? arr.length : (i + 1) * 64;

      let value = [0x00].concat(arr.slice(i * 64, end));
      // dataArr = dataArr.push(value)
      dataArr[i] = value;
    }
    upload = true;
    enterUpgradeFlog = false;
    sendNum = 0;
    sendUpload();
    enterUpgradeFlog = true;
  }
  // console.log('----发送的数据', file);
});
ipcMain.on("reUpload", (event, data) => {
  console.log("结束了");
  upload = false;
  enterUpgradeFlog = false;
  sendNum = 0;
});

function sendUpload(params) {
  console.log(sendNum);
  if (sendNum < dataArr.length) {
    let value = dataArr[sendNum++];
    console.log("---升级发送的代码", value);

    device.write(value);
    let progress = parseFloat(((sendNum / dataArr.length) * 100).toFixed(2));

    mainWindow.webContents.send("uploadBaseInfo", {
      status: "normal",
      data: `Upgrade progress：${progress}%`,
      progress,
    });
    // if (`${progress}` !== '100.00') {

    // } else {
    //     // upload = false
    //     mainWindow.webContents.send('uploadBaseInfo', { status: 'success', data: `update successed` })
    // }
    if (`${progress}` === "100.00") {
      upload = false;
    }
  } else {
    upload = false;
  }
}

/**
 *
 * 先全选，然后输入传进来的数据
 * @param {String} val
 *
 */
async function keyboardWritingFun(val) {
  keyboard.config.autoDelayMs = 20;
  if (process.platform === "darwin") {
    console.log("这是mac");
    // await keyboard.pressKey(Key.LeftSuper, Key.A);
    // await keyboard.releaseKey(Key.LeftSuper, Key.A);
    await keyboard.type(`${val}`);
  } else {
    // await keyboard.pressKey(Key.LeftControl, Key.A);
    // await keyboard.releaseKey(Key.LeftControl, Key.A);
    await keyboard.type(`${val}`);
  }
}

module.exports = mainWindow;

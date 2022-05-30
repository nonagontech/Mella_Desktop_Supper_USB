
/**
 * 
 * 获取屏幕分辨率宽高
 * let width = parseInt(window.screen.width)
 * let height = parseInt(window.screen.height)
 * 
 * 获取应用窗口大小
 * document.documentElement.clientHeight
 * document.documentElement.clientWidth
 */
//

//

const devWidth = 1920;
const devHeight = 1040;

// let size = window.screen
// console.log('-------------------------分辨率的大小-----------------', size);
let width = parseInt(window.screen.width)
let height = parseInt(window.screen.height)
if (width < height) {
  let a = width
  width = height
  height = a
}


export const px = (val) => {


  let width = parseInt(window.screen.width)
  let height = parseInt(window.screen.height)

  // console.log('px', width, height)






  // if ((width === 2560 && height === 1440) || (width === 1440 && height === 2560)) {
  //   width = 1920
  //   height = 1080
  // }

  if (width < height) {
    let a = width
    width = height
    height = a
  }

  return parseInt(val / devWidth * width)
}

export const mTop = (val) => {
  let width = parseInt(window.screen.width)
  let height = parseInt(window.screen.height)
  if (width < height) {
    let a = width
    width = height
    height = a
  }


  // console.log('mTop',val, parseInt(val / devHeight * height))
  return parseInt(val / devHeight * height)
}

export const fs = (val) => {
  let width = parseInt(window.screen.width)
  let height = parseInt(window.screen.height)
  if (width < height) {
    let a = width
    width = height
    height = a
  }
}
export const pX = (val) => {
  let windowWidth = document.documentElement.clientWidth
  // console.log('px', window.screen,)
  return parseInt(windowWidth / 650 * val)
}
export const MTop = (val) => {
  let windowWidth = document.documentElement.clientHeight
  console.log('px', windowWidth)
  return parseInt(windowWidth / 375 * val)
}

let windowssize = {
  width: 0,
  height: 0
}

export const win = () => {
  let width = parseInt(window.screen.width)
  let height = parseInt(window.screen.height)
  if (width < height) {
    let a = width
    width = height
    height = a
  }
  // let win1 = JSON.stringify({
  //   width, height
  // })


  return {
    width, height
  }
}

let timer = null
export const timerFun = () => {
  console.log('jianting1------------');
  timer && clearInterval(timer)
  timer = setInterval(() => {
    let width = parseInt(window.screen.width)
    let height = parseInt(window.screen.height)
    if (width < height) {
      let a = width
      width = height
      height = a
    }
    // console.log('jianting1', windowssize, { width, height });
    if (width !== windowssize.width || height !== windowssize.height) {
      windowssize.width = width
      windowssize.height = height
      let ipcRenderer = window.electron.ipcRenderer
      ipcRenderer.send('changeFenBianLv', windowssize)
    }
  }, 2000);

}
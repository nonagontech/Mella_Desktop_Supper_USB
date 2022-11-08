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

let size = window.screen
// console.log('-------------------------分辨率的大小-----------------', size);
let width = parseInt(window.screen.availWidth);
let height = parseInt(window.screen.availHeight);
if (width < height) {
  let a = width;
  width = height;
  height = a;
}

export const px = (val) => {
  return val
};

export const mTop = (val) => {
  return val
};

export const fs = (val) => {
  let width = parseInt(window.screen.availWidth);
  let height = parseInt(window.screen.availHeight);
  if (width < height) {
    let a = width;
    width = height;
    height = a;
  }
};
export const pX = (val) => {
  let windowWidth = document.documentElement.clientWidth;
  // console.log('px', window.screen,)
  return parseInt((windowWidth / 650) * val);
};
export const MTop = (val) => {
  return val
};

let windowssize = {
  width: 0,
  height: 0,
};

export const win = () => {
  let width = parseInt(window.screen.availWidth);
  let height = parseInt(window.screen.availHeight);
  if (width < height) {
    let a = width;
    width = height;
    height = a;
  }
  return {
    width: 1920,
    height: 1080,
  };
};

let timer = null;
export const timerFun = () => {

};

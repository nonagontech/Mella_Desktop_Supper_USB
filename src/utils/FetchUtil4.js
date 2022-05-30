
let COMMON_URL = 'https://www.mellaserver.com/big/mellabiggie';//内部负载均衡

//let COMMON_URL = 'http://34.206.181.105:31668/mellabiggie';//内部负载均衡

// let COMMON_URL = 'http://192.168.0.36:9090/mellabiggie';//本地测试
let token = '';


export async function fetchRequest4 (url, method, params = '', Authorization = '', isLogin) {

  // if (isLogin) {

  //     COMMON_URL = 'http://34.206.181.105:31667/mellaserver'
  // } else {
  //     COMMON_URL = 'https://www.mellaserver.com/big/mellabiggie'
  // }
  console.log(COMMON_URL, url);
  if (method === 'GET' || method === 'DELETE') {
    let header = {
      'Content-Type': 'application/x-www-form-urlencoded'
    };
    if (params == '') {
      return new Promise(function (resolve, reject) {
        fetch(COMMON_URL + url, {
          headers: {
            Authorization
          },
          method: method,
        }).then((Response) => Response.json())
          .then((responseData) => {
            resolve(responseData)
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      // 定一个空数组
      let paramsArray = [];
      //  拆分对象
      Object.keys(params).forEach(key =>
        paramsArray.push(key + "=" + params[key])
      );
      // 判断是否地址拼接的有没有 ？,当没有的时候，使用 ？拼接第一个参数，如果有参数拼接，则用&符号拼接后边的参数   
      if (url.search(/\?/) === -1) {
        url = url + "?" + paramsArray.join("&");
      } else {
        url = url + "&" + paramsArray.join("&");
      }
      console.log(COMMON_URL + url);
      return new Promise(function (resolve, reject) {
        fetch(COMMON_URL + url, {
          method: method,
          headers: {
            "Content-Type": 'text/plain',
            Authorization
          },

        }).then((response) => response.json())
          .then((responseData) => {
            resolve(responseData);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  } else {
    let header = {
      "Content-type": "application/json",
      Authorization
    };
    if (params == '') {
      return new Promise(function (resolve, reject) {
        fetch(COMMON_URL + url, {
          method: method,
          headers: header,
          body: JSON.stringify(params),
        }).then((Response) => Response.json())
          .then((responseData) => {
            resolve(responseData)
          })
          .catch((err) => {
            reject(err);
          });
      });
    } else {
      return new Promise(function (resolve, reject) {
        fetch(COMMON_URL + url, {
          method: method,
          headers: header,
          body: JSON.stringify(params),
        })
          .then((response) => response.json())
          .then((responseData) => {
            resolve(responseData);
          })
          .catch((err) => {
            reject(err);
          });
      });
    }
  }
}

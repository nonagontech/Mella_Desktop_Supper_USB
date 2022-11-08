

// let COMMON_URL = '';
// let COMMON_URL = 'https://api.trial.ezyvet.com/v1';
let COMMON_URL = process.env.REACT_APP_EZYVET_BASE_URL
let token = '';

//'/v1/appUser/login', 'POST', params
export function FetchEzyVet(url, method, params = '', token = '') {

    if (method === 'GET' || method === 'DELETE') {
        let headers = null
        if (token !== '') {
            headers = {
                'authorization': token,
            };
        }
        if (params === '') {
            return new Promise(function (resolve, reject) {
                fetch(COMMON_URL + url, {
                    method: method,
                    headers
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
            return new Promise(function (resolve, reject) {
                fetch(COMMON_URL + url, {
                    method: method,
                    headers: {
                        "Content-Type": 'text/plain'
                    }
                }).then((response) => response.json())
                    .then((responseData) => {
                        resolve(responseData);
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });
        }
    } else if (method === 'POST') {
        let header = {
            "Content-type": "application/json"
        };
        if (params === '') {
            return new Promise(function (resolve, reject) {
                fetch(COMMON_URL + url, {
                    method: method,
                    headers: header
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
                    // mode: 'cors',
                    headers: header,
                    body: JSON.stringify(params),
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
            "Content-type": "application/merge-patch+json",
            authorization: token
        };
        if (params == '') {
            return new Promise(function (resolve, reject) {
                fetch(COMMON_URL + url, {
                    method: method,
                    headers: header
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
                }).then((response) => response.json())
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

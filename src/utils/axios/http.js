// 封装请求
import axios from 'axios'

// 请求
const http = axios.create({
    // baseURL: "https://www.mellaserver.com/api/mellaserver",
    baseURL: "",

    timeout: 120000
})
// 请求拦截
http.interceptors.request.use(config => {
    //请求头设置
    let token = localStorage.getItem('token') || ''
    config.headers.Authorization = token
    return config
}, err => {
    console.log(err);
})
// 响应拦截
http.interceptors.response.use(arr => {
    // 对响应码的处理

    return arr.data
}, err => {
    console.log(err);

    return Promise.reject(err);
})
// 返出
// export default http

function request ({ method = "get", url, data = {}, params = {} }) {
    return http({
        method,
        url,
        data,
        params,
    })


}

export default request
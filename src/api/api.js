/**
 * @file api.js
 * @author 胡邵杰
 * @date 2022/08/19
 * @update 2022/08/19
 * @desc 对axios的封装
 */
import axios from 'axios'

//创建axios实例
const service = axios.create({
    baseURL: "",
    timeout: 0,
})
//请求拦截器,在请求之前做处理
service.interceptors.request.use(
    config => {
        //本地如果有token,则每次请求都带上token
        if (localStorage.getItem('token')) {
            config.headers['Authorization'] = localStorage.getItem('token')
        }

        return config
    },
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)
//响应拦截器,在响应之后做处理
service.interceptors.response.use(
    response => {
        return response
    }
    ,
    error => {
        console.log(error);
        return Promise.reject(error)
    }
)
//封装get请求
export const get = (url, params) => {
    return service({
        method: 'get',
        url,
        params,

    })
}


//封装put请求
export const put = (url, data) => {
    return service({
        method: 'put',
        url,
        data,
    })
}
//封装delete请求
export const del = (url, params) => {
    return service({
        method: 'delete',
        url,
        params,
    })
}
//封装patch请求
export const patch = (url, data) => {
    return service({
        method: 'patch',
        url,
        data,
    })
}
//封装post请求
export const postFormData = (url, data) => {
    return service({
        method: 'post',
        url,
        data,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    })
}
//封装post请求
export const postJson = (url, data) => {
    return service({
        method: 'post',
        url,
        data,
        headers: {
            'Content-Type': 'application/json'
        }
    })
}
//封装post请求
export const postFile = (url, data) => {
    return service({
        method: 'post',
        url,
        data,
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}




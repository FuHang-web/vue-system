import axios from 'axios'
import {
  MessageBox,
  Message
} from 'element-ui'
import store from '@/store'
import {
  getToken
} from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    // console.log(store.getters.token);
    // console.log(getToken());
    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error.message) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // console.log(res);

    // if the custom code is not 20000, it is judged as an error.
    if (response.data.code === 201 && response.data.data === 'unauthorized') {
      return {
        code: 1,
        data: false,
        msg: '用户不存在',
      }
    } else if (
      response.data.code === 201 &&
      response.data.data === 'invalid_exception'
    ) {
      return {
        code: 1,
        data: false,
        msg: '用户名或密码错误',
      }
    } else if ('' + response.status === '401') {
      // store.commit('SET_ROLE')
      // removeToken('admin_token')
      // router.push({
      //   name: 'login',
      //   params: {
      //     logOUt: true,
      //   },
      // })
      return {
        code: 1,
        data: false,
        msg: '请先登录',
      }
    } else if ('' + response.status === '403') {
      return Message.error('资源不存在')
    } else if ('' + response.status === '404') {
      return Message.error('资源不存在')
    } else if ('' + response.status === '500') {
      return Message.error('服务器或者接口参数错误')
    } else if ('' + response.status === '503') {
      return Message.error('服务器错误')
    } else if ('' + response.status === '200') {
      return response.data
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error.message) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

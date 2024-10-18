import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  baseURL:'http://localhost:8081/',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})


// 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log(config)
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token让每个请求都带有令牌
      // ['X-Token'] is a custom headers key 自定义标头键
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做些什么
    console.log(response) // for debug
    return response;
  },
  error => {
    // console.log('err' + error) // for debug
    const { response } = error;
    if (response) {
      switch (response.status) {
        case 401:
          // 处理未授权状态码
          handle401Error(response);
          return Promise.resolve({ success: false, message: 'Unauthorized' });
          break;
        case 500:
          // 处理服务器内部错误
          handle500Error(response);
          break;
        case 403:
          // 处理权限不足
          break;
        case 404:
          // 处理资源未找到
          break;
        default:
          // 其他错误处理
          console.error('Error:', response.status, response.data);
          break;
      }
    } else {
      // 处理网络错误或其他情况
      console.error('Network Error:', error.message);
    }
    return Promise.reject(new Error('请求失败'));
  }
);

function handle401Error(response){
  // 权限不对
  // console.error('Unauthorized:', response.data.message || 'Unauthorized');
  // 清除 token 并跳转到登录页面
  store.dispatch('user/resetToken')
}

function handle500Error(response) {
  // 处理 500 错误的具体逻辑
  // console.error('Server Error:', response.data.message || 'Internal Server Error');
  // 显示错误提示
  alert('用户名或密码错误');
  // 或者使用全局提示库（如 Element UI 的 Message）
  // this.$message.error('服务器内部错误，请稍后再试。');

}


export default service

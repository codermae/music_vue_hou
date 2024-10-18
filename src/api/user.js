import request from '@/utils/request'

export function login(data) {
  console.log(data)
  return request({
    url: '/user/login/back',
    method: 'post',
    data,
    baseURL:'http://localhost:8081/'
  })
  // .then(response => {
  //   if(!response.success) {
  //     return { success: false, message: response.message };
  //   }
  //   return response;
  // }).catch(error => {
  //   // Check if the error is a 401 Unauthorized error
  //   if (error.response && error.response.status === 401) {
  //     // Return a resolved promise to suppress the console error
  //     return { success: false, message: 'Unauthorized' };
  //   } else {
  //     console.error('Login Failed:', error.message);
  //     throw new Error('登录失败，请检查输入信息。');
  //   }
  // })
}

export function getInfo(token) {
  return request({
    // url: '/vue-admin-template/user/info',
    url:'/user/login/userinfo',
    method: 'get',
    headers:{
      'ignoreInterceptor': 'true'
    },
    params: { token },
    baseURL:'http://localhost:8081/'
  })
}

export function logout() {
  return request({
    // url: '/vue-admin-template/user/logout',
    url:'/user/login/out',
    method: 'post'
  })
}

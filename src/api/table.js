import request from '@/utils/request'

// export function getList(params) {
//   return request({
//     url: '/vue-admin-template/table/list',
//     method: 'get',
//     params
//   })
// }

export function getList() {
  return request({
    url: '/user',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
}

export function updateItem(id,info){
  console.log(info)
  return request({
    url: '/user/'+id,
    method: 'put',
    data:info,
    baseURL:'http://localhost:8081/'
  })
}

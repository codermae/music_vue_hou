import request from '@/utils/request'

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

export function delItem(id){
  return request({
    url:'/user/'+id,
    method:'delete',
    baseURL:'http://localhost:8081/'
  })
}

export function createItem(info) {
  return request({
    url:'/user',
    method:'post',
    data:info,
    baseURL:'http://localhost:8081/'
  })
}

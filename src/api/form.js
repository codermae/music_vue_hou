import request from '@/utils/request'

export function getList() {
  return request({
    url: '/artists',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
}
export function updateItem(id,info){
  // console.log(info)
  return request({
    url: '/artists/'+id,
    method: 'put',
    data:info,
    baseURL:'http://localhost:8081/'
  })
}

export function delItem(id){
  return request({
    url:'/artists/'+id,
    method:'delete',
    baseURL:'http://localhost:8081/'
  })
}

export function createItem(info) {
  return request({
    url:'/artists',
    method:'post',
    data:info,
    baseURL:'http://localhost:8081/'
  })
}

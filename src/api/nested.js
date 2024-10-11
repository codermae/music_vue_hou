import request from '@/utils/request'

export function getList() {
  return request({
    url: '/songs/all',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
}

export function createItem(info) {
  return request({
    url: '/songs',
    method:'post',
    baseURL:'http://localhost:8081/',
    data:info
  })
}

export function updateItem(id,info){
  return request({
    url: '/songs/'+id,
    method: 'put',
    data:info,
    baseURL:'http://localhost:8081/'
  })
}

export function delItem(id) {
  return request({
    url: '/songs/'+id,
    method: 'delete',
    baseURL:'http://localhost:8081/'
  })
}

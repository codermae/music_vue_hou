import request from '@/utils/request'

export function getData() {
  return request({
    url: '/data',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
}

export function getLine() {
  return request({
    url: '/data/line',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
}

export function getGenre() {
  return request({
    url: '/data/genre',
    method: 'get',
    baseURL:'http://localhost:8081/'
  })
  }

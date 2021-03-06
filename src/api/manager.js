import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/manager/index',
    method: 'get',
    params: query
  })
}

export function fetchManager(id) {
  return request({
    url: '/api/manager/show',
    method: 'get',
    params: { id }
  })
}

export function createManager(data) {
  return request({
    url: '/api/manager/store',
    method: 'post',
    data
  })
}

export function updateManager(data) {
  return request({
    url: '/api/manager/update/' + data.id,
    method: 'put',
    data
  })
}

export function deleteManager(id) {
  return request({
    url: '/api/manager/delete/' + id,
    method: 'delete'
  })
}

import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/message/index',
    method: 'get',
    params: query
  })
}

export function fetchMessage(id) {
  return request({
    url: '/api/message/show/' + id,
    method: 'get'
  })
}

export function createMessage(data) {
  return request({
    url: '/api/message/store',
    method: 'post',
    data
  })
}

export function updateMessage(data) {
  return request({
    url: '/api/message/update/' + data.id,
    method: 'put',
    data
  })
}

export function deleteMessage(id) {
  return request({
    url: '/api/message/delete/' + id,
    method: 'delete'
  })
}

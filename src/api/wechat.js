import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/wechat/index',
    method: 'get',
    params: query
  })
}

export function fetchWechat(id) {
  return request({
    url: '/api/wechat/show/' + id,
    method: 'get'
  })
}

export function createWechat(data) {
  return request({
    url: '/api/wechat/store',
    method: 'post',
    data
  })
}

export function updateWechat(data) {
  return request({
    url: '/api/wechat/update/' + data.id,
    method: 'put',
    data
  })
}

export function deleteWechat(id) {
  return request({
    url: '/api/wechat/delete/' + id,
    method: 'delete'
  })
}

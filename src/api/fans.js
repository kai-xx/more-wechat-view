import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/fans/index',
    method: 'get',
    params: query
  })
}

export function tagList(query) {
  return request({
    url: '/api/fans/tagList',
    method: 'get',
    params: query
  })
}
export function updateFans(query) {
  return request({
    url: '/api/wechatApi/updateFans',
    method: 'post',
    params: query
  })
}

export function updateTags(query) {
  return request({
    url: '/api/wechatApi/updateTags',
    method: 'post',
    params: query
  })
}

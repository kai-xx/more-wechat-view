import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/fans/index',
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

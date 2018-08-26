import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/industry/index',
    method: 'get',
    params: query
  })
}

export function updateIndustry(query) {
  return request({
    url: '/api/wechatApi/updateIndustry',
    method: 'post',
    params: query
  })
}

export function fetchMessage(id) {
  return request({
    url: '/api/industry/show/' + id,
    method: 'get'
  })
}
export function sendIndustryMessage(data) {
  return request({
    url: '/api/wechatApi/sendIndustryMessage',
    method: 'post',
    data
  })
}

export function updateMessage(data) {
  return request({
    url: '/api/industry/update/' + data.id,
    method: 'put',
    data
  })
}
export function sendLog(query) {
  return request({
    url: '/api/industry/sendLog',
    method: 'get',
    params: query
  })
}


import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/menu/index',
    method: 'get',
    params: query
  })
}

export function fetchMenu(id) {
  return request({
    url: '/api/menu/show/' + id,
    method: 'get'
  })
}

export function createMenu(data) {
  return request({
    url: '/api/menu/store',
    method: 'post',
    data
  })
}

export function updateMenu(data) {
  return request({
    url: '/api/menu/update/' + data.id,
    method: 'put',
    data
  })
}
export function deleteMenu(id) {
  return request({
    url: '/api/menu/delete/' + id,
    method: 'delete'
  })
}


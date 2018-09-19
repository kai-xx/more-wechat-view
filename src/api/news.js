import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/api/news/index',
    method: 'get',
    params: query
  })
}

export function fetchNews(id) {
  return request({
    url: '/api/news/show/' + id,
    method: 'get'
  })
}

export function createNews(data) {
  return request({
    url: '/api/news/store',
    method: 'post',
    data
  })
}

export function updateNews(data) {
  return request({
    url: '/api/news/update/' + data.id,
    method: 'put',
    data
  })
}
export function showDetail(id) {
  return request({
    url: '/api/showDetail/' + id,
    method: 'get'
  })
}
export function deleteNews(id) {
  return request({
    url: '/api/news/delete/' + id,
    method: 'delete'
  })
}


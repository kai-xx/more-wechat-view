import request from '@/utils/request'

export function loginByUsername(login_name, password) {
  const data = {
    login_name,
    password
  }
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function logout(token) {
  return request({
    url: '/api/auth/logout',
    method: 'post',
    params: { token }
  })
}

export function getUserInfo(token) {
  return request({
    url: '/api/auth/info',
    method: 'get',
    params: { token }
  })
}


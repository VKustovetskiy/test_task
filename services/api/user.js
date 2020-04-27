import api from './api'

export function getUserList(params) {
  return api.get('api', { params })
}

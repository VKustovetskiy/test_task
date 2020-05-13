import { getUserList } from '~/services/api/user'

const initialState = () => ({
  userList: []
})

const users = {
  state: initialState,
  mutations: {
    SET_USER_LIST (state, payload) {
      state.userList = payload
    },

    EXTEND_USER_LIST (state, payload) {
      state.userList = [...state.userList, ...payload]
    }
  },
  actions: {
    async getUserList ({ commit }, params) {
      const { filters, pagination } = params
      const payload = {
        inc: 'gender,name,email,dob,picture',
        ...pagination,
        ...filters,
        gender: filters && filters.gender !== 'any' ? filters.gender : null
      }
      const response = await getUserList(payload)

      commit('SET_USER_LIST', response.data.results)
    },

    async loadMoreUsers ({ commit }, params) {
      const { filters, pagination } = params
      const payload = {
        inc: 'gender,name,email,dob,picture',
        ...pagination,
        ...filters,
        gender: filters && filters.gender !== 'any' ? filters.gender : null
      }
      const response = await getUserList(payload)

      commit('EXTEND_USER_LIST', response.data.results)
    }
  },
  getters: {
    getUserList: state => state.userList
  }
}

export default users

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
    async GET_USER_LIST ({ commit }, params) {
      const response = await getUserList(params)

      commit('SET_USER_LIST', response.data.results)
    },

    async LOAD_MORE_USERS ({ commit }, params) {
      const response = await getUserList(params)

      commit('EXTEND_USER_LIST', response.data.results)
    }
  },
  getters: {
    getUserList: state => state.userList
  }
}

export default users

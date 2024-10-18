import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import { Message } from 'element-ui'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    currentName:''
  }
}

const state = getDefaultState()

const getters = {
  getCurrentName: state => state.currentName
}

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_CURRENTNAME: (state, name) => {
    state.currentName = name
  },
}

const actions = {
  changeCurrentName({ commit }, name) {
    commit('SET_CURRENTNAME', name)
  },
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password_hash: password }).then(response => {
        // console.log(response)
        // If unauthorized, handle it gracefully
        if (response.success === false) {
          Message.error('登陆失败，请检查输入信息');
          return resolve(); // Resolve to avoid rejection and console error
        }
        const { data } = response
        commit('SET_CURRENTNAME', data.username)
        commit('SET_TOKEN', data.token)
        setToken(data.token)
        resolve()
      })
      .catch(error => {
        // Message.error('登陆失败，请检查输入信息2')
        Message.error(error.message);
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      // console.log(state)
      getInfo(state.token).then(response => {
        // console.log('------------------------getinfo-----------------------------')
        // console.log(response)
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
}


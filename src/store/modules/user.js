import {
  login,
  logout,
  getInfo
} from '@/api/user'
import {
  getToken,
  setToken,
  removeToken,
  getUser,
  setUser
} from '@/utils/auth'
import {
  resetRouter
} from '@/router'
import {
  Message
} from 'element-ui'
const getDefaultState = () => {
  return {
    token: getToken() ? getToken() : '',
    name: '',
    avatar: '',
    user: getUser() ? JSON.parse(getUser()) : {},
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    console.log(token,'token');
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_USER: (state, userInfo) => {
    state.user = userInfo
  }
}

const actions = {
  // user login
  login({
    commit
  }, userInfo) {
    const {
      username,
      password,
      captcha
    } = userInfo
    return new Promise(async (resolve, reject) => {
      const loginRes = await login({
        username: username.trim(),
        password: password,
        captcha: captcha
      }).catch(error => {
        reject(error)
      })
      if (loginRes.code !== 200) {
        Message({
          message: loginRes.message,
          type: 'error',
          duration: 5 * 1000
        })
        reject(loginRes)
        return
      }
      Message({
        message: loginRes.message,
        type: 'success',
        duration: 5 * 1000
      })
      console.log(loginRes);
      commit('SET_TOKEN', loginRes.data.token)
      commit('SET_USER', loginRes.data)
      setToken(loginRes.data.token)
      setUser(loginRes.data)
      resolve()
      // .then(response => {
      //   const { data } = response
      //   commit('SET_TOKEN', data.token)
      //   setToken(data.token)
      //   resolve()
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },

  // get user info
  getInfo({
    commit,
    state
  }) {
    return new Promise((resolve, reject) => {
      getInfo({
        id: state.user.id
      }).then(response => {
        console.log(response);
        const {
          data
        } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const {
          name,
          avatar
        } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({
    commit,
    state
  }) {
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
  resetToken({
    commit
  }) {
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
  actions
}

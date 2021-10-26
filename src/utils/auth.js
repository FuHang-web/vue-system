import Cookies from 'js-cookie'

export function getToken() {
  return Cookies.get('lc_token')
}

export function setToken(token) {
  console.log(token);
  return Cookies.set('lc_token', token)
}

export function removeToken() {
  return Cookies.remove('lc_token')
}

export function getUser() {
  return Cookies.get('lc_user')
}

export function setUser(user) {
  console.log(user);
  // localStorage.setItem('user', user)
  return Cookies.set('lc_user', user)
}

import request from '@/utils/request'

// 获取验证码
export function getCaptcha(data = {}) {
  return request({
    method: 'GET',
    url: '/captcha/getCode',
    params: data,
  })
}

// 校验验证码
export function checkCaptcha(data = {}) {
  return request({
    method: 'POST',
    url: '/captcha/checkCode',
    data,
  })
}
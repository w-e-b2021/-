import axios from 'axios'
import { message } from 'antd'
import store from '../redux/store'
import { changLoading } from '../redux/createActions'

axios.defaults.baseURL = 'http://localhost:5000'
axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'

axios.interceptors.request.use(config => {
  store.dispatch(changLoading(true))
  return config
})

axios.interceptors.response.use(
  res => {
    store.dispatch(changLoading(false))
    if (res.status > 300) {
      if (res.data.message) {
        message.error(res.data.message)
      } else {
        message.error('请求出错!')
      }
      return Promise.reject(res.data)
    }
    return res.data
  },
  err => {
    store.dispatch(changLoading(false))
    message.error('请求出错!')
    return err
  }
)

export default axios

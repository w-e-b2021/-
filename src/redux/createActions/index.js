const getForm = value => {
  return {
    type: 'getForm',
    data: value
  }
}
const getUserInfo = value => {
  return {
    type: 'getUserInfo',
    data: value
  }
}
const removeUserInfo = () => {
  return {
    type: 'removeUserInfo'
  }
}

const changLoading = value => {
  return {
    type: 'changLoading',
    data: value
  }
}

export { getForm, getUserInfo, removeUserInfo, changLoading }

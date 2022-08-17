export default function index(prevState = { userInfo: {} }, actions) {
  let newState = { ...prevState }
  switch (actions.type) {
    case 'changeUserInfo':
      newState.userInfo = { ...newState.userInfo, ...actions.data }
      return newState
    case 'getUserInfo':
      newState.userInfo = actions.data
      return newState
    case 'removeUserInfo':
      newState.userInfo = {}
      return newState
    default:
      return newState
  }
}

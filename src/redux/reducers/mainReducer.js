import { fromJS } from 'immutable'

export default function Main(preState = { loading: false }, actions) {
  let newPreState = fromJS(preState).toJS()
  switch (actions.type) {
    case 'changLoading':
      newPreState.loading = actions.data
      return newPreState
    default:
      return newPreState
  }
}

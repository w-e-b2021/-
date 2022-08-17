import { fromJS } from 'immutable'
export default function reducer(preState = { form: {} }, actions) {
  let newPreState = fromJS(preState).toJS()
  switch (actions.type) {
    case 'getForm':
      newPreState.form = actions.data
      return newPreState
    default:
      return newPreState
  }
}

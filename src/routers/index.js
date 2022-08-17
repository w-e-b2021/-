import React from 'react'
import { HashRouter, Redirect, Route, Switch } from 'react-router-dom'
import Login from '../views/Login'
import NewSandBox from '../views/Sandbox/NewSandBox.jsx'
import News from '../views/News/News'
import Detail from '../views/News/Detail'

export default function Index() {
  return (
    <div>
      <HashRouter>
        <Switch>
          <Route path='/login' component={Login}></Route>
          <Route path='/news' component={News} />
          <Route path='/detail/:id' component={Detail} />
          <Route
            path='/'
            render={props => {
              return localStorage.getItem('token') ? (
                <NewSandBox {...props}></NewSandBox>
              ) : (
                <Redirect to='/login'></Redirect>
              )
            }}
          ></Route>
        </Switch>
      </HashRouter>
    </div>
  )
}

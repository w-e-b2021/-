import React, { useEffect, useRef, useState } from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
// import { Spin } from 'antd'
import { connect } from 'react-redux'
import axios from '../../util/axios'
import NProgress from 'nprogress'
import SideMenu from '../../components/SideMenu'
import TopHeader from '../../components/TopHeader'
import Home from './Home'
import UserList from './UserList'
import RoleList from './RoleList'
import PowerList from './PowerList'
import NewsWriting from './NewsWriting'
import Draft from './Draft'
import NewsCategory from './NewsCategory'
import AuditNews from './AuditNews'
import AuditList from './AuditList'
import Unpublished from './Unpublished'
import Published from './Published'
import Sunset from './Sunset'
import Nopermission from './Nopermission'
import PreviewNews from './PreviewNews'
import UpdateNews from './UpdateNews'
// import Test from '../../components/Test'
import './NewSandBox.css'
import 'nprogress/nprogress.css'

import { Layout } from 'antd'
const { Content } = Layout
let routeObj = {
  '/home': Home,
  '/user-manage/list': UserList,
  '/right-manage/role/list': RoleList,
  '/right-manage/right/list': PowerList,
  '/news-manage/add': NewsWriting,
  '/news-manage/draft': Draft,
  '/news-manage/category': NewsCategory,
  '/audit-manage/audit': AuditNews,
  '/audit-manage/list': AuditList,
  '/publish-manage/unpublished': Unpublished,
  '/publish-manage/published': Published,
  '/publish-manage/sunset': Sunset,
  '/news-manage/preview/:id': PreviewNews,
  '/news-manage/update/:id': UpdateNews
}

function NewSandBox(props) {
  //使用connect后父组件更新子组件不更新
  //这样做后SideMenu就会更新,当然是在SideMenu使用connect后，正常父组件更新子组件就会更新
  let a = useRef(1)
  a.current++

  NProgress.start()
  let {
    userInfo: {
      role: { rights }
    }
  } = props
  const [collapsed, setCollapsed] = useState(false)
  let [routerList, setRouterList] = useState([])
  useEffect(() => {
    Promise.all([axios.get('/rights'), axios.get('/children')]).then(res => {
      setRouterList([...res[0], ...res[1]])
    })
  }, [])
  useEffect(() => {
    NProgress.done()
  })
  const checkPermisson = item => {
    return (item?.pagepermisson || item.routepermisson) && routeObj[item.key]
  }
  const checkRights = item => {
    return rights.includes(item.key)
  }
  return (
    <Layout style={{ height: '100vh' }}>
      <SideMenu collapsed={collapsed} {...props} a={a.current}></SideMenu>
      <Layout className='site-layout'>
        <TopHeader collapsed={collapsed} setCollapsed={setCollapsed}></TopHeader>
        <Content
          className='site-layout-background'
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280
          }}
        >
          {/* <Test></Test> */}
          {/* <Spin spinning={props.loading} style={{ height: '100%' }}> */}
          <Switch>
            {routerList.map(item => {
              if (checkRights(item) && checkPermisson(item)) {
                return <Route path={item.key} component={routeObj[item.key]} key={item.key}></Route>
              }
              return null
            })}
            <Redirect from='/' to='/home' exact></Redirect>
            {routerList.length ? <Route component={Nopermission}></Route> : undefined}
            {/* <Route path='*' component={Nopermission}></Route> */}
          </Switch>
          {/* </Spin> */}
        </Content>
      </Layout>
    </Layout>
  )
}

// function myConnect(callback, obj) {
//   let storeProps = callback({ userInfoReducer: { userInfo: JSON.parse(localStorage.getItem('token'))[0] } })
//   let dispatchProps = obj
//   return function (Component) {
//     return function (props) {
//       return <Component {...storeProps} {...dispatchProps} {...props}></Component>
//     }
//   }
// }

export default connect(
  state => {
    return {
      userInfo: state.userInfoReducer.userInfo,
      loading: state.mainReducer.loading
    }
  },
  {
    getTest() {
      return {
        type: 'getDispatch',
        data: 12
      }
    }
  }
)(NewSandBox)

/* <Route path='/home' component={Home}></Route>
<Route path='/user-manage/list' component={UserList}></Route>
<Route path='/right-manage/role/list' component={RoleList}></Route>
<Route path='/right-manage/right/list' component={PowerList}></Route>
<Route path='/news-manage/add' component={NewsWriting}></Route>
<Route path='/news-manage/draft' component={Draft}></Route>
<Route path='/news-manage/category' component={NewsCategory}></Route>
<Route path='/audit-manage/audit' component={AuditNews}></Route>
<Route path='/audit-manage/list' component={AuditList}></Route>
<Route path='/publish-manage/unpublished' component={Unpublished}></Route>
<Route path='/publish-manage/published' component={Published}></Route>
<Route path='/publish-manage/sunset' component={Sunset}></Route> */

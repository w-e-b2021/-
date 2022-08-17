import React, { useEffect, useState } from 'react'
import { UploadOutlined, HomeOutlined, VideoCameraOutlined } from '@ant-design/icons'
import { Layout, Menu } from 'antd'
import { useHistory } from 'react-router-dom'
import { getRightList } from '../services'
import { connect } from 'react-redux'
const { Sider } = Layout

//icon映射表
let iconObj = {
  '/home': <HomeOutlined />,
  '/user-manage': <UploadOutlined />,
  '/right-manage': <VideoCameraOutlined />,
  '/news-manage': <VideoCameraOutlined />,
  '/audit-manage': <VideoCameraOutlined />,
  '/publish-manage': <VideoCameraOutlined />,
  '/user-manage/list': <VideoCameraOutlined />,
  '/right-manage/role/list': <VideoCameraOutlined />,
  '/right-manage/right/list': <VideoCameraOutlined />,
  '/news-manage/add': <VideoCameraOutlined />,
  '/news-manage/draft': <VideoCameraOutlined />,
  '/news-manage/category': <VideoCameraOutlined />,
  '/audit-manage/audit': <VideoCameraOutlined />,
  '/audit-manage/list': <VideoCameraOutlined />,
  '/publish-manage/unpublished': <VideoCameraOutlined />,
  '/publish-manage/published': <VideoCameraOutlined />,
  '/publish-manage/sunset': <VideoCameraOutlined />
}

function SideMenu(props) {
  let {
    userInfo: {
      role: { rights }
    }
  } = props
  let {
    push,
    location: { pathname }
  } = useHistory()
  let openPath = /^\/[^/]*/.exec(pathname)
  let [menuList, setMenuList] = useState([])
  useEffect(() => {
    async function fun() {
      let data = await getRightList()
      function filterFun(list) {
        let arr = list
          .filter(item => {
            return item.pagepermisson && rights.includes(item.key)
          })
          .map(item => {
            let obj = {
              key: item.key,
              label: item.title,
              icon: iconObj[item.key]
            }
            if (item?.children?.length) {
              obj.children = item.children
            } else {
              obj.onClick = () => {
                push(item.key)
              }
            }
            return obj
          })
        arr.forEach(item => {
          if (item?.children?.length) {
            item.children = filterFun(item.children)
          }
        })
        return arr
      }
      setMenuList(filterFun(data))
    }
    fun()
  }, [push, rights])
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div style={{ height: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <div className='logo'>全球新闻发布系统</div>
        <div style={{ flex: '1', overflow: 'auto' }}>
          <Menu
            theme='dark'
            mode='inline'
            selectedKeys={pathname}
            defaultOpenKeys={[openPath[0]]}
            items={menuList}
          />
        </div>
      </div>
    </Sider>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(SideMenu)

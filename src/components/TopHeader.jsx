import React from 'react'
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, SmileOutlined } from '@ant-design/icons'
import { Layout, Dropdown, Menu, Avatar } from 'antd'
import { useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
const { Header } = Layout

function TopHeader(props) {
  let { replace } = useHistory()
  let { userInfo } = props
  console.log(userInfo)
  let menu = (
    <Menu
      items={[
        {
          key: '1',
          label: userInfo?.role?.roleName
        },
        {
          key: '2',
          danger: true,
          label: '退出',
          icon: <SmileOutlined />,
          onClick() {
            localStorage.removeItem('token')
            replace('/')
          }
        }
      ]}
    />
  )
  return (
    <div>
      <Header
        className='site-layout-background'
        style={{
          padding: 0
        }}
      >
        {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'trigger',
          onClick: () => props.setCollapsed(!props.collapsed)
        })}
        <span>首页</span>
        <div style={{ float: 'right', marginRight: '50px' }}>
          <span style={{ marginRight: '15px' }}>
            欢迎 <b style={{ color: '#1890ff' }}>{userInfo.username}</b> 回来
          </span>
          <Dropdown overlay={menu} placement='bottomRight' trigger={['click']}>
            <Avatar shape='square' size={50} icon={<UserOutlined />} src={'https://joeschmoe.io/api/v1/random'} />
          </Dropdown>
        </div>
      </Header>
    </div>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(TopHeader)

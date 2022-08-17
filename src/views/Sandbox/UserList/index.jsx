import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Switch, Modal } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getUserList, modifyRoleState, getRegionList, deleteUser } from '../../../services'
import { fromJS } from 'immutable'
import { connect } from 'react-redux'
import MyAddModal from '../../../components/MyAddModal'
import MyUpdateModal from '../../../components/MyUpdateModal'
const { confirm } = Modal

function UserList(props) {
  let { userInfo } = props
  let [userList, setUserList] = useState([])
  let [addVisible, setAddVisible] = useState(false)
  let [updateVisible, setUpdateVisible] = useState(false)
  let [userIdForEdit, setUserIdForEdit] = useState(0)
  let [regionList, setRegionList] = useState([])
  useEffect(() => {
    async function ajax() {
      let data = await getUserList()
      if (userInfo.roleId === 1) {
        setUserList(data)
      } else {
        data = data.filter(item => {
          return item.id === userInfo.id || (item.roleId > userInfo.id && item.region === userInfo.region)
        })
        setUserList(data)
      }
    }
    ajax()
  }, [userInfo.roleId, userInfo.id, userInfo.region])
  useEffect(() => {
    async function ajax() {
      let data = await getRegionList()
      setRegionList(data)
    }
    ajax()
  }, [])
  const handleDelete = data => {
    confirm({
      title: `你确定要删除${data.username}用户吗`,
      icon: <ExclamationCircleOutlined />,
      content: `删除后${data.username}将不存在`,
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return deleteUser(data.id).then(res => {
          let newUserList = fromJS(userList).toJS()
          newUserList = newUserList.filter(item => item.id !== data.id)
          setUserList(newUserList)
        })
      },
      onCancel() {}
    })
  }
  const columns = [
    {
      title: '区域',
      dataIndex: 'region',
      filters: [
        ...regionList.map(item => {
          return {
            text: item.title,
            value: item.value
          }
        }),
        {
          text: '全球',
          value: '全球'
        }
      ],

      onFilter(value, item) {
        if (value === '全球') return item.region === ''
        return item.region === value
      },

      render(region) {
        return <strong>{region === '' ? '全球' : region}</strong>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render(role) {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username'
    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render(roleState, item) {
        return (
          <Switch
            checked={roleState}
            disabled={item.default}
            onClick={() => {
              //这里实际上不能这么改的，因为item是一个引用，改的是userList
              item.roleState = !item.roleState
              //查看桌面日志文件
              setUserList([...userList])
              modifyRoleState({ id: item.id, roleState: item.roleState })
            }}
          ></Switch>
        )
      }
    },
    {
      title: '操作',
      render(item) {
        return (
          <Space>
            <Button
              disabled={item.default}
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleDelete(item)
              }}
            ></Button>
            <Button
              disabled={item.default}
              type='primary'
              icon={<UnorderedListOutlined />}
              onClick={() => {
                setUpdateVisible(true)
                props.form.setFieldsValue(item)
                setUserIdForEdit(item.id) //当点击编辑按钮时能获取用户id
              }}
            ></Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Button
        type='primary'
        onClick={() => {
          setAddVisible(true)
        }}
      >
        添加用户
      </Button>
      <MyAddModal
        visible={addVisible}
        setUserList={setUserList}
        userList={userList}
        onCreate={() => {
          setAddVisible(false)
        }}
        onCancel={() => {
          setAddVisible(false)
        }}
      />
      <MyUpdateModal
        userIdForEdit={userIdForEdit}
        visible={updateVisible}
        setUserList={setUserList}
        userList={userList}
        onCreate={() => {
          setUpdateVisible(false)
        }}
        onCancel={() => {
          setUpdateVisible(false)
        }}
      />
      <Table
        //item是每一行的数据，这个回调有多少行就被调用多少次，返回值当做当前行的key属性值
        rowKey={item => {
          return item.id
        }}
        columns={columns}
        dataSource={userList}
        pagination={{ pageSize: 5 }}
      ></Table>
    </div>
  )
}
export default connect(state => {
  return {
    form: state.userListReducer.form,
    userInfo: state.userInfoReducer.userInfo
  }
})(UserList)

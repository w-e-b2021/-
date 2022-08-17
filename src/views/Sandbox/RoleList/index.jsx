import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Modal, Tree } from 'antd'
import { DeleteOutlined, UnorderedListOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { getroleList, getRightList, modifyRoleListOfRight, deleteRole } from '../../../services'
import { fromJS } from 'immutable'
const { confirm } = Modal

export default function RoleList() {
  let [dataSource, setDataSource] = useState([]) //table表格的渲染数组
  let [roleId, setRoleId] = useState(0) //当前的角色行的id值
  let [rightList, setRightList] = useState([]) //树形控件的渲染数组
  let [rights, setRights] = useState([]) //树形控件的默认选中项，通过key选定
  const [isModalVisible, setIsModalVisible] = useState(false) //控制modal显示影藏
  useEffect(() => {
    async function fun() {
      let data = await getroleList()
      setDataSource(data)
    }
    fun()
  }, [])
  useEffect(() => {
    async function fun() {
      let data = await getRightList()
      setRightList(data)
    }
    fun()
  }, [])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render(id) {
        return <strong>{id}</strong>
      }
    },
    {
      title: '角色名称',
      dataIndex: 'roleName'
    },
    {
      title: '操作',
      render(item) {
        return (
          <div>
            <Space>
              <Button
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  confirm({
                    title: '你确定要删除这一项吗?',
                    icon: <ExclamationCircleOutlined />,
                    content: `删除后${item.roleName}角色将失效`,
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '取消',
                    onOk() {
                      try {
                        return deleteRole(item.id).then(res => {
                          updateView(item.id)
                        })
                      } catch (e) {
                        return console.log(e, 'Oops errors!')
                      }
                    },
                    onCancel() {
                      console.log('Cancel')
                    }
                  })
                }}
              ></Button>
              <Button
                type='primary'
                icon={<UnorderedListOutlined />}
                onClick={() => {
                  setRights(item.rights)
                  setRoleId(item.id)
                  showModal()
                }}
              ></Button>
            </Space>
          </div>
        )
      }
    }
  ]
  const updateView = id => {
    let newDataSource = fromJS(dataSource).toJS()
    newDataSource = newDataSource.filter(roleItem => {
      return roleItem.id !== id
    })
    setDataSource(newDataSource)
  }

  const showModal = () => {
    setIsModalVisible(true)
  }
  const handleOk = () => {
    let newDataSource = fromJS(dataSource).toJS()
    //通过id找到角色行
    newDataSource.some(item => {
      if (item.id === roleId) {
        item.rights = rights.checked
        return true
      }
      return false
    })
    setDataSource(newDataSource)
    //先更新页面再同步后端
    modifyRoleListOfRight({ id: roleId, rights: rights.checked })
    setIsModalVisible(false)
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }
  const onCheck = item => {
    //当前item就是一个对象，通过item.checked拿到操作后的key数组
    //应为复选框的默认勾选是通过key数组确定
    setRights(item)
  }
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
      <Modal title='Basic Modal' visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}>
        <Tree
          checkable
          checkStrictly={true}
          // defaultExpandedKeys={['0-0-0', '0-0-1']}
          // defaultSelectedKeys={['/user-manage/add']}
          checkedKeys={rights}
          // onSelect={onSelect}
          onCheck={onCheck}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}

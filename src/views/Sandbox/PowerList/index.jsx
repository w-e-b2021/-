import React, { useEffect, useState } from 'react'
import { Table, Button, Space, Tag, Popover, Switch, Modal, message } from 'antd'
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import {
  getRightList,
  modifyPagePermisson_1,
  modifyPagePermisson_2,
  deleteRight_1,
  deleteRight_2
} from '../../../services'
import { fromJS } from 'immutable'
const { confirm } = Modal

export default function PowerList() {
  let [dataSource, setDataSource] = useState([])
  useEffect(() => {
    async function fun() {
      let data = await getRightList()
      function filterChildren(list) {
        let newList = list.map(item => {
          if (item?.children?.length === 0) {
            delete item.children
          } else if (item?.children?.length > 0) {
            item.children = filterChildren(item.children)
          }
          return item
        })
        return newList
      }
      setDataSource(filterChildren(data))
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
      title: '权限名称',
      dataIndex: 'title'
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      render(key) {
        return <Tag color={'orange'}>{key}</Tag>
      }
    },
    {
      title: '操作',
      render(item) {
        return (
          <Space>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                showDeleteConfirm(item)
              }}
            />
            <Popover
              content={
                <div style={{ textAlign: 'center' }}>
                  <Switch
                    checked={item.pagepermisson}
                    onChange={() => {
                      changeSwitch(item)
                    }}
                  />
                </div>
              }
              title={<div style={{ textAlign: 'center' }}>页面配置</div>}
              trigger={item.pagepermisson === undefined ? '' : 'click'}
            >
              <Button disabled={item.pagepermisson === undefined} type='primary' icon={<EditOutlined />} />
            </Popover>
          </Space>
        )
      }
    }
  ]

  const changeSwitch = item => {
    item.pagepermisson = item.pagepermisson === 1 ? 0 : 1
    setDataSource([...dataSource])
    if (item.grade === 1) {
      modifyPagePermisson_1({ id: item.id, pagepermisson: item.pagepermisson })
    } else if (item.grade === 2) {
      modifyPagePermisson_2({ id: item.id, pagepermisson: item.pagepermisson })
    }
  }
  const showDeleteConfirm = data => {
    confirm({
      title: '你确定要删除这一项吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后XXX角色将没有这一权限',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',

      onOk() {
        try {
          if (data.grade === 1) {
            let newDataSource = dataSource.filter(item => item.id !== data.id)
            let promise = deleteRight_1(data.id)
            promise.then(res => {
              setDataSource(newDataSource)
            })
            return promise
          } else if (data.grade === 2) {
            /*方法一*/
            let newDataSource = fromJS(dataSource).toJS()
            newDataSource.some(item => {
              if (item.id === data.rightId) {
                item.children = item.children.filter(item => item.id !== data.id)
                return true
              }
              return false
            })
            /*方法二*/
            // let obj = dataSource.find(item => item.id === data.rightId)
            // obj.children = obj.children.filter(item => item.id !== data.id)
            // setDataSource([...dataSource])
            let promise = deleteRight_2(data.id)
            promise.then(res => {
              setDataSource(newDataSource)
            })
            return promise
          } else {
            message.error('删除出错，请反馈')
          }
        } catch (e) {
          return console.log(e, 'Oops errors!')
        }
      },

      onCancel() {
        console.log('Cancel')
      }
    })
  }
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
    </div>
  )
}
/*
  antd中的confirm中的onOk方法返回值如果是primise，此时，promise的状态若为pendding，转圈，
  若为fulfilled，停止转圈，modal框消失，
  若为rejected，停止转圈，modal框不消失
*/

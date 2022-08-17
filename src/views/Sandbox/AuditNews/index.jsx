import React, { useEffect, useState } from 'react'
import { Space, Table, Button, Modal, message } from 'antd'
import { ExclamationCircleOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { getPendingAudits, updateDraftorAudit } from '../../../services'
import { fromJS } from 'immutable'

function AuditList({ userInfo }) {
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getPendingAudits().then(res => {
      let list = res.filter(item => {
        if (userInfo.roleId === 1) {
          return true
        } else if (userInfo.roleId === 2) {
          return item.roleId > 2 && item.region === userInfo.region
        }
        return false
      })
      setNewsList(list)
    })
  }, [userInfo.roleId, userInfo.region])

  const updateView = id => {
    let newNewsList = fromJS(newsList).toJS()
    newNewsList = newNewsList.filter(item => item.id !== id)
    setNewsList(newNewsList)
  }

  const handlePass = id => {
    Modal.confirm({
      title: '通过审核',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要通过审核吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            auditState: 2,
            publishState: 1
          }
        })
        updateView(id)
        message.success('通过成功')
      }
    })
  }
  const handleRefuse = id => {
    Modal.confirm({
      title: '拒绝通过',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要驳回这条新闻吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            auditState: 3
          }
        })
        updateView(id)
        message.success('驳回成功')
      }
    })
  }
  const columns = [
    {
      title: <b>新闻标题</b>,
      dataIndex: 'title',
      render(title, item) {
        return <Link to={`/news-manage/preview/${item.id}`} children={title}></Link>
      }
    },
    {
      title: <b>作者</b>,
      dataIndex: 'author'
    },
    {
      title: <b>新闻分类</b>,
      dataIndex: 'category',
      render(category) {
        return category.title
      }
    },
    {
      title: <b>操作</b>,
      render(item) {
        return (
          <Space>
            <Button
              type='primary'
              icon={<CheckOutlined />}
              onClick={() => {
                handlePass(item.id)
              }}
            >
              通过
            </Button>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                handleRefuse(item.id)
              }}
            >
              驳回
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <Table rowKey={item => item.id} dataSource={newsList} columns={columns} pagination={{ pageSize: 5 }} />;
    </div>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(AuditList)

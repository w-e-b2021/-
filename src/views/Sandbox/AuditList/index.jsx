import React, { useEffect, useState } from 'react'
import { Space, Table, Button, Tag, Modal, notification, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { connect } from 'react-redux'
import { getAuditList, updateDraftorAudit } from '../../../services'
import { fromJS } from 'immutable'

const auditStateMap = ['草稿箱', '审核中', '审核通过', '审核拒绝']
const auditStateColor = ['', 'orange', 'green', 'red']

function AuditList({ userInfo }) {
  let { push } = useHistory()
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getAuditList(userInfo.username).then(res => {
      setNewsList(res)
    })
  }, [userInfo.username])

  const updateView = id => {
    let newNewsList = fromJS(newsList).toJS()
    newNewsList = newNewsList.filter(item => item.id !== id)
    setNewsList(newNewsList)
  }

  const handleBackout = id => {
    Modal.confirm({
      title: '撤销审核',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要撤销审核吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            auditState: 0
          }
        })
        updateView(id)
        notification['success']({
          message: '撤销成功',
          description: '你的新闻已经成功撤销，请前往草稿箱中查看',
          placement: 'bottomRight',
          duration: 2.5
        })
      }
    })
  }
  const handlePublish = id => {
    Modal.confirm({
      title: '发布新闻',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要发布新闻吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            publishState: 2
          }
        })
        updateView(id)
        message.success('发布成功')
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
      title: <b>审核状态</b>,
      dataIndex: 'auditState',
      render(auditState) {
        return <Tag color={auditStateColor[auditState]}>{auditStateMap[auditState]}</Tag>
      }
    },
    {
      title: <b>操作</b>,
      render(item) {
        return (
          <Space>
            {item.auditState === 2 ? (
              <Button
                type='primary'
                onClick={() => {
                  handlePublish(item.id)
                }}
              >
                发布
              </Button>
            ) : undefined}
            {item.auditState === 1 ? (
              <Button
                danger
                onClick={() => {
                  handleBackout(item.id)
                }}
              >
                撤销
              </Button>
            ) : undefined}
            {item.auditState === 3 ? (
              <Button
                type='primary'
                onClick={() => {
                  push(`/news-manage/update/${item.id}`)
                }}
              >
                更新
              </Button>
            ) : undefined}
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

import React, { useEffect, useState } from 'react'
import { Space, Table, Button, Modal, notification, message } from 'antd'
import { DeleteOutlined, EditOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { Link, useHistory } from 'react-router-dom'
import { getDraftList, updateDraftorAudit, deleteNews } from '../../../services'
import { connect } from 'react-redux'
import { fromJS } from 'immutable'

function Draft(props) {
  let { userInfo } = props
  let { push } = useHistory()
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getDraftList(userInfo.username).then(res => {
      setNewsList(res)
    })
  }, [userInfo.username])

  const updateView = id => {
    let newNewsList = fromJS(newsList).toJS()
    newNewsList = newNewsList.filter(item => item.id !== id)
    setNewsList(newNewsList)
  }

  const handleCommit = id => {
    Modal.confirm({
      title: '提交审核',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要提交审核吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            auditState: 1
          }
        })
        updateView(id)
        notification['success']({
          message: '提交成功',
          description: '你的新闻已经成功提交审核，请前往审核列表中查看',
          placement: 'bottomRight',
          duration: 2.5
        })
      }
    })
  }

  const handleDelete = async id => {
    Modal.confirm({
      title: '删除新闻',
      icon: <ExclamationCircleOutlined />,
      content: '你确定删除这条新闻吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await deleteNews(id)
        updateView(id)
        message.success('删除成功')
      }
    })
  }
  const columns = [
    {
      title: <b>ID</b>,
      dataIndex: 'id',
      render(id) {
        return <b>{id}</b>
      }
    },
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
              danger
              icon={<DeleteOutlined />}
              onClick={() => {
                handleDelete(item.id)
              }}
            ></Button>
            <Button
              icon={<EditOutlined />}
              onClick={() => {
                push(`/news-manage/update/${item.id}`)
              }}
            ></Button>
            <Button
              type='primary'
              icon={<UploadOutlined />}
              onClick={() => {
                handleCommit(item.id)
              }}
            ></Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Table rowKey={item => item.id} dataSource={newsList} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(Draft)

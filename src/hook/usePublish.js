import React, { useEffect, useState } from 'react'
import { Modal, message } from 'antd'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { getPublishList, updateDraftorAudit, deleteNews } from '../services'
import { fromJS } from 'immutable'

export default function usePublish({ publishState, author }) {
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getPublishList({ publishState, author }).then(res => {
      setNewsList(res)
    })
  }, [publishState, author])

  const updateView = id => {
    let newNewsList = fromJS(newsList).toJS()
    newNewsList = newNewsList.filter(item => item.id !== id)
    setNewsList(newNewsList)
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

  const handleSunset = id => {
    Modal.confirm({
      title: '下线新闻',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要下线新闻吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await updateDraftorAudit({
          id,
          data: {
            publishState: 3
          }
        })
        updateView(id)
        message.success('下线成功')
      }
    })
  }

  const handleDelete = id => {
    Modal.confirm({
      title: '删除新闻',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要删除新闻吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await deleteNews(id)
        updateView(id)
        message.success('删除成功')
      }
    })
  }

  return {
    newsList,
    handlePublish,
    handleSunset,
    handleDelete
  }
}

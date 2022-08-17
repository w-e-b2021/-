import React from 'react'
import { Table } from 'antd'
import { Link } from 'react-router-dom'

export default function NewsPublish({ dataSource, children }) {
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
        return children(item.id)
      }
    }
  ]
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <Table rowKey={item => item.id} dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />;
    </div>
  )
}

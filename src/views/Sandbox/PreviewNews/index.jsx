import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader, Tag } from 'antd'
import './index.css'
import { useRouteMatch } from 'react-router-dom'
import { getNewsPreviewById } from '../../../services'

const auditMap = ['未审核', '审核中', '审核通过', '审核拒绝']
const auditColor = ['blue', 'orange', 'green', 'red']
const publicMap = ['未发布', '待发布', '已上线', '已下线']
const publicColor = ['#ddd', 'orange', 'green', 'red']

export default function Preview() {
  let {
    params: { id }
  } = useRouteMatch()
  let [dataSoure, setDataSoure] = useState({})
  useEffect(() => {
    getNewsPreviewById(id).then(res => {
      console.log(res)
      setDataSoure(res)
    })
  }, [id])
  return (
    <div className='site-page-header-ghost-wrapper' style={{ height: '100%', overflow: 'auto' }}>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={dataSoure.author}
        subTitle={dataSoure?.category?.title}
      >
        <Descriptions size='small' column={3}>
          <Descriptions.Item label='创作者'>{dataSoure.author}</Descriptions.Item>
          <Descriptions.Item label='创建时间'>
            {new Date(dataSoure.createTime).toLocaleDateString()}
          </Descriptions.Item>
          <Descriptions.Item label='发布时间'>
            {dataSoure.publishTime ? dataSoure.publishTime : '—'}
          </Descriptions.Item>
          <Descriptions.Item label='区域'>{dataSoure.region}</Descriptions.Item>
          <Descriptions.Item label='审核状态'>
            <Tag color={auditColor[dataSoure.auditState]}>{auditMap[dataSoure.auditState]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='发布状态'>
            <Tag color={publicColor[dataSoure.publishState]}>{publicMap[dataSoure.publishState]}</Tag>
          </Descriptions.Item>
          <Descriptions.Item label='访问数量'>
            <span style={{ color: 'greenyellow' }}>{dataSoure.view}</span>
          </Descriptions.Item>
          <Descriptions.Item label='点赞数量'>
            <span style={{ color: 'greenyellow' }}>{dataSoure.star}</span>
          </Descriptions.Item>
          <Descriptions.Item label='评论数量'>
            <span style={{ color: 'greenyellow' }}>{0}</span>
          </Descriptions.Item>
        </Descriptions>
        <div
          style={{ border: '1px solid rgb(235, 237, 240)', padding: '15px 10px' }}
          dangerouslySetInnerHTML={{
            __html: dataSoure.content
          }}
        ></div>
      </PageHeader>
    </div>
  )
}

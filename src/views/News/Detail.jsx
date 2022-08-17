import React, { useEffect, useState } from 'react'
import { Descriptions, PageHeader } from 'antd'
import { HeartOutlined } from '@ant-design/icons'
import { useRouteMatch } from 'react-router-dom'
import { getNewsPreviewById, updateDraftorAudit } from '../../services'

export default function Detail() {
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
  useEffect(() => {
    updateDraftorAudit({
      id,
      data: {
        view: dataSoure.view + 1
      }
    })
  })
  return (
    <div className='site-page-header-ghost-wrapper'>
      <PageHeader
        ghost={false}
        onBack={() => window.history.back()}
        title={dataSoure.author}
        subTitle={
          <div>
            {dataSoure?.category?.title}{' '}
            <HeartOutlined
              color='red'
              onMouseMove={e => {
                e.target.style.cursor = 'pointer'
              }}
              onClick={() => {
                setDataSoure({
                  ...dataSoure,
                  star: dataSoure.star + 1
                })
                updateDraftorAudit({
                  id,
                  data: {
                    star: dataSoure.star + 1
                  }
                })
              }}
            />
          </div>
        }
      >
        <Descriptions size='small' column={3}>
          <Descriptions.Item label='创作者'>{dataSoure.author}</Descriptions.Item>

          <Descriptions.Item label='发布时间'>
            {dataSoure.publishTime ? dataSoure.publishTime : '—'}
          </Descriptions.Item>
          <Descriptions.Item label='区域'>{dataSoure.region}</Descriptions.Item>

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

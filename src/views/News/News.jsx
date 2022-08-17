import React, { useEffect, useState } from 'react'
import { Card, Col, Row, PageHeader, List } from 'antd'
import { getNewsList } from '../../services'
import _ from 'lodash'
import { Link } from 'react-router-dom'

export default function News() {
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getNewsList({
      _expand: 'category',
      publishState: 2
    }).then(res => {
      setNewsList(Object.entries(_.groupBy(res, item => item.category.title)))
    })
  }, [])
  console.log(newsList)
  return (
    <div style={{ padding: '20x', width: '100%' }}>
      <PageHeader title='时事新闻' subTitle='good news'></PageHeader>
      <Row gutter={[16, 16]}>
        {newsList.map(item => {
          return (
            <Col span={8} key={item[0]}>
              <Card title={item[0]} bordered hoverable>
                <List
                  dataSource={item[1]}
                  renderItem={item => {
                    return (
                      <List.Item>
                        <Link to={`/detail/${item.id}`}>{item.title}</Link>
                      </List.Item>
                    )
                  }}
                ></List>
              </Card>
            </Col>
          )
        })}
      </Row>
    </div>
  )
}

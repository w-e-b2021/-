import React, { useEffect, useRef, useState } from 'react'
import { Row, Col, Card, Avatar, List, Space, Drawer } from 'antd'
import { EditOutlined, EllipsisOutlined, SettingOutlined, EyeOutlined, StarOutlined } from '@ant-design/icons'
import { getNewsList } from '../../../services'
import { Link } from 'react-router-dom'
import UserEditer from '../../../components/UserEditer.jsx'
import * as Echarts from 'echarts'
import _ from 'lodash'
import { connect } from 'react-redux'
const { Meta } = Card

function Home({ userInfo, form }) {
  let [viewList, setViewList] = useState([])
  let [starList, setStarList] = useState([])
  let [pieObj, setPieObj] = useState({})
  let [visible, setVisible] = useState(false)
  let [editVisible, setEditVisible] = useState(false)
  let barRef = useRef()
  let pieRef = useRef()
  let myPieChart = useRef(null)
  useEffect(() => {
    getNewsList({
      _expand: 'category',
      _limit: 6,
      _sort: 'view',
      _order: 'desc'
    }).then(res => {
      setViewList(res)
    })
    getNewsList({
      _expand: 'category',
      _limit: 6,
      _sort: 'star',
      _order: 'desc'
    }).then(res => {
      setStarList(res)
    })
    getNewsList({
      _expand: 'category',
      publishState: 2
    }).then(res => {
      renderBar(_.groupBy(res, item => item.category.title))
    })
    getNewsList({
      _expand: 'category',
      publishState: 2,
      author: userInfo.username
    }).then(res => {
      setPieObj(_.groupBy(res, item => item.category.title))
    })
  }, [userInfo.username])

  const renderBar = obj => {
    var myChart = Echarts.init(barRef.current)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: '新闻分类'
      },
      tooltip: {},
      legend: {
        data: ['数量']
      },
      xAxis: {
        data: Object.keys(obj),
        axisLabel: {
          interval: 0
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.entries(obj).map(item => item[1].length)
        }
      ]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  }

  const renderPie = obj => {
    if (!myPieChart.current) {
      myPieChart.current = Echarts.init(pieRef.current)
    }

    var option = {
      title: {
        text: '我的新闻',
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        top: 'bottom',
        data: Object.keys(obj)
      },
      toolbox: {
        show: true,
        feature: {
          mark: { show: true },
          dataView: { show: true, readOnly: false },
          restore: { show: true },
          saveAsImage: { show: true }
        }
      },
      series: [
        {
          name: '新闻分类',
          type: 'pie',
          radius: [20, 140],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          data: Object.entries(obj).map(item => {
            return {
              name: item[0],
              value: item[1].length
            }
          })
        }
      ]
    }

    option && myPieChart.current.setOption(option)
  }
  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <Row gutter={[16, 16]} style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}>
        <Col span={8}>
          <Card title='最多浏览' bordered={true} hoverable>
            <List
              size='small'
              dataSource={viewList}
              renderItem={item => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                  <Space>
                    <EyeOutlined />
                    {item.view}
                  </Space>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title='最多点赞' bordered={true} hoverable>
            <List
              size='small'
              dataSource={starList}
              renderItem={item => (
                <List.Item>
                  <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                  <Space>
                    <StarOutlined />
                    {item.star}
                  </Space>
                </List.Item>
              )}
            ></List>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            hoverable
            cover={<img alt='example' src='https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png' />}
            actions={[
              <SettingOutlined
                key='setting'
                onClick={() => {
                  setVisible(true)
                  setTimeout(() => {
                    renderPie(pieObj)
                  }, 1000)
                }}
              />,
              <EditOutlined
                key='edit'
                onClick={() => {
                  setEditVisible(true)
                  form.setFieldsValue(userInfo)
                }}
              />,
              <EllipsisOutlined key='ellipsis' />
            ]}
          >
            <Meta
              avatar={<Avatar src='https://joeschmoe.io/api/v1/random' />}
              title={userInfo.username}
              description={
                <div>
                  <b>{userInfo.region === '' ? '全球' : userInfo.region}</b>
                  <span
                    style={{
                      paddingLeft: '30px'
                    }}
                  >
                    {userInfo.role.roleName}
                  </span>
                </div>
              }
            />
          </Card>
        </Col>
        <Col span={24}>
          <Card hoverable title='新闻分类'>
            <div ref={barRef} style={{ width: '100%', height: '400px' }}></div>
          </Card>
        </Col>
      </Row>
      <Drawer
        title='新闻分类'
        width='600px'
        placement='right'
        onClose={() => {
          setVisible(false)
        }}
        visible={visible}
      >
        <div ref={pieRef} style={{ width: '100%', height: '400px' }}></div>
      </Drawer>
      <UserEditer
        visible={editVisible}
        onCreate={() => {
          setEditVisible(false)
        }}
        onCancel={() => {
          setEditVisible(false)
        }}
      ></UserEditer>
    </div>
  )
}

export default connect(state => {
  return {
    form: state.userListReducer.form,
    userInfo: state.userInfoReducer.userInfo
  }
})(Home)

import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hook/usePublish'

function Sunset({ userInfo }) {
  let { newsList, handleDelete } = usePublish({ publishState: 3, author: userInfo.username })
  return (
    <div>
      <NewsPublish dataSource={newsList}>
        {id => {
          return (
            <Button
              danger
              onClick={() => {
                handleDelete(id)
              }}
            >
              删除
            </Button>
          )
        }}
      </NewsPublish>
    </div>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(Sunset)

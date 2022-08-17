import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hook/usePublish'

function Published({ userInfo }) {
  let { newsList, handleSunset } = usePublish({ publishState: 2, author: userInfo.username })

  return (
    <div>
      <NewsPublish dataSource={newsList}>
        {id => {
          return (
            <Button
              danger
              onClick={() => {
                handleSunset(id)
              }}
            >
              下线
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
})(Published)

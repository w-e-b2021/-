import React from 'react'
import { Button } from 'antd'
import { connect } from 'react-redux'
import NewsPublish from '../../../components/NewsPublish'
import usePublish from '../../../hook/usePublish'

function AuditList({ userInfo }) {
  let { newsList, handlePublish } = usePublish({ publishState: 1, author: userInfo.username })

  return (
    <NewsPublish dataSource={newsList}>
      {id => {
        return (
          <Button
            type='primary'
            onClick={() => {
              handlePublish(id)
            }}
          >
            发布
          </Button>
        )
      }}
    </NewsPublish>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(AuditList)

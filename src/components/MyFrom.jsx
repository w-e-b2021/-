import React, { forwardRef } from 'react'
import { Form, Input, Select } from 'antd'
import { connect } from 'react-redux'

function MyFrom(props) {
  let { form, roleList, regionList, setRegionFlag, regionFlag, refInstance, userInfo, isAdd } = props
  const judgeDisable = item => {
    if (isAdd) {
      //isAdd为true,添加用户modal
      if (userInfo.roleId === 1) {
        //超级管理能任意选择角色和区域，所以角色和区域都不禁用
        return false
      } else {
        if (item.title) {
          //处理区域禁用
          return userInfo.region !== item.value
        } else {
          //处理角色禁用
          return userInfo.roleId >= item.id
        }
      }
    } else {
      //更新modal
      if (userInfo.roleId === 1) {
        return false
      } else {
        return true
      }
    }
  }
  return (
    <Form
      ref={refInstance}
      form={form} //提供了ref的效果
      layout='vertical' //label和input输入框是否在一行
      name='form_in_modal'
    >
      <Form.Item
        name='username'
        label='用户名'
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!'
          }
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name='password'
        label='密码'
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!'
          }
        ]}
      >
        <Input.Password />
      </Form.Item>
      <Form.Item
        name='region'
        label='区域'
        rules={
          regionFlag
            ? []
            : [
                {
                  required: true,
                  message: 'Please input the title of collection!'
                }
              ]
        }
      >
        <Select disabled={regionFlag}>
          {regionList.map(item => (
            <Select.Option disabled={judgeDisable(item)} value={item.value} key={item.id}>
              {item.title}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name='roleId'
        label='角色'
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!'
          }
        ]}
      >
        <Select
          onChange={value => {
            if (value === 1) {
              setRegionFlag(true)
              form.setFieldsValue({
                region: ''
              })
            } else {
              setRegionFlag(false)
            }
          }}
        >
          {roleList.map(item => (
            <Select.Option disabled={judgeDisable(item)} value={item.id} key={item.id}>
              {item.roleName}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </Form>
  )
}
const ConnectComponent = connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(MyFrom)
export default forwardRef((props, ref) => <ConnectComponent {...props} refInstance={ref} />)

import React from 'react'
import { Button, Checkbox, Form, Input, Space, message } from 'antd'
import ReactCanvasNest from 'react-canvas-nest'
import { userLogin, userRegister } from '../../services'
import './index.css'
import { useHistory } from 'react-router-dom'
import { getUserInfo } from '../../redux/createActions'
import { connect } from 'react-redux'

function Login(props) {
  let { replace } = useHistory()
  let [form] = Form.useForm()
  const onFinish = async values => {
    let data = await userLogin({ ...values, roleState: true })
    if (data.length > 0) {
      console.log(data)
      localStorage.setItem('token', JSON.stringify(data))
      props.getUserInfo(data[0])
      replace('/')
    } else {
      message.error('账号或密码错误')
    }
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <div style={{ height: '100vh', overflow: 'hidden', backgroundColor: '#fff' }}>
      <ReactCanvasNest
        className='canvasNest'
        config={{
          pointColor: ' 255, 255, 255 ',
          lineColor: '255,255,255',
          pointOpacity: 0.5,
          pointR: 2,
          count: 100
        }}
        style={{ zIndex: 1 }}
      />
      <div className='loginForm'>
        <h1 style={{ color: '#fff', textAlign: 'center' }}>全球新闻登录系统</h1>
        <Form
          form={form}
          name='basic'
          labelCol={{
            span: 5
          }}
          wrapperCol={{
            span: 16
          }}
          initialValues={{
            remember: true
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete='off'
        >
          <Form.Item
            label='用户名'
            name='username'
            rules={[
              {
                required: true,
                message: 'Please input your username!'
              }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label='密码'
            name='password'
            rules={[
              {
                required: true,
                message: 'Please input your password!'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name='remember'
            valuePropName='checked'
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Checkbox>Remember me</Checkbox>
          </Form.Item>

          <Form.Item
            wrapperCol={{
              offset: 5,
              span: 16
            }}
          >
            <Space>
              <Button type='primary' htmlType='submit'>
                登录
              </Button>
              <Button
                type='primary'
                onClick={() => {
                  form.validateFields().then(({ username, password }) => {
                    userRegister({
                      username,
                      password,
                      region: '亚洲',
                      roleId: 2,
                      roleState: true,
                      default: false
                    })
                    message.success('注册成功')
                  })
                }}
              >
                注册
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  )
}
export default connect(undefined, {
  getUserInfo
})(Login)

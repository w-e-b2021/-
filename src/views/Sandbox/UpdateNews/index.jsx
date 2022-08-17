import React, { useEffect, useState } from 'react'
import { PageHeader, Steps, Button, Space, Form, Input, Select, message, notification } from 'antd'
import { getcategories, getNewsPreviewById, updateDraftorAudit } from '../../../services'
import MyEditor from '../../../components/MyEditor'
import { useHistory, useRouteMatch } from 'react-router-dom'
const { Step } = Steps
const { Option } = Select
const layout = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 18
  }
}

export default function UpdateNews() {
  let {
    params: { id }
  } = useRouteMatch()
  let [currentState, setCurrentState] = useState(0) //步骤状态
  let [categories, setCategories] = useState([]) //新闻分类列表
  let [content, setContent] = useState('') //富文本编辑内容够
  let [basisInfo, setBasisInfo] = useState({}) //新闻标题和区域
  let { push } = useHistory()
  const [form] = Form.useForm()
  useEffect(() => {
    getcategories().then(res => {
      setCategories(res)
    })
  }, [])
  useEffect(() => {
    getNewsPreviewById(id).then(res => {
      form.setFieldsValue({
        title: res.title,
        categoryId: res.categoryId
      })
      setContent(res.content)
    })
  }, [id, form])

  const handleNext = () => {
    if (currentState === 0) {
      form
        .validateFields()
        .then(res => {
          setBasisInfo(res)
          let temp = currentState
          setCurrentState(temp + 1)
        })
        .catch(err => {
          message.warn('字段不能为空')
        })
    } else if (currentState === 1) {
      let temp = currentState
      content.replace(/<p>|<\/p>|\n|&nbsp;/g, '') === '' ? message.warn('字段不能为空') : setCurrentState(temp + 1)
    }
  }
  const handleContext = context => {
    setContent(context)
  }
  const handleSubmit = async auditState => {
    let data = {
      ...basisInfo,
      content,
      auditState: auditState
    }
    if (auditState === 0) {
      await updateDraftorAudit({ data, id })
      notification['success']({
        message: '更新新闻',
        description: '你的新闻已经成功保存到草稿箱',
        placement: 'bottomRight',
        duration: 2.5
      })
      push('/news-manage/draft')
    } else {
      await updateDraftorAudit({ data, id })
      notification['success']({
        message: '更新新闻',
        description: '你的新闻已经成功提交审核，请等待审核通过',
        placement: 'bottomRight',
        duration: 2.5
      })
      push('/audit-manage/list')
    }
  }
  return (
    <div>
      <PageHeader
        className='site-page-header'
        title='更新新闻'
        subTitle='This is a subtitle'
        onBack={() => {
          window.history.back()
        }}
      />
      <div style={{ marginTop: '20px' }}>
        <Steps current={currentState}>
          <Step title='基本信息' description='新闻标题，新闻分类' />
          <Step title='新闻内容' description='新闻主题内容' />
          <Step title='新闻提交' description='保存草稿或提交审核' />
        </Steps>
      </div>
      <div style={{ margin: '30px 20px' }}>
        <Form
          {...layout}
          form={form}
          name='control-hooks'
          style={{ display: currentState === 0 ? 'block' : 'none' }}
        >
          <Form.Item
            name='title'
            label='新闻标题'
            rules={[
              {
                required: true,
                message: ''
              }
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name='categoryId'
            label='新闻分类'
            rules={[
              {
                required: true,
                message: ''
              }
            ]}
          >
            <Select placeholder='从以下区域中选择一个' onChange={() => {}} allowClear>
              {categories.map(item => (
                <Option value={item.id} key={item.id}>
                  {item.title}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
        <div style={{ display: currentState === 1 ? 'block' : 'none', border: '1px solid rgb(235, 237, 240)' }}>
          <MyEditor handleContext={handleContext} content={content} />
        </div>
      </div>
      <div>
        <Space>
          {currentState > 0 ? (
            <Button
              type='primary'
              onClick={() => {
                let temp = currentState
                setCurrentState(temp - 1)
              }}
            >
              上一步
            </Button>
          ) : undefined}
          {currentState === 2 ? (
            <Space>
              <Button
                type='primary'
                onClick={() => {
                  handleSubmit(0)
                }}
              >
                保存到草稿箱
              </Button>
              <Button
                danger
                onClick={() => {
                  handleSubmit(1)
                }}
              >
                提交审核
              </Button>
            </Space>
          ) : undefined}
          {currentState < 2 ? (
            <Button type='primary' onClick={handleNext}>
              下一步
            </Button>
          ) : undefined}
        </Space>
      </div>
    </div>
  )
}

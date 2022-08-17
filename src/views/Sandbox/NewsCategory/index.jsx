import React, { useEffect, useState, useContext, useRef } from 'react'
import { Space, Table, Button, Modal, Form, Input, message } from 'antd'
import { CloseOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import { getcategories, updateCategorie, deleteCategorie } from '../../../services'
import { fromJS } from 'immutable'
import './index.css'
const EditableContext = React.createContext(null)

const EditableRow = ({ ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

const EditableCell = ({ title, editable, children, dataIndex, record, handleSave, ...restProps }) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}

function AuditList() {
  let [newsList, setNewsList] = useState([])
  useEffect(() => {
    getcategories().then(res => {
      setNewsList(res)
    })
  }, [])

  const updateView = (id, type, value) => {
    if (type === '删除') {
      let newNewsList = fromJS(newsList).toJS()
      newNewsList = newNewsList.filter(item => item.id !== id)
      setNewsList(newNewsList)
    } else if (type === '更新') {
      let newNewsList = fromJS(newsList).toJS()
      newNewsList = newNewsList.map(item => {
        if (item.id === id) {
          return value
        }
        return item
      })
      setNewsList(newNewsList)
    }
  }
  const handleSave = rowItem => {
    updateView(rowItem.id, '更新', rowItem)
    updateCategorie(rowItem.id, { title: rowItem.title, value: rowItem.value })
  }
  const handleDelete = id => {
    Modal.confirm({
      title: '删除分类',
      icon: <ExclamationCircleOutlined />,
      content: '你确定要删除当前分类吗',
      okText: '确认',
      cancelText: '取消',
      async onOk() {
        await deleteCategorie(id)
        updateView(id, '删除')
        message.success('删除成功成功')
      }
    })
  }

  const columns = [
    {
      title: <b>ID</b>,
      dataIndex: 'id',
      render(title) {
        return <b>{title}</b>
      }
    },
    {
      title: <b>栏目名称</b>,
      dataIndex: 'title',
      onCell: record => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: <b>栏目名称</b>,
        handleSave
      })
    },
    {
      title: <b>操作</b>,
      render(item) {
        return (
          <Space>
            <Button
              danger
              icon={<CloseOutlined />}
              onClick={() => {
                handleDelete(item.id)
              }}
            >
              删除
            </Button>
          </Space>
        )
      }
    }
  ]
  return (
    <div style={{ height: '100%', overflow: 'hidden' }}>
      <Table
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
        rowClassName={() => 'editable-row'}
        rowKey={item => item.id}
        dataSource={newsList}
        columns={columns}
        pagination={{ pageSize: 5 }}
      />
    </div>
  )
}
export default connect(state => {
  return {
    userInfo: state.userInfoReducer.userInfo
  }
})(AuditList)

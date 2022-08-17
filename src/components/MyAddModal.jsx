import React, { useState, useEffect, useRef } from 'react'
import { Button, Modal, Form } from 'antd'
import { getroleList, getRegionList, addUser } from '../services'
import { fromJS } from 'immutable'
import MyFrom from './MyFrom'

export default function MyAddModal(props) {
  let { visible, onCreate, onCancel, userList, setUserList } = props
  let [roleList, setRoleList] = useState([])
  let [regionList, setRegionList] = useState([])
  let [loading, setLoading] = useState(false)
  let [regionFlag, setRegionFlag] = useState(false)
  useEffect(() => {
    async function ajax() {
      let data = await getroleList()
      setRoleList(data)
    }
    ajax()
  }, [])
  useEffect(() => {
    async function ajax() {
      let data = await getRegionList()
      setRegionList(data)
    }
    ajax()
  }, [])
  // 这两种方法等效，不过下面一种需要forwardRef透传
  const [form] = Form.useForm()
  let form1 = useRef()
  const upadteView = data => {
    let newUserList = fromJS(userList).toJS()
    let role = roleList.find(item => {
      return item.id === data.roleId
    })
    newUserList.push({ ...data, role })
    setUserList(newUserList)
  }
  async function handleAdd() {
    setLoading(true)
    try {
      let values = await form.validateFields() //收集表单值，这里如果必填字段为空，则是失败的promise
      let data = await addUser({
        ...values,
        roleState: true,
        default: values.roleId === 1 ? true : false
      })
      upadteView(data) //更新渲染
      setLoading(false) //控制确定按钮停止转圈
      form.resetFields() //清空表单
      setRegionFlag(false) //点击添加后区域Select应该取消禁用
      onCreate() //关闭modal
    } catch (e) {
      setLoading(false)
    }
  }
  function handleCancel() {
    onCancel()
  }
  return (
    <Modal
      visible={visible}
      title='添加新用户'
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          取消
        </Button>,
        <Button key='submit' loading={loading} type='primary' onClick={handleAdd}>
          添加
        </Button>
      ]}
    >
      <MyFrom
        regionFlag={regionFlag}
        setRegionFlag={setRegionFlag}
        roleList={roleList}
        regionList={regionList}
        form={form}
        ref={form1}
        isAdd
      ></MyFrom>
    </Modal>
  )
}

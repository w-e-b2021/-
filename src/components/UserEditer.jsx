import React, { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { Button, Modal, Form } from 'antd'
import { getroleList, getRegionList, editUser } from '../services'
import { getForm, getUserInfo } from '../redux/createActions'
import MyFrom from './MyFrom'

const MyUpdateModal = props => {
  let { visible, onCreate, onCancel, getForm } = props
  let [roleList, setRoleList] = useState([])
  let [regionList, setRegionList] = useState([])
  let [loading, setLoading] = useState(false)
  let [regionFlag, setRegionFlag] = useState(false)
  // 这两种方法等效，不过下面一种需要forwardRef透传
  const [form] = Form.useForm()
  let form1 = useRef()

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
  useEffect(() => {
    getForm(form)
  }, [form, getForm])
  useEffect(() => {
    if (visible === true) {
      if (form.getFieldValue('roleId') === 1) {
        setRegionFlag(true)
      } else {
        setRegionFlag(false)
      }
    }
  }, [visible, form])

  async function handleEdit() {
    setLoading(true)
    try {
      let values = await form.validateFields() //收集表单值，这里如果必填字段为空，则是失败的promise
      let data = await editUser({ id: props.userInfo.id, data: values }) //返回更新后user对象
      props.changeUserInfo(data)
      setLoading(false) //控制确定按钮停止转圈
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
      title='编辑用户'
      onCancel={handleCancel}
      footer={[
        <Button key='back' onClick={handleCancel}>
          取消
        </Button>,
        <Button key='submit' loading={loading} type='primary' onClick={handleEdit}>
          确定
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
      ></MyFrom>
    </Modal>
  )
}

export default connect(
  state => {
    return {
      userInfo: state.userInfoReducer.userInfo
    }
  },
  {
    getForm,
    getUserInfo,
    changeUserInfo(data) {
      return {
        type: 'changeUserInfo',
        data
      }
    }
  }
)(MyUpdateModal)

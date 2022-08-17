import axios from '../util/axios'

//获取sidemenu列表数据
export const getRightList = () => axios.get('/rights?_embed=children')
//当grade=1时修改pagePermisson
export const modifyPagePermisson_1 = ({ id, pagepermisson }) =>
  axios.patch(`/rights/${id}`, {
    pagepermisson
  })
//当grade=2时修改pagePermisson
export const modifyPagePermisson_2 = ({ id, pagepermisson }) =>
  axios.patch(`/children/${id}`, {
    pagepermisson
  })
//当grade=1时,删除权限
export const deleteRight_1 = id => axios.delete(`/rights/${id}`)
//当grade=2时,删除权限
export const deleteRight_2 = id => axios.delete(`/children/${id}`)
//获取角色列表
export const getroleList = () => axios.get('/roles')
//修改角色的权限列表,也就是roleList.rights
export const modifyRoleListOfRight = ({ id, rights }) =>
  axios.patch(`/roles/${id}`, {
    rights
  })
//删除角色
export const deleteRole = id => axios.delete(`/roles/${id}`)
//获取用户列表
export const getUserList = () => axios.get('/users?_expand=role')
//修改用户状态,实际上UserState更好
export const modifyRoleState = ({ id, roleState }) =>
  axios.patch(`/users/${id}`, {
    roleState
  })
//获取区域列表
export const getRegionList = () => axios.get('/regions')
//添加用户
export const addUser = data => axios.post('/users', data)
//删除用户
export const deleteUser = id => axios.delete(`/users/${id}`)
//编辑用户
export const editUser = ({ id, data }) => axios.patch(`/users/${id}`, data)
//验证用户登录
export const userLogin = ({ username, password, roleState }) =>
  axios.get(`/users`, {
    params: {
      username,
      password,
      roleState,
      _expand: 'role'
    }
  })
//用户注册
export const userRegister = data => axios.post(`/users`, data)
// 获取新闻分类列表
export const getcategories = () => axios.get('/categories')
//添加到草稿箱或提交审核
export const saveDraftorAudit = data => axios.post(`/news`, data)
//获取草稿箱列表
//auditState={0:草稿箱,1:审核中,2:审核通过,3:审核被拒绝}
export const getDraftList = author => axios.get(`/news?auditState=0&author=${author}&_expand=category`)
//获取审核列表 publishState = [0:未发布, 1:待发布, 2:已上线, 3:已下线]
export const getAuditList = author =>
  axios.get(`/news?author=${author}&_expand=category&auditState_ne=0&publishState_lte=1`)
//根据id获取新闻预览
export const getNewsPreviewById = id => axios.get(`/news/${id}?_expand=category&_expand=role`)
//在草稿箱中重新保存到草稿箱或提交审核
export const updateDraftorAudit = ({ data, id }) => axios.patch(`/news/${id}`, data)
//删除草稿箱新闻
export const deleteNews = id => axios.delete(`/news/${id}`)
//获取待审核列表
export const getPendingAudits = () => axios.get(`/news?auditState=1&_expand=category`)
//在新闻分类中更新categories
export const updateCategorie = (id, data) => axios.patch(`/categories/${id}`, data)
//在新闻分类中删除categorie
export const deleteCategorie = id => axios.delete(`/categories/${id}`)
//获取待发布、已发布、已下线新闻列表
export const getPublishList = ({ publishState, author }) =>
  axios.get(`/news?publishState=${publishState}&author=${author}&_expand=category`)
//主页获取新闻列表,自定义条件
export const getNewsList = condition =>
  axios.get(`/news`, {
    params: condition
  })

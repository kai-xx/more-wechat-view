import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/views/layout/Layout'

/** note: submenu only apppear when children.length>=1
*   detail see  https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
**/

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/authredirect', component: () => import('@/views/login/authredirect'), hidden: true },
  { path: '/404', component: () => import('@/views/errorPage/404'), hidden: true },
  { path: '/401', component: () => import('@/views/errorPage/401'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/manager',
    component: Layout,
    redirect: '/manager/manger-list',
    alwaysShow: true,
    meta: { title: '管理员', icon: 'people' },
    children: [{ path: 'manger-list', component: () => import('@/views/manager/managerList'), name: 'mangerList', meta: { title: '管理员列表' }}]
  },
  {
    path: '/wechat',
    component: Layout,
    redirect: '/wechat/wechat-list',
    alwaysShow: true,
    meta: { title: '公众号', icon: 'wechat' },
    children: [
      { path: 'wechat-list', component: () => import('@/views/wechat/list'), name: 'wechatList', meta: { title: '公众号列表' }},
      { path: 'create', component: () => import('@/views/wechat/create'), name: 'createWechat', meta: { title: '添加公众号' }, hidden: true },
      { path: 'edit/:id', component: () => import('@/views/wechat/edit'), name: 'editWechat', meta: { title: '编辑公众号' }, hidden: true }
    ]
  },
  {
    path: '/message',
    component: Layout,
    redirect: '/message/message-list',
    alwaysShow: true,
    meta: { title: '消息', icon: 'message' },
    children: [
      { path: 'message-list', component: () => import('@/views/message/list'), name: 'messageList', meta: { title: '消息列表' }},
      { path: 'create/:oa_wechat_id', component: () => import('@/views/message/create'), name: 'createMessage', meta: { title: '添加消息' }, hidden: true },
      { path: 'edit/:id', component: () => import('@/views/message/edit'), name: 'editMessage', meta: { title: '编辑消息' }, hidden: true }
    ]
  },
  {
    path: '/news',
    component: Layout,
    redirect: '/news/news-list',
    alwaysShow: true,
    meta: { title: '图文', icon: 'excel' },
    children: [
      { path: 'news-list', component: () => import('@/views/news/newsList'), name: 'newsList', meta: { title: '图文列表' }},
      { path: 'create/:oa_wechat_id', component: () => import('@/views/news/createNews'), name: 'createNews', meta: { title: '新建图文' }, hidden: true },
      { path: 'edit/:id', component: () => import('@/views/news/editNews'), name: 'editNews', meta: { title: '编辑图文' }, hidden: true }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

import Vue from 'vue'
import Router from 'vue-router'
import index from '@/pages/index/index'
import home from '@/pages/home/index'
import login from '@/pages/login/index'
import register from '@/pages/register/index'
import deal from '@/pages/deal/index'
import quot from '@/pages/quot/index'
import coin_introduce from '@/pages/coin_introduce/index'
import trading from '@/pages/trading/index'

import announcementIndex from '@/pages/announcement/index'
import announcement from '@/pages/announcement/announcement'
import announcementList from '@/pages/announcement/announcement_list'
import announcementDetails from '@/pages/announcement/announcement_details'


import personal from '@/pages/personal/index'
import assert from '@/pages/assert/index'
import help from '@/pages/help/index'
import miss from '@/pages/miss/index'

import forgetPassword from '@/pages/forgetPassword/index'

import assertInfo from '@/pages/assert/children/structure/index'
import bankManage from '@/pages/assert/children/bank_manage/index'
import recharge from '@/pages/assert/children/recharge/index'
import withdraw from '@/pages/assert/children/withdraw/index'
import waterLook from '@/pages/assert/children/water_look/index'
import entrustRecord from '@/pages/assert/children/entrust_record/index'

import basicInfo from '@/pages/personal/children/basic_info/index'
import authProve from '@/pages/personal/children/auth_prove/index'
import codeManage from '@/pages/personal/children/code_manage/index'
import setSecurity from '@/pages/personal/children/set_security/index'
import apiManage from '@/pages/personal/children/api_manage/index'

import work_orders from '@/pages/work_orders/index'
import orders_create from '@/pages/work_orders/children/orders_create/index'
import orders_list from '@/pages/work_orders/children/orders_list/index'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: index,
      children: [
        {path: '/', component: home,alias: '/home'},
        {path: '/login', component: login},
        {path: '/register', component: register},
        {path: '/deal', component: deal},
        {path: '/quot', component: quot},
        {path: '/trading',name:'trading' ,component: trading},
        {path: '/help', component: help},
        {path: '/announcement',
          component: announcementIndex,
          children: [
            {path: '', component: announcement},
            {path: 'announcement_list/:type', name: 'announcement_list', component: announcementList},
            {path: 'announcement_details/:type/:id', name: 'announcement_details', component: announcementDetails}
          ]
        },
        {path: '/coin_introduce', component: coin_introduce},
        // {path: 'forgetpassword', component: forgetPassword},
        {path: 'resetpw', component: forgetPassword},
        // { path: '/personal',
        //   component: personal,
        //   children: [
        //     {path: '', component: basicInfo},
        //     {path: 'basicinfo/:id', component: basicInfo},
        //     {path: 'authprove/:id', component: authProve},
        //     {path: 'codemanage/:id', component: codeManage},
        //     {path: 'setsecurity/:id', component: setSecurity},
        //   ]

        // },
        { path: '/my',
          component: personal,
          children: [
            {path: '', component: basicInfo},
            {path: 'user_info', component: basicInfo},
            {path: 'user_profiles', component: authProve},
            {path: 'user_password', component: codeManage},
            {path: 'user_security', component: setSecurity},
            {path: 'user_api', component: apiManage},
          ]

        },
        // { path: '/assert',
        //   component: assert,
        //   children: [
        //     {path: '', component: assertInfo},
        //     {path: 'assertinfo/:id', component: assertInfo},
        //     {path: 'bank_cards/:id', component: bankManage},
        //     {path: 'recharge/:id', component: recharge},
        //     {path: 'withdraw/:id', component: withdraw},
        //     {path: 'waterlook/:id', component: waterLook},
        //     {path: 'entrustrecord/:id', component: entrustRecord},
        //   ]

        // }
        { path: '/balances',
          component: assert,
          children: [
            {path: '', component: assertInfo},
            {path: 'balances_snapshot', component: assertInfo},
            {path: 'bank_cards', component: bankManage},
            {path: 'deposit', component: recharge},
            {path: 'withdraw', component: withdraw},
            {path: 'finances', component: waterLook},
            {path: 'order_records', component: entrustRecord},
          ]
        },
        { path: '/work_orders',
          component: work_orders,
          children: [
            {path: '', component: orders_create},
            {path: 'orders_create', component: orders_create},
            {path: 'orders_list', component: orders_list},
          ]

        },
      ]
    },
    { path: '*', component: miss }
  ]
})

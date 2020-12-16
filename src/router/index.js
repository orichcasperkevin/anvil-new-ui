import Vue from 'vue'
import VueRouter from 'vue-router'

import login from "@/views/auth/login"

import Home from '../views/Home.vue'

//members
import members from '../views/members/memberList.vue'
import memberAdd from '../views/members/memberAdd'
import memberAddFromCSV from '../views/members/memberAddFromCSV'
import memberDetail from '../views/members/memberDetail'

//groups
import groupsLanding from "../views/groups/groupsLanding"
import groupList from "../views/groups/groupList"
import groupDetail from "../views/groups/groupDetail"

Vue.use(VueRouter)

const routes = [
	{
		path: '/login/',
		name: 'login',
		component: login
	},
	{
		path: '/',
		name: 'Home',
		component: Home,
		meta:{
		"group": "home"
		}    
	},
	{
		path: '/members',
		name: 'members',
		component: members,
		meta:{
		"group": "members"
		}    
	},
	{
		path: '/memberAdd/',
		name: 'memberAdd',
		component: memberAdd,
		meta:{
			"group": "members"
		}
	},
	{
		path: '/member-add-from-csv/',
		name: 'memberAddFromCSV',
		component: memberAddFromCSV,
		meta:{
			"group": "members"
		}
	},
	{
		path: '/memberDetail/:id',
		name: 'memberDetail',
		component: memberDetail,
		meta:{
			"group": "members"
		}
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
	},
	//groups
	{
		path: '/groups-landing',
		component: groupsLanding,
		meta:{
			"group": "groups"
		},
		children: [
			{
				path: '',
				name: 'groupsLanding',
				component: groupList
			},
			{
				path: '/groupList/:id/:group_name',
				name: 'groupList',
				component: groupList,
				meta:{
					"group": "groups"
				},
			},
		]
	},
	{
		path:'/groupDetail/:id/',
		name: 'groupDetail',
		component: groupDetail,
		meta:{
			"group": "groups"
		},
	},
]

const router = new VueRouter({
  routes
})

export default router

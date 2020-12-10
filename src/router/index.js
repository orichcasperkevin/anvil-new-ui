import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import members from '../views/members/memberList.vue'
import memberAdd from '../views/members/memberAdd'
import memberDetail from '../views/members/memberDetail'

import login from "@/views/auth/login"

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
	}
]

const router = new VueRouter({
  routes
})

export default router

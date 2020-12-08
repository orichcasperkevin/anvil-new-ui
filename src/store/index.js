import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	authenticated: false,
	logged_in_member: '',	
	fetching_data: false,
  },
  mutations: {
	authenticated(state){
		state.authenticated = true
	},
	fetching_data(state){
		state.fetching_data = true
	},
	done_fetching(state){
		state.fetching_data = false
	},
	logout(state){
		state.authenticated = false
		var church_id = localStorage.getItem('church_id')
		var church_details = localStorage.getItem('church_details')
		var base_url_value = localStorage.getItem('base_url_value')	
		var default_message = localStorage.getItem('default_message')		

		localStorage.clear()

		if (church_id != 'null'){		
			localStorage.setItem('church_id',church_id)
		}	
		if(church_details != 'null'){
			localStorage.setItem('church_details',church_details)
		}	
		if(base_url_value != 'null'){
			localStorage.setItem('base_url_value',base_url_value)
		}		
		if(default_message != 'null'){
			localStorage.setItem('default_message',default_message)
		}	
	},
  },
  getters:{
	logged_in_member () {
        return JSON.parse(localStorage.getItem('logged_in_member'))
	},
  },
  actions: {
  },
  modules: {
  }
})

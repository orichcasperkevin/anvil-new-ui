import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import './registerServiceWorker'
import './helpers'
import './filters'

import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

// Add a request interceptor
axios.interceptors.request.use(function (config) {
	store.commit('fetching_data')
	return config;
}, function (error) {
	store.commit('done_fetching')
	return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
	store.commit('done_fetching')
	return response;
}, function (error) {
	store.commit('done_fetching')
	return Promise.reject(error);
});
//helpers
Vue.prototype.$humanizeDate = function(date_time){
	return this.$moment((new Date(date_time))).format("DD/MMM/YY")
}

//DOMAINS
var current_host = window.location.hostname //un comment this in production
//var current_host = 'admin.my-domain.com'//for dev env local use only, comment out in production

Vue.prototype.$host_name = current_host.split('.')[1]

var name = current_host.split('.')[1]
var tld = current_host.split('.')[2]
var api_server = `https://${name}.${tld}` //+ ":8000"

Vue.prototype.$DOMAIN = { value : api_server }
// Vue.prototype.$BASE_URL = { value :localStorage.getItem('base_url_value'),toString:function(){return this.value}}

Vue.prototype.$BASE_URL = { 
	value :'https://demo5237443.anvilchurch.com',
	toString:function(){
		return this.value
	}
}
  
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

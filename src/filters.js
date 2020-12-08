//FILTERS
import Vue from 'vue'
import moment from 'moment' // https://momentjs.com/
Vue.prototype.$moment = moment


// comma separated integers
Vue.filter('intcomma', function (value) {
	if (!value) return '-'
	return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
})
//format date
Vue.filter('dateformat', function(value) {
	if (value) {
	return moment(String(value)).format('DD MMM YY, hh:mm a')
	}
})
//format date
Vue.filter('fromNow', function(value) {
	if (value) {
	return moment(String(value)).fromNow()
	}
})
//location.
Vue.filter('location', function(loc_id,locations) {
	var location = locations.filter((l)=>{
		return l.id ==  loc_id
	})
	return location[0].name
})
//location.
Vue.filter('customer', function(id,customers) {
	var customer = customers.filter((c)=>{
		return c.id ==  id
	})
	return customer[0].name
})
//location.
Vue.filter('supplier', function(id,suppliers) {
	var supplier = suppliers.filter((s)=>{
		return s.id ==  id
	})
	return supplier[0].name
})

<template>
<div>
    <div class="container">                      
        <div class="d-flex justify-content-center">
        <div  class="card w-400 border-0"
                style="background-color: ghostwhite; height: 80vh; min-width: 300px;">

            <div class="card-header text-center border-0">
				<h3>Church admin login</h3>
            </div>
            <div class="card-body">
                
            <form>
                <div>
                <ul v-if="login_error.length">

                    <li v-for="(error,index) in login_error" :key="index">
                    <small class="text-danger">{{ error }}</small>
                    </li>
                </ul>

                <ul v-if="login_info.length">
                    <li v-for="(error,index) in login_info" :key="index" class="text-info">
                    <small>{{ error }}</small>
                    </li>
                </ul>

                </div>
                <div class="form-group">                 
                <label for="exampleInputEmail1">church code</label>
                <input @keyup.enter="getToken()"
                        type="number" class="form-control"                         
                        placeholder="000" v-model="church_code">
                </div>
                <div class="form-group">
                <label for="exampleInputEmail1">username</label>
                <input @keyup.enter="getToken()"
                        type="text" class="form-control"
                        id="exampleInputEmail1" aria-describedby="emailHelp"
                        placeholder="Enter username" v-model="username">
                </div>
                <div class="form-group">
                <label for="exampleInputPassword1">Password</label>
                <input @keyup.enter="getToken()"
                        type="password" class="form-control"
                        id="exampleInputPassword1" placeholder="Password"
                        v-model="password">
                </div>
				<button class="btn btn-block btn-primary"
					v-on:click="getToken()">
					login
					<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-if="logging_in"></span>
				</button>
            </form>
            </div>
        </div>
        </div>          
    </div>
</div>
</template>

<script>
export default {
    name: 'login',
    data() {
    return {        
        church_code: null,
        church_code_set : false,
        username: null,
		password: null,
		logging_in: false,
        login_error: [],
        login_info: []

    }
    },
    created(){
    this.church_code =  localStorage.getItem('church_id')
    this.church_code = this.church_code.padStart(3, '0')
    if (this.church_code != 'null'){
        this.church_code_set = true
    }
    },
    watch: {
		church_code:function(){ 
			this.login_info = []
			this.login_error = []             
			if (this.church_code.toString().length == 3){  
				var church_id = parseInt(this.church_code)
				this.$http.get(this.$BASE_URL.value + '/api/clients/client/' + church_id + '/')
					.then(response => {              
						var data = response.data              
						this.$BASE_URL.value = "https://"+ data[0].domain_url //+ ":8000"				
						localStorage.setItem('base_url_value',this.$BASE_URL.value)              
						localStorage.setItem('church_id', church_id )
						localStorage.setItem('church_details',JSON.stringify(response.data))
					})
					.catch((err) => {
						this.login_error.push("church code not set or invalid",err)        
					})
			}
		}
    },
    methods: {
		//get access token
		getToken: function () {      
			this.login_info = []
			this.login_error = []
			this.login_info.push("authenticating...")
			this.logging_in = true
			this.$http({
			method: 'post',
			url: this.$BASE_URL + '/api/token/',
			data: {
				username: this.username,
				password: this.password
			}
			}).then(response => {
				this.logging_in = false
				this.$store.commit('authenticated')
				this.login_info = []
				this.login_error = []            			
				localStorage.setItem('token', response.data.access)
				localStorage.setItem('username', this.username)
				//get logged in member data
				this.getLoggedInMemberData()          
				this.$router.push('/')                  

			}).catch((err) => {
				this.logging_in = false
				this.login_info = []
				this.login_error = []
				if(! err.response){
				this.login_error.push(err)
				}
				else{
					this.login_error.push("invalid credentials")
				}

			})
		},
		//get logged in member info
		getLoggedInMemberData: function(){
			this.$http({
			method:'get',
			url:this.$BASE_URL + `/api/members/member/${this.username}/`
			}).then(response => {
				localStorage.setItem('member_id', response.data[0].member.id)
				this.getPermisionLevel(response.data[0].member.id)
			}).catch((err) => {
				this.fetch_data_error.push(err)
			})
		},
		//get logged in member permision level
		getPermisionLevel: function(member_id){
			this.$http({
			method:'get',
			url: this.$BASE_URL + `/api/members/get-permision-level/${member_id}/`
			}).then((response)=>{                  
				var response_data = response.data            
				localStorage.setItem('access_level',response_data.level)          
			}).catch((err)=>{
				alert(err)
			})
		}
		}
}
</script>

<style>
</style>
      
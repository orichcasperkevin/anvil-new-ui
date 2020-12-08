<template>
  <div id="app">
		<!-- progress bar	 -->
		<div v-if="fetching_data" class="progress fixed-top" style="height: 3px">
			<div class="progress-bar bg-primary" 
				role="progressbar" 
				style="width: 0%; margin-left: 0%; animation: progress .5s infinite" 
				aria-valuenow="75" 
				aria-valuemin="50" 
				aria-valuemax="100"></div>
		</div>
		<div id="nav">
		</div>
			<!-- side navigation -->
			<div class="p-3 sidenav bg-white shadow">
				<!-- branding -->
				<div class="mt-5 mb-5 d-flex justify-content-center" v-if="authenticated">
					<span class="mr-5">
						<h1>
							<i class="mr-2  fa fa-user-o" aria-hidden="true"></i>
						</h1>			
						{{username}}
					</span> 
				</div>
				<div class="mt-5" v-if="authenticated">
					<ul class="list-unstyled">
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'home'}"
							@click="goto('/')">
							<i class="mr-2 fa fa-tachometer" aria-hidden="true"></i>
							dashboard
						</li>
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'members'}"
							@click="goto('/members')">
							<i class="mr-2  fa fa-id-card-o" aria-hidden="true"></i>				
							members
						</li>				
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'companies'}"
							@click="goto('/companies')">
							<i class="mr-2  fa fa-building-o" aria-hidden="true"></i>
							groups
						</li>
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'tablets'}"
							@click="goto('/tablets')">
							<i class="mr-2  fa fa-tablet" aria-hidden="true"></i>
							events
						</li>
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'users'}"
							@click="goto('/users')">
							<i class="mr-2  fa fa-user-o" aria-hidden="true"></i>
							finances
						</li>
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'logs'}"
							@click="goto('/logs')">
							<i class="mr-2  fa fa-list-ol" aria-hidden="true"></i>
							sms outbox
						</li>
						<li class="nav-item" :class="{ 'text-primary' : current_route_group == 'settings'}"
							@click="goto('/settings')">
							<i class="mr-2 fa fa-cog" aria-hidden="true"></i>
							settings
						</li>
						<!-- spacer -->
						<div style="height: 50px"></div>
						<li class="nav-item" @click="logout()">
							<i class="mr-2  fa fa-sign-out" aria-hidden="true"></i>
							logout
						</li>
					</ul>
				</div>
			</div>
		<!-- aplication content -->
		<div id="main_app" class="bg-light main-app">		
			<keep-alive include="">
				<router-view 
					class="p-4"
					v-on:newLogin="newLogin"
					v-on:closeNav="closeNav"
					v-on:openNav="openNav"
					v-on:alert="showAlert"
					v-on:success="showSuccess"
				/>
			</keep-alive>			
		</div>
	</div>
</template>

<script>
	// @ is an alias to /src
	export default {
		name: 'App',
		data () {
			return{
			}
		},
		created(){
			this.$store.commit("logout")
			this.checkLoggedIn()
		},
		computed:{
			logged_in_user(){
				return this.$store.get('username')
			},
			authenticated(){
				return this.$store.state.authenticated
			},
			current_route_group(){
				return this.$route.meta.group
			}
		},
		watch:{
			authenticated(){
				if (! this.authenticated){
					this.$router.push("/login")	
				}
			}
		},
		mounted(){
			if (! this.authenticated){
				this.$router.push("/login")				
			}
		},
		methods:{
			checkLoggedIn() {
				if (! localStorage.getItem("token")) {
					this.authenticated = false
					this.$router.push("/login")
					return false
				}
				else{
					this.authenticated = true
					return true
				}
			},
			logout: function(){
				this.$store.commit("logout")
			},
			goto: function(route_name){
				this.$router.push(route_name)
			},
		}
	}
</script>

<style lang="scss">
	@import './assets/styles/main.scss'
</style>

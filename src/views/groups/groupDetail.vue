<template>
    <div>
        <!-- this compnent requires text message modal -->
        <textmessage :memberIds="member_ids"/>     
        <body v-if="group.response.length" class="bg-light">
            <div class="container bg-light">
                <div class="row ml-2">
                <div class="col" v-for="(data,index) in group.response" :key="index">
                    <h3 class="row">
                        <b>{{data.name}}</b>
                    </h3>
                    <p class="row">{{data.description}}  </p>
                </div>
                </div>
            </div>
            <div class="container">
				<div class="row">
					<div class="col-sm-10 col-md-8 col-lg-2 mb-3 rounded bg-white" style="height: 100vh;">
						<h5 class="mt-3 rounded bg-light p-1">Actions</h5>
						<nav class="mt-5 nav nav-pills " id="v-pills-tab" role="tablist" aria-orientation="vertical">
							<a class="action-list list-group-item list-group-item-action border-0 active"
								data-toggle="pill" href="#member" role="tab" aria-controls="members" aria-selected="true" >
								<i class="mr-2  fa fa-user-o" aria-hidden="true"></i> members
							</a>
							<a class="action-list list-group-item list-group-item-action border-0 "
								data-toggle="pill" href="#activity" role="tab" aria-controls="activity" v-on:click="getGroupActivity()">
								<i class="mr-2 fa fa-cog" aria-hidden="true"></i>  activity
							</a>
						</nav>
						<hr>
						<button type="button" class="text-danger list-group-item list-group-item-action border-0"
							data-toggle="modal" data-target="#deleteGroupModal">
							<i class="mr-2 fa fa-trash" aria-hidden="true"></i>delete group
						</button>
					</div>
					<div class="tab-content col" >
						<!-- GROUP MEMBERS -->
						<div class="tab-pane fade show active" id="member" role="tabpanel" aria-labelledby="profile-tab">
							<div v-if = "fetch_data_error.length == 0">
								<div class="d-flex justify-content-between"> 
									<div class="d-flex">
										<span aria-current="page" v-for="(data,index) in group.response" :key="index"> 
											<h3>Members</h3>
										</span>
										<div class="d-flex ml-3">
												<i v-if="! searching" class="p-2 fa fa-search" aria-hidden="true"></i>
												<span v-else class="p-2 mt-1 mr-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
												<input type="text" class="ml-2 form-control" placeholder="search member ..." v-model="name_search">
										</div>
									</div>                  									
									<div class="btn-group" style="padding: 0px 0px 25px 0px">
										<button class="btn btn-success" href="#" data-toggle="modal" data-target="#addMemberToGroup" style="text-decoration: none">
											+ Add member to group
										</button>                 
									</div>
								</div>
							</div>
							<!-- table and dependencies -->
							<div class="p-2 bg-white rounded">													
								<!-- selections and actions -->
								<div class="d-flex justify-content-between rounded bg-light">
									<div class ="d-flex">
										<!-- selector -->
										<div class="p-3">
											<label class="anvil-checkbox">
												<input type="checkbox" :value=true v-model="all_members">
												<span class="anvil-checkmark"></span>
											</label><span class="mt-4" style="position:absolute"></span>
										</div>
										<div class="d-flex p-2 float float-left" v-if="member_ids.length">
											<div class="p-2 ml-2">
												{{member_ids.length}} selected
											</div>
											<button class="ml-2 btn  btn-outline-secondary" data-toggle="modal" data-target="#textModalCenter">
												<i class="fa fa-commenting-o" aria-hidden="true"></i>
												send text
											</button>										
											<button class="ml-2 btn  btn-outline-danger" data-toggle="modal" data-target="#removeMembersModal">
												<i class="fa fa-trash" aria-hidden="true"></i>
												remove from group
											</button>
										</div>
									</div>
									<!-- page navigation -->
									<div class="d-flex justify-content-end">
										<button class="btn" @click="prevPage"
											:disabled="pageNumber == 0">
											<i class="arrow left"></i>
										</button>
										<span class="p-3">{{pageNumber + 1}} / {{pageCount}}</span>
										<button class="btn" @click="nextPage"
											:disabled="(pageNumber+1) == pageCount">
											<i class="arrow right"></i>
										</button>
									</div>
								</div>
								<table class="table table-responsive-sm table-borderless">
								<tbody>
									<tr>                            
										<th class="anvil-checkbox"></th>
										<th>names</th>
										<th>role</th>
									</tr>
									<tr v-for="(data,index) in paginatedData" :key="index"> 
									<td >                                  
											<label class="anvil-checkbox">
												<input multiple type="checkbox" :value=data.user_id v-model="member_ids">
												<span class="anvil-checkmark"></span>
											</label>
									</td>                                               
									<td >
										<img v-if = "data.member_gender == 'M'" style = "height: 32px " src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
										<img v-if = "data.member_gender == 'F'" style = "height: 32px " src="@/assets/avatars/icons8-user-female-skin-type-4-40.png">
										<img v-if = "data.member_gender == 'R'" style = "height: 32px " src="@/assets/avatars/icons8-contacts-96.png">
										<router-link :to="`/memberDetail/`+ data.user_id">
										<span class = "text-secondary">{{data.member_full_name}} </span>
										</router-link>
									</td>
									<td class="text-muted">
										{{data.role_name}}
									</td>
									</tr>
								</tbody>
								</table>
								<div v-if="! members.length" class="text-center text-muted">
									<h3>Oops!</h3>
									<h3>Found no members in the group</h3>
									<p>add members to group so that we can list them</p>
								</div>	
							</div>
						</div>
						<!-- GROUP ACTIVITY -->
						<div class="tab-pane fade" id="activity" role="tabpanel" >   
							<hr class="d-sm-block d-lg-none">  
							<h3>Activity</h3>            
							<div v-if="group_meetings" class="mt-3">
								<div v-if="group_meetings.length" class="rounded bg-white p-2">                        
									<table class="table table-responsive-sm table-borderless">
										<thead>
										<tr>                                
											<th scope="col">event</th>
											<th scope="col">start</th>
											<th scope="col">end</th>
											<th scope="col">attenders</th>
										</tr>
										</thead>                                                      
										<tbody>
										<tr v-for="(meeting,index) in group_meetings" class="text-muted" :key="index">                                
											<td>                                    
												<router-link class="text-muted"  :to="`/eventDetail/`+ meeting.event.id + `/`">                                                         
												{{meeting.event.title}}
												</router-link>
											</td>
											<td>{{meeting.event.start}}</td>
											<td>{{meeting.event.end}}</td>
											<td>
												<span class="badge badge-pill badge-secondary">
													{{meeting.event.attendees}}
												</span>
												of
												<span class="badge badge-pill badge-secondary">
													{{meeting.group.number_of_members}}
												</span>
											</td>
										</tr>                              
										</tbody>
									</table>
								</div>
								<div class="text-muted text-center" v-else>
									<h3>Oops!</h3>
									<h3>Group has not had any meetings recently</h3>
									<p>mark event registers by this group to get content here</p>
								</div>
							</div>                  
						</div>
					</div>
					<section >
						<!-- Modal add member to group -->
						<div class="modal fade" id="addMemberToGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content">
								<div class="modal-header">
								<h5 class="modal-title" id="exampleModalCenterTitle">add member to group</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								</div>
								<div class="modal-body">                                                        
									<div class="d-flex justify-content-around">
										<label><b>member</b></label>           
										<div class="d-flex flex-column">
											<searchmember v-on:memberSelected="onMemberSelected" />
											<span v-if="checking_if_in_group"
												class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
											</span>
											<span v-if="member_in_group" class="text-danger">
												<small>member already in group</small>
											</span>
										</div>                                                         
									</div>  
									<hr>
									<div class="mt-3 d-flex justify-content-around">
										<label><b>role</b></label>
										<div class="d-flex justify-content-around">
											<select class="ml-4 form-control" v-model="role" >
												<option v-for="(data,index) in roles.response" :key="index" :value="data.id" >{{data.role}}</option>
											</select>
											<button class="ml-2 btn btn-outline-success" data-toggle="modal" data-target="#addRole">
												add
											</button>
										</div> 
									</div>                                                         
								</div>
								<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
								<button v-if="selectedMember"
									type="button" class="btn btn-success " v-on:click="addMemberToGroup()">
									<b>+</b> add member
									<span v-if="adding_member"
										class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
									</span>
								</button>
								</div>
							</div>
							</div>
						</div>
						<!-- add role Modal -->
						<div class="modal fade" id="addRole" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content">
								<div class="modal-header">
								<h5 class="modal-title" id="exampleModalCenterTitle">add a role</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								</div>
								<div class="modal-body">                                
										<form >
												<div class=" row form-group">
												<label class="col-3"><b>name:</b></label>
												<input type="text" class="col-8 form-control" placeholder="enter name of the role" v-model="role_name">                                        
												</div>
												<div class="row form-group">
														<label class="col-3"><b>description:</b></label>
														<textarea type="text" class="col-8 form-control" rows='3' v-model="role_description"></textarea>                                                   
												</div>                                                                                                                                                                                                                            
										</form>
								</div>
								<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>                        
								<button type="button" class="btn btn-success" v-on:click="addRole()">
								{{add_role_button_text}} 
								<span v-if="adding_member"
									class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
								</span>
								</button>
								</div>
							</div>
							</div>
						</div>
						<!-- Modal delete member-->
						<div class="modal fade" id="removeMembersModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content">
								<div class="modal-header">
								<h5 class="modal-title" id="exampleModalCenterTitle">remove members</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								</div>
								<div class="container mt-5 mb-5">    
								<span class="d-flex fex-row"><h2 class="text-muted font-weight-bold">{{member_ids.length}} </h2>members</span>
								<h4 class="text-danger">These members alongside with all their data will be removed from the group</h4>
								<i>this action is irreversible, are you sure that this is what you want??</i>
								</div>
								<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="setAssignGroupButtonText('assign group')">Close</button>
								<button type="button" class="btn btn-danger" v-on:click="removeMembers()">
									remove members
									<span v-if="removing_members"
										class="spinner-border spinner-border-sm" 
										role="status" aria-hidden="true"></span>
								</button>
								</div>
							</div>
							</div>
						</div>  
						<!-- Modal delete member-->
						<div class="modal fade" id="deleteGroupModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
							<div class="modal-dialog modal-dialog-centered" role="document">
							<div class="modal-content">
								<div class="modal-header">
								<h5 class="modal-title" id="exampleModalCenterTitle">delete group</h5>
								<button type="button" class="close" data-dismiss="modal" aria-label="Close">
									<span aria-hidden="true">&times;</span>
								</button>
								</div>
								<div class="container mt-5 mb-5">                              
								<h4 class="text-danger">This Group alongside with all its data will be deleted</h4>
								<i>this action is irreversible, are you sure that this is what you want??</i>
								</div>
								<div class="modal-footer">
								<button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="setAssignGroupButtonText('assign group')">Close</button>
								<button type="button" class="btn btn-danger" v-on:click="deleteGroup()">
									delete group
									<span v-if="removing_members"
										class="spinner-border spinner-border-sm" 
										role="status" aria-hidden="true"></span>
								</button>
								</div>
							</div>
							</div>
						</div>            
					</section>
				</div>
            </div>
        </body>
        <body v-else class="text-center h1 text-muted">
        group not found, it might be deleted
        </body>
    </div>
</template>
    
<script>
import searchmember from '@/components/searchmember.vue'
import textmessage from '@/components/textmessage.vue'
export default {
	name: 'groupDetail',
	components: { searchmember,textmessage },
	data () {
	return {
		group: null,
		fetch_data_error: [],
		members: null,
		initial_member_list: null,
		name_search: '',
		debounce_timeout: null,
		searching: false,
		foundItems: null,
		fetch_group_activity_data_error: [],
		group_meetings: null,
		activity_selected: false,
		//paginate members list
		pageNumber: 0,  // default to page 1
		size:100,
		//add member
		member_in_group: null,
		checking_if_in_group:false,
		role: null,
		selectedMember: null, 
		roles: null,
		added_member: [],
		member_ids: [],
		message: "",
		sms_status: [],
		sending_message:false,
		adding_member:false,
		//add role
		role_name: null,
		role_description: null,
		enable_role_button: false,
		add_role_button_text: '+ add role',
		added_role: [],
		//all members
		all_members:true,
		removing_members:false
	}
	},
	created() {
		this.fetchData()  
		this.getRoles()
	},
	computed:{
		pageCount(){		
			if (this.members){
				let l = this.members.length,
					s = this.size;
				return Math.ceil(l/s);
			}
			else{
				return 0
			}
		},
		paginatedData(){
			const start = this.pageNumber * this.size,
				end = start + this.size;
			return this.members.slice(start, end);
		}
	},
	watch: {
		name_search: function(){
			clearTimeout(this.debounce_timeout)				
				this.debounce_timeout = setTimeout(()=>{
					this.searching = true
					this.searchByFirstName()
					this.searching = false
			},800)
		},
		role_name: function (){
			if (this.role_name.length > 0 && this.role_description.length > 0){
				this.enable_role_button = true
			}
		},
		role_description: function (){
			if (this.role_description.length > 0 && this.role_name.length > 0){
				this.enable_role_button = true
			}
		},
		all_members: function(){
				if (this.all_members != true){
					this.member_ids = []
				}else{
					this.member_ids = this.all_member_ids
				}
			}
		},
	methods: {
		nextPage(){
			this.pageNumber++
		},
		prevPage(){
			this.pageNumber--
		},	
		//select member
		onMemberSelected (value) {            
			this.selectedMember = value
			this.checkIfMemberIsInGroup(value,this.$route.params.id)
		},
		/* Set the height of the bottom navigation to 300px */
		openAction: function() {            
			document.getElementById('bottom-actions-tab').style.height = "200px"                    
		},
		/* Set the height of the bottom navigation to 0 */
		closeActions:function() {   
			document.getElementById('bottom-actions-tab').style.height = "0px"    
		},
		searchByFirstName: function(){
			if (this.name_search.length){
				this.members = this.members.filter((member)=>{
					return member.member_full_name.toLowerCase().includes(this.name_search.toLowerCase())
				})
			}else{
				this.members = this.initial_member_list				       
			}
			this.all_members = false
		},
		checkIfMemberIsInGroup: function(member_id,group_id){
			this.checking_if_in_group = true
			this.$http.get(this.$BASE_URL + '/api/groups/check-if-member/' + member_id +'/is-in-group/' + group_id +'/')
			.then(response => {
				this.member_in_group = response.data                  
				this.checking_if_in_group = false
			})
			.catch((err) => {
				this.checking_if_in_group = false
				alert(err)          
			})
		},
		addMemberToGroup: function(){      
		if (this.selectedMember && this.role && ! this.member_in_group){
			var group_id
			var obj = this.group.response
			group_id = obj["0"].id
			
			this.adding_member = true
			this.$http({ method: 'post', url: this.$BASE_URL + '/api/groups/add-member-to-group/',
				data: {           
					church_group: group_id,
					member: this.selectedMember,
					role: this.role
				}
			}).then(() => {
				this.adding_member = false                        
				this.role = ''            
				this.selectedMember = null
				alert("member successfully added")
				this.fetchData()
			})
			.catch((err) => {
				this.adding_member = false
				this.selectedMember = null
				alert("an error occered while attempting to add member, check your data and try again" + err)            
			})
		}
		else{
			alert("error adding member to group")
		}
		},
		getGroupActivity: function() {
			this.activity_selected = true        
			this.$http.get(this.$BASE_URL + '/api/events/events-by-group/' + this.$route.params.id + '/')
			.then(response => {
				this.group_meetings = response.data 
			})
			.catch((err) => {
				alert(err)
			})
		},
		
		addChannelNotification: function(){
			this.sending_message = true
			this.$http({ method: 'post', url: this.$BASE_URL + '/api/social/add-channel-notification/',
			data: {
				sender_id: this.$session.get('member_id'),
				group_name: this.group.response[0].name,
				message: this.message,
				website: true,
			}
			}).then(()=> {
				this.sending_message = false
				alert("notification sent succesfully")
			})
			.catch((err) => {
				this.sending_message = false
				alert(err)
			})
		},
		//add role        
		addRole: function() {
			this.enable_role_button = false
			this.add_role_button_text = 'adding role...'            
			this.$http({ method: 'post', url: this.$BASE_URL + '/api/members/role-list/',
				data: {
					role: this.role_name,
					description: this.role_description,  
					is_group_role: true            
				}
				}).then(response => {
				this.getRoles()
				this.added_role.push(response.data)                    
				this.role_name = ''
				this.role_description = '' 
				this.add_role_button_text = '+ add role'
				this.enable_role_button = true
				alert("role succesfuly added")                                 
				})
				.catch(() => {
					this.enable_role_button = true 
				})                
		},
		getRoles: function(){
			this.$http.get(this.$BASE_URL + '/api/members/role-list/')
			.then(response => {                    
				var response_data = response.data
				var group_roles = response_data.filter((item)=>{
				return item.is_group_role || item.role == 'member' || item.role == 'group admin'                  
				})
				this.roles = {"response": group_roles }
			})
			.catch((err) => {
				this.fetch_data_error.push(err)
			})
		},
		fetchData() {      
			this.fetch_data_error = []
			this.$http.get(this.$BASE_URL + '/api/groups/church-group/' + this.$route.params.id + '/')
			.then(response => {
				this.group = {"response": response.data }          
			})
			.catch((err) => {
				this.fetch_data_error.push(err)          
			})

			this.$http.get(this.$BASE_URL + '/api/groups/church-group-members/' + this.$route.params.id + '/')
			.then(response	 => { 
				this.all_member_ids = []         
				this.members = response.data
				this.initial_member_list = this.members
				this.member_ids = []       
				for (var data in this.members){
					this.member_ids.push(this.members[data].user_id)            
				}
				this.all_member_ids = this.member_ids
				this.all_members = false
			})
			.catch((err) => {
				this.fetch_data_error.push(err)
			})
		},
		deleteGroup:function(){
			this.removing_members = true
			this.$http.delete(this.$BASE_URL + '/api/groups/church-group/' + this.$route.params.id + '/')
			.then(() => {
				alert("group deleted")
				this.removing_members = false
			})
			.catch((err) => {
				this.removing_members = false
				alert(err)          
			})
		},
		removeMembers:function(){
			this.removing_members = true
			this.$http.post(this.$BASE_URL + '/api/groups/remove-members-from-group/',
				{
				group_id:this.$route.params.id,
				member_ids:this.member_ids
				}
			)
			.then(() => {
				alert("members removed")  
				this.removing_members=false        
				this.fetchData()
			})
			.catch((err) => {          
				alert(err)     
				this.removing_members=false     
			})
		}

	}
}
</script>


<style >
</style>

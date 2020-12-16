<template>
	<div class="">
		<!-- this compnent requires text message modal -->
		<textmessage :memberIds="member_ids"/>

		<div class="d-flex">
			<h3 class="mb-4">
				<i class="mr-2  fa fa-id-card-o" aria-hidden="true"></i>
				Members
			</h3>
		</div>
		<div class="container row">
			<!-- filters -->
			<section class="col-lg-2 rounded shadow bg-white">
					<h5 class="mt-3 rounded bg-light p-1">Filters</h5>
					<div class="mt-5 rounded bg-light">	
						<p class="ml-2">Age</p>								
						<div class="d-flex flex-row justify-content-center">										
							<div class="form-group p-1">
								<small>min : </small><small><a href="#" v-on:click="resetAge" class="">
									<i class="fa fa-refresh" aria-hidden="true"></i>
								</a></small>
								<input type="number" class="form-control" id="searchInput"  placeholder="min age" v-model = "min_age" style="max-width:100px">
							</div>
							<div class="form-group p-1 ">
								<small>max : </small><small><a href="#" v-on:click="resetAge" class="">
									<i class="fa fa-refresh" aria-hidden="true"></i>
								</a></small>
								<input type="number" class="form-control" id="searchInput" placeholder="max age" v-model = "max_age" style="max-width:100px">
							</div>										
						</div>
					</div>
					<div class="mt-5 rounded bg-light">
						<p class="ml-2">Gender</p>
						<div class="mr-2 d-flex justify-content-end">									
							<small><a href="#" v-on:click="resetGender">
								<i class="fa fa-refresh" aria-hidden="true"></i>
							</a></small>
						</div>
						<div class="d-flex" style="padding : 10px">										
							<input class="ml-2" type="radio" name="optradio" value="M" v-model="gendersearch"> <span class="ml-2">Male</span>
							<input class="ml-2" type="radio" name="optradio" value ="F" v-model="gendersearch"> <span class="ml-2">Female</span>										
						</div>
					</div>
			</section>
			<!-- list Members -->
			<section class="col-lg-10">
				<div class="tab-pane fade show active" 
					id="pills-home" 
					role="tabpanel" 
					aria-labelledby="pills-home-tab">
					<div class="d-flex justify-content-between mb-5 mt-5">
						<!-- right -->
						<section class="d-flex">
							<div class="d-flex ml-2">
								<i v-if="! searching" class="p-2 fa fa-search" aria-hidden="true"></i>
								<span v-else class="p-2 mt-1 mr-2 spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
								<input type="text" class="col-8 form-control" placeholder="Search..." v-model="first_name_search">
							</div>
							<div class="">
								<button class="btn btn-outline-primary btn-sm"
									@click="$exportTable('expensesTable','Members.csv')">                                                                
									export
								</button>	
							</div>
						</section>
						<!-- add member buttons -->  
						<div class="btn-group">
								<button style="text-decoration: none; cursor: pointer;"
									class="btn btn-success"
									data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" data-reference="parent">
									+ Add member
								</button>
								<div class="dropdown-menu rounded shadow-sm border-0" aria-labelledby="dropdownMenuReference">
									<router-link :to="{name: 'memberAdd'}" class="dropdown-item" style="text-decoration: none">								
										Add member						
									</router-link>
									<router-link :to="{name: 'memberAddFromCSV'}" class="dropdown-item" style="text-decoration: none">								
										Import from CSV						
									</router-link>                  
								</div>
						</div>                      
					</div>
					<!-- TABLE AND DEPENDENCIES -->
					<div class="rounded shadow border border-light p-2 bg-white">
						<!--actions and pagination -->
						<div class="bg-light d-flex justify-content-between rounded">   
							<!-- select all. and actions-->
							<div class =" d-flex">
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
									<button class="ml-2 btn  btn-outline-secondary"  data-toggle="modal" data-target="#assignModalCenter">
										<i class="fa fa-users" aria-hidden="true"></i>
										assign group
									</button>
									<button class="ml-2 btn  btn-outline-danger" data-toggle="modal" data-target="#deleteMemberModal">
										<i class="fa fa-trash" aria-hidden="true"></i>
										delete
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
						<!-- simple table -->
						<table class="table table-responsive-sm table-borderless" 
							v-if = "(min_age == 0 || min_age == '') && (max_age == 150 || max_age  == '')">					
							<thead>
								<tr>									
									<th class="row ml-1 mb-5">
									<!-- actions drop down on phone -->
									</th>															
									<th id="numbers">#</th>						
									<th>Name</th>
									<th>Phone number</th>
									<th>Marital status</th>
									<th>Age</th>
								</tr>
							</thead>
							<tbody>
								<tr v-for="(data,index) in paginatedData" :key="index">							
									<td >
										<label class="anvil-checkbox">
											<input multiple type="checkbox" :value=data.member.id v-model="member_ids">
											<span class="anvil-checkmark"></span>
										</label>							
									</td>							
									<td class="p-3 text-muted">{{ (pageNumber * size) + (index + 1)}}</td>
									<td>
										<span v-if="! detail_view">
											<img v-if = "data.gender == 'M'" style = "height: 32px" src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
											<img v-if = "data.gender == 'F'" style = "height: 32px" src="@/assets/avatars/icons8-user-female-skin-type-4-40.png">
											<img v-if = "data.gender != 'M' && data.gender != 'F'" style = "height: 32px " src="@/assets/avatars/icons8-contacts-96.png">
										</span>
										<router-link :to="`/memberDetail/`+ data.member.id">
											<span class="text-secondary">
												{{data.member.first_name}} {{data.member.last_name}}
											</span>										
										</router-link>
									</td>
									<td >
										<span class="ml-4 text-secondary">
											<i v-if="data.phone_number">{{data.phone_number}}</i>
										</span>
									</td>                                                                       
									<td>																														
										<span v-if="data.marital_status == 'S'">Single</span>
										<span v-if="data.marital_status == 'M'">Married</span>
										<span v-if="data.marital_status == 'D'">Divorced</span>
										<span v-if="data.marital_status == 'W'">Widowed</span>									
										<span v-if="data.marital_status == ''">-</span>
									</td>
									<td>																				
										<i v-if="data.age">{{data.age}}</i>	
										<i v-else>-</i>									
									</td>
								</tr>
							</tbody>
						</table>
						
						<!-- filtered table -->
						<table class="table table-responsive-sm table-borderless" v-if = "min_age > 0  || max_age != 150 ">
								<thead>
									<tr>									
										<th class="row ml-1 mb-5">
											<label class="anvil-checkbox">
												<input type="checkbox" :value=true v-model="all_members">
												<span class="anvil-checkmark"></span>
											</label><span class="mt-4" style="position:absolute">All ({{foundItems}})</span>
										<!-- actions drop down on phone -->
										</th>															
										<th></th>
										<th >Gender</th>
										<th >Phone number</th>
										<th >Marital status</th>
										<th >Age</th>
									</tr>
								</thead>
								<tbody>
									<tr v-for="(data,index) in paginatedData" :key="index">																				
									<td>							
										<label class="anvil-checkbox">
										<input multiple type="checkbox" :value=data.member.member.id v-model="member_ids">
										<span class="anvil-checkmark"></span>
										</label>
									</td>	
									<td class="text-muted">{{ (pageNumber * size) + (index + 1)}}</td>					
									<td >	
										<img v-if = "data.member.gender == 'M'" style = "height: 32px " src="@/assets/avatars/icons8-user-male-skin-type-4-40.png">
										<img v-if = "data.member.gender == 'F'" style = "height: 32px " src="@/assets/avatars/icons8-user-female-skin-type-4-40.png">
										<img v-if = "! data.member.gender" style = "height: 32px " src="@/assets/avatars/icons8-contacts-96.png">
										<router-link :to="`/memberDetail/`+ data.member.member.id">
										<span class = "text-secondary">{{data.member.member.first_name}} {{data.member.member.last_name}}</span>
										</router-link>									
									</td>
									<!-- if detail_view -->
									<td >										
										{{data.member.gender}}
									</td>
									<td>
										<span class="ml-4 text-secondary">
										<i v-if="data.member.phone_number">{{data.member.phone_number}}</i>
										</span>
									</td>
									<td >																														
										<span v-if="data.member.marital_status == 'S'">Single</span>
										<span v-if="data.member.marital_status == 'M'">Married</span>
										<span v-if="data.member.marital_status == 'D'">Divorced</span>
										<span v-if="data.member.marital_status == 'W'">Widowed</span>									
										<span v-if="data.member.marital_status == ''">-</span>
									</td>
									<td >																				
										<i v-if="data.member.age">{{data.member.age}}</i>	
										<i v-else>-</i>									
									</td>
									</tr>						
								</tbody>
								</table>
						<div class="p-3 d-flex justify-content-center"
							v-if="members && ! members.length">
							<span class="p-2">No records to show</span>                           
						</div>
						<div class="p-3 d-flex justify-content-center"
							v-if="! members">
							<div class="spinner-border p-3 m-5" role="status">
								<span class="sr-only">Loading...</span>
							</div>
						</div>	
					</div>            	
				</div>
			</section>
		</div>



		<!-- modals -->
		<section>
			<!-- Modal assign group -->
			<div class="modal fade" id="assignModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content">
					<div class="modal-header border-0">
						<h5 class="modal-title" id="exampleModalCenterTitle">Assign selected members to group</h5>
						<button type="button" class="close" id="closeAssignGroupModal" data-dismiss="modal" aria-label="Close">
						<span aria-hidden="true">&times;</span>
						</button>
					</div>
					<div class="container mt-5 mb-5">
						<span class="d-flex fex-row"><h3 class="text-muted">{{member_ids.length}} </h3>members</span>
						<label><b>select group :</b></label>
						<select class=" form-control" v-model="group_id" >
							<option v-for="(group,index) in groups" :key="index" :value="group.id" >{{group.name}}</option>
						</select>
					</div>
					<div class="modal-footer border-0">
						<button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="setAssignGroupButtonText('assign group')">Close</button>
						<button type="button" class="btn btn-success" v-on:click="assignGroup()">
						assign group
						<span v-if="adding_members_to_group"
								class="spinner-border spinner-border-sm"
								role="status" aria-hidden="true"></span>
						</button>
					</div>
					</div>
				</div>
			</div>
			<!-- Modal delete member-->
			<div class="modal fade" id="deleteMemberModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
				<div class="modal-dialog modal-dialog-centered" role="document">
					<div class="modal-content">
						<div class="modal-header">
							<h5 class="modal-title" id="exampleModalCenterTitle">delete members</h5>
							<button type="button" id="closeDeleteMembersModal	" class="close" data-dismiss="modal" aria-label="Close">
								<span aria-hidden="true">&times;</span>
							</button>
						</div>
						<div class="container mt-5 mb-5">
							<span class="d-flex fex-row"><h2 class="text-muted font-weight-bold">{{member_ids.length}} </h2>members</span>
							<h4 class="text-danger">These members alongside with all their data will be deleted</h4>
							<i>this action is irreversible, are you sure that this is what you want??</i>
						</div>
						<div class="modal-footer">
							<button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="setAssignGroupButtonText('assign group')">Close</button>
							<button type="button" class="btn btn-danger" v-on:click="deleteMembers()">
								delete members
								<span v-if="deleting_member"
									class="spinner-border spinner-border-sm"
									role="status" aria-hidden="true"></span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>
<script>
import textmessage from '@/components/textmessage.vue'
export default {
	name: 'Members',
	components: {textmessage},
	data(){
		return{
			search:null,
			Members:null,
			debounce_timeout:null,
			detail_view:false,
			actions_list:false,
			fetch_data_error: [],
			all_members: true,
			all_member_ids: [],
			members: null,
			foundItems: null,
			groups:null,
			group_id:null,
			//paginate members list
			pageNumber: 0,  // default to page 1
			size:100,
			//search for member
			first_name_search: null,
			searching: null,
			gendersearch: null,
			min_age: 0,
			max_age:150,
			member_ids: [],
			//assigning groups
			adding_members_to_group: false,
			assign_group_button_text: "assign group",
			//deleting member
			deleting_member:false,
			//add member to group.
			selectedMember: null,
			adding_member_detail: false,	   	 
			group_ids: [],
			groups_added_into:[]

		}
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
	mounted(){
		this.getMembers()
		this.getGroups()
	},
	watch: {
	//search for member
		all_members: function(){
			if (this.all_members != true){
				this.member_ids = []
			}
			else{
				this.member_ids = this.all_member_ids
			}
		},
		first_name_search: function () {
			if (this.first_name_search.length > 0){
				clearTimeout(this.debounce_timeout)
				this.debounce_timeout = setTimeout(()=>{
					this.searchByFirstName()
				},800)
			}else{
				this.searching = false
				this.getMembers()
			}
		},
		gendersearch: function (){
			if (this.min_age !=0 && this.min_age != '' && this.min_age > 0){
				clearTimeout(this.debounce_timeout)
				this.debounce_timeout = setTimeout(()=>{
					this.searchByAge()
				},800)
			}
			else{
				clearTimeout(this.debounce_timeout)
				this.debounce_timeout = setTimeout(()=>{
					this.searchByGender()
				},800)
			}
		},
		min_age: function(){
			if (this.min_age != '' && this.min_age > 0){
				clearTimeout(this.debounce_timeout)
				this.debounce_timeout = setTimeout(()=>{
					this.searchByAge()
				},800)
			}else{
				this.getMembers()
			}
		},
		max_age:function(){
			if (this.max_age != '' || this.max_age != 150){
				this.searchByAge()
				clearTimeout(this.debounce_timeout)
				this.debounce_timeout = setTimeout(()=>{
					this.searchByFirstName()
				},800)
			}else{
				this.getMembers()
			}
		}
	},
	methods:{	
		nextPage(){
			this.pageNumber++
		},
		prevPage(){
			this.pageNumber--
		},	
		resetAge: function(){
			this.min_age= 0
			this.max_age=150
			this.getMembers()
		},
		resetGender: function(){
			this.gendersearch =  null
			this.getMembers()
		},
		getMembers() {
			this.all_member_ids = []
			this.fetch_data_error = []
			//else try the network
			this.$http.get(this.$BASE_URL + '/api/members/member-list/')
			.then(response => {
				this.members = response.data
				this.member_ids = []
				for (var i in this.members){
					console.log(this.members[i])
					this.member_ids.push(this.members[i].member.id)
				}
				this.all_member_ids = this.member_ids
				this.all_members = false
			})
			.catch((err) => {
				alert(err)
			})
		},
		// search for member
		searchByFirstName: function () {
			if (this.first_name_search.length > 0){
				this.searching = true
				this.$http.get(this.$BASE_URL + '/api/members/filter-by-first_name/' + this.first_name_search +'/')
				.then((response)=> {
					this.min_age = 0
					this.max_age = 150
					this.members = response.data 
					this.member_ids = []
					for (var data in this.members){
						this.member_ids.push(this.members[data].member.id)
					}
					this.searching = false
					this.all_member_ids = this.member_ids
				})
				.catch((error)=> {
					alert(error)
				})
				}
		},
		searchByGender() {
			this.$store.dispatch('update_isLoading', true)
			this.$http.get(this.$BASE_URL + '/api/members/filter-by-gender/'+ this.gendersearch)
			.then(response => {
				this.min_age = 0
				this.max_age = 150
				this.members = response.data							
				this.member_ids = []
				for (var data in this.members){
					this.member_ids.push(this.members[data].member.id)
				}
				this.all_member_ids = this.member_ids
			})
			.catch((err) => {
				alert(err)
			})
		},
		searchByAge() {
			if (this.min_age != '' && this.max_age != ''){
				var gender = "all"
				if (this.gendersearch){
					gender = this.gendersearch
				}
				this.$http.get(this.$BASE_URL + '/api/members/filter-by-age/'+ this.min_age +'/' + this.max_age + '/' + gender + "/")
				.then(response => {
					this.members = response.data
					this.member_ids = []
					for (var data in this.members){
						this.member_ids.push(this.members[data].member.member.id)
					}
					this.all_member_ids = this.member_ids
				})
				.catch((err) => {
					alert(err)
				})
			}
		},
		//get groups
		getGroups: function(){      			
				this.$http.get(this.$BASE_URL + '/api/groups/church-group-list/')
				.then(response => {
					this.groups = response.data
				})
				.catch((err) => {
					alert(err)
				})
		},
		//assign groups
		assignGroup: function(){
			var group_id = this.group_id
			this.assign_group_button_text = "assigning to group ..."
			this.adding_members_to_group = true
			this.$http({ method: 'post', url: this.$BASE_URL + '/api/groups/bulk-add-member-to-group/',
			data: {
				group_id: group_id,
				member_ids: this.member_ids,
				role_id: null
			}
			}).then(() => {
				this.adding_members_to_group = false
				document.getElementById("closeAssignGroupModal").click()
			})
			.catch((err) => {
				alert(err)

			})

		},
		//delete members
		deleteMembers:function(){
			this.deleting_member = true
			this.$http.post(this.$BASE_URL + '/api/members/bulk-delete-members/',
			{
				member_ids:this.member_ids
			}
			)
			.then(() => {
				this.deleting_member = false
				document.getElementById("closeDeleteMembersModal").click()
				this.getMembers()
			})
			.catch((err)=> {
				alert(err)
				this.deleting_member = false
			})
		}

}
}
</script>
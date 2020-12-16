<template>
        <div>           
            <div class="">
                <div class="w-100 d-flex justify-content-between">
                    <div>
                        <h3 ><i class="mr-2 fa fa-folder-open" aria-hidden="true"></i>{{group_name}}</h3>
                    </div>                         
                    <div>
                        <button v-if="group_name" class="btn btn-success" data-toggle="modal" data-target="#addGroup">
                            <b>+</b> add to {{group_name}}
                        </button> 
                    </div>
                </div>                                               
                <div v-if = "fetch_data_error.length == 0" class="mt-4 p-3 rounded bg-white">
                    <table v-if="groups" class="table table-borderless">                
                        <thead>
                            <tr>										
                                <th>Name</th>
                                <th>members</th>
                            </tr>
                        </thead>     
                        <tbody>
                            <tr v-for = "(data,index) in groups.response " :key="index">                           
                                <td>
                                    <router-link class="text-secondary" style="text-decoration: none;"  :to="`/groupDetail/`+ data.id ">
                                        <i class="fa fa-users" aria-hidden="true"></i>                    
                                        {{data.name}}
                                    </router-link>
                                </td>
                                <td> 
                                    <p>                         
                                        <span class="badge badge-pill badge-secondary">{{data.number_of_members}}</span>
                                    </p>
                                </td>
                            </tr>             
                        </tbody>
                    </table>
                </div>          
            </div>
            
            <!-- Modal add group -->
            <div class="modal fade" id="addGroup" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">
                <div class="modal-header">                
                    <h5 class="modal-title text-capitalize" id="exampleModalCenterTitle">add group to {{group_name}} folder</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close" v-on:click="fetchData()">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">                    
                    <div class="form-group">
                            <label for="addGroup"> group name</label>
                            <input type="text" class="form-control" maxlength="20" id="addGroup" v-model="name">
                            <p v-if="name_errors.length">
                                    <ul>
                                        <small>
                                            <li v-for="(error,index) in name_errors" :key="index">
                                                <p class="text-danger">{{ error }}</p>
                                            </li>
                                        </small>
                                    </ul>
                            </p>
                    </div>
                    <div class="form-group">
                        <label for="addGroupDescription">description</label>
                        <textarea class="form-control" id="addGroupDescription" 
                                    maxlength="50"  rows="3" v-model="description"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal" v-on:click="fetchData()">Close</button>
                    <button type="button" class="btn btn-success" v-on:click="addGroup()">
                        <b>+</b> add group
                        <span v-if="adding_group"
                            class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                        </span>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </div>
      </template>
    
    <script>
    import router from "../../router";
    export default {
      name: 'groupList',
      data () {
        return {
            group_name: 'church',
            groups: null,
            foundItems: null,
            fetch_data_error: [],
            name: '',name_errors: [],description: '',
            add_group_error: null,
            adding_group:false
        }
      },
      created() {
            this.checkLoggedIn()
            if (this.$route.params.id){
                this.fetchData()
            }        
        },
    
      watch: {
            '$route': 'fetchData'
        },
      methods: {
            checkLoggedIn() {
                if (!this.$session.has("token")) {
                    router.push("/login")
                }
            },
            fetchData() {            
                this.group_name = this.$route.params.group_name                                
                this.fetch_data_error = []
                this.$http.get(this.$BASE_URL + '/api/groups/church-groups-in-group/' + this.$route.params.id + '/')
                .then(response => {
                    this.groups = {"response": response.data } 
                    var array = this.groups.response
                    this.foundItems = array.length
                })
                .catch((err) => {
                    this.fetch_data_error.push(err)
                })
                
            },
            addGroup: function(){
                this.name_errors = [],
                this.description_errors = []
    
                if (! this.name){
                    this.name_errors.push('you must have a name for the group')
                }
                if (! this.description){
                    this.description = 'none given'
                }            
                this.adding_group = true
                this.$http({ method: 'post', url: this.$BASE_URL + '/api/groups/add-group/',
                data: {
                    group: this.$route.params.id,
                    name: this.name,
                    description: this.description
                }
                }).then(() => {                 
                    this.name = ''
                    this.description = ''
                    this.adding_group = false
                    alert("group succesfully added")
                })
                .catch((err) => {
                    this.adding_group = false
                    alert("error occured while trying to add group" + err)
                })            
            }
          
        }
    
    }
    </script>
    
    
    <style >
    </style>
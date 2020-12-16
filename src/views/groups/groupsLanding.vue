<template>
    <div class="groupsLanding">
    <nav aria-label="breadcrumb" class="container">
            <h3><i class="mr-2 fa fa-users" aria-hidden="true"></i>Groups</h3>
    </nav>
    <div class="mt-5 container">
        <div class="row">
        <!-- NAVIGATION ON THE LEFT -->
        <div class="col-sm-10 col-md-5 col-lg-3 bg-white rounded " style="height: 100vh">
            <h5 class="mt-3 rounded bg-light p-1">Filters</h5>
            <div class="mt-5 d-flex justify-content-between">
                <b>
                    folders
                    </b>
                    <a class="btn btn-sm btn-outline-success " 
                    href="#" data-toggle="modal" 
                    data-target="#addModal" 
                    style="text-decoration: none" v-on:click="switchToFolder()">
                    + Add folder
                    </a>
                </div>
                <div v-if="groups" class="mt-4">
                    <div class="ml-2 list-group" v-for="(data,index) in groups.response" :key="index">
                        <router-link :to="`/groupList/`+ data.id + `/` + data.name" class="row list-group-item list-group-item-action border-0" >
                        <span class="d-flex justify-content-between">
                            <div>
                                <i class="fa fa-folder-open" aria-hidden="true"></i>
                                {{data.name}}  
                            </div>                                              
                            <span class="font-weight-bold">
                            {{data.number_of_groups}}
                            </span>
                        </span>
                        </router-link>
                    </div>
                    <hr>
                </div>             
                <div class="d-flex justify-content-between">
                <b>groups</b>
                    <a class="btn btn-sm btn-success" 
                        href="#" data-toggle="modal" 
                        v-on:click="switchToGroup()"
                        data-target="#addModal" style="text-decoration: none">
                    + Add group
                    </a>
                </div>
                <div v-if="independent_groups" class="mt-4">
                    <div class="list-group" v-for="(data,index) in independent_groups.response" :key="index">
                        <router-link  :to="`/groupDetail/`+ data.id" class="list-group-item list-group-item-action border-0" >
                        <span class="d-flex justify-content-between">
                            <div>
                                <i class="fa fa-refresh" aria-hidden="true"></i>
                                {{data.name}}
                            </div>
                            <span class="text-muted font-weight-bold">
                                {{data.number_of_members}}
                            </span>
                        </span>
                    </router-link>
                    </div>
                </div>
        </div>
        <!-- CONTENT IN THE MIDDLE -->
        <div class="col-sm-10 col-md-8 col-lg-9">   
            <hr class="d-sm-block d-lg-none">        
            <router-view id="folder-content">

            </router-view>
        </div>  
                
        <section>
            <!-- Modal add group -->
            <div class="modal fade" id="addModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered" role="document">
                <div class="modal-content">               
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalCenterTitle">add {{group_type}}</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                            <label for="addGroup"> name</label>
                            <input type="text" class="form-control" maxlength="20" v-model="name"/>
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
                        <textarea class="form-control" maxlength="50" id="addGroupDescription" rows="3" v-model="description"></textarea>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    <button type="button" class="btn btn-success" v-on:click="addGroup()">
                        <b>+</b> add 
                        <span v-if="adding_group"
                            class="spinner-border spinner-border-sm" role="status" aria-hidden="true">
                        </span>
                    </button>
                </div>
                </div>
            </div>
            </div>
        </section>
        </div>
    </div>
    </div>
</template>
    
<script>
export default {
    name: 'groupsLanding',
    data () {
    return {      
        groups: null,independent_groups: null,
        foundItems: null,foundItems_independent: null,
        fetch_data_error: [],
        //add group
        adding_group: false,
        group_type: 'group',
        name: '',name_errors: [],description: '',
        add_group_error: null
    }
    },
    created() {
        this.fetchData()
    },
    watch: {
        '$route': 'fetchData'
    },
    methods: {
    scrollToElement: function(element){
            document.getElementById(element).scrollIntoView();
    },
    fetchData() {      
        this.fetch_data_error = []
        //get groups i folders
        this.$http.get(this.$BASE_URL + '/api/groups/group-of-church-groups-list')
            .then(response => {
                this.groups = {"response": response.data }
                var array = this.groups.response
                this.foundItems = array.length
            })
            .catch((err) => {
                this.fetch_data_error.push(err)
            })

        // get independent groups
        this.$http.get(this.$BASE_URL + '/api/groups/church-groups-not-in-group/')
        .then(response => {
            this.independent_groups = {"response": response.data }
            var array = this.independent_groups.response
            this.foundItems_independent = array.length
            localStorage.setItem('group_list_independent',JSON.stringify({"response": response.data }))
            this.$store.dispatch('update_isLoading', false)

        })
        .catch((err) => {
            this.fetch_data_error.push(err)
            this.$store.dispatch('update_isLoading', false)
        })
    },
    switchToFolder: function(){
            this.group_type = 'folder'
    },
    switchToGroup: function(){
            this.group_type = 'group'
    },
    addGroup: function(){
        var url = ''
        this.name_errors = [],
        this.description_errors = []

        if (! this.name){
            this.name_errors.push('you must have a name for the group')
        }
        if (! this.description){
            this.description = 'none given'
        }
        if (this.group_type == 'folder'){
            url = '/api/groups/group-of-church-groups-list/'
        }
        if (this.group_type == 'group'){
            url = '/api/groups/add-group/'
        }
        this.isLoading = true
        this.adding_group = true
        this.$http({ method: 'post', url: this.$BASE_URL + url,
        data: {
            group: null,
            name: this.name,
            description: this.description
        }
        }).then(() => {
            this.name = ''
            this.description = ''            
            if (this.group_type == 'folder'){
                alert("folder succesfully added")
            }
            if (this.group_type == 'group'){
                this.adding_group = false
                alert("group succesfully added")
            }
        })
            .catch(() => {
            this.adding_group=false
            this.group_type = 'group'
            alert("an error occured while trying to add group")
        })
    }

    }
}
</script>


<style >
</style>
    
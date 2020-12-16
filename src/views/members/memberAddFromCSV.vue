<template>
	<div>
		<div class="">
			<h3 class="ml-5">
				<router-link style="text-decoration: none" :to="{name: 'memberList'}"><i class="p-2 arrow left"></i></router-link>
				Add member
			</h3>
		</div>
		<section>
			<div class="modal-content border-0">
				<div class="modal-header border-0">
					<h5 class="modal-title" id="exampleModalCenterTitle">import from CSV</h5>
				</div>
				<div class="modal-body">
					<h3 class="text-muted">demo</h3>
					<div class="container">
						<table class="table table-borderless">
							<thead>
								<tr>
								<th scope="col">names</th>
								<th scope="col">gender</th>
								<th scope="col">date of birth <br/>(DD MMMMM YYYY)</th>
								<th scope="col">phone number</th>
								<th scope="col">email</th>
								<th scope="col">marital status</th>
								</tr>
							</thead>
							<tbody>
								<tr>
								<td>John The Baptist</td>
								<td>M</td>
								<td>17 July 1997</td>
								<td>07********</td>
								<td>example@nano.com</td>
								<td>M</td>
								</tr>
								<tr>
								<td>Mark Laboso</td>
								<td>M</td>
								<td>03 December 1980</td>
								<td>07********</td>
								<td>example@nano.com</td>
								<td>S</td>
								</tr>
								<tr>
								<td>Martha Kari</td>
								<td>F</td>
								<td>20 February 1998</td>
								<td>07********</td>
								<td>example@nano.com</td>
								<td>D</td>
								</tr>
								<tr>
								<td>Maria Desa malibo</td>
								<td>F</td>
								<td>29 June 1990</td>
								<td>07********</td>
								<td>example@nano.com</td>
								<td>W</td>
								</tr>
							</tbody>
							</table>
						<h3 class="mt-5 text-muted">your csv :</h3>
						<h3 class="text-muted">{{get_data_status}}</h3>
						<small  v-if="this.csv_data.length < 0">showing only the first 5 lines</small>
							<div v-if="csv_data.length" style="height: 40vh; overflow-y: scroll">
								<table class="table">
									<thead>
									<tr v-for="(data,index) in csv_data.slice(0,1)" :key="index">
										<th scope="col" v-for="(value,key) in data" :key="key">
										{{key}}
										<select class="form-control"  v-model='csv_columns[key]'>
											<option selected disabled>import as ...</option>
											<option >names</option>
											<option>gender</option>
											<option>date of birth</option>
											<option>phone number</option>
											<option>email</option>
											<option>marital status</option>
											</select>
										</th>
									</tr>
									</thead>
									<tbody>
									<tr v-for="(data,index) in csv_data" :key="index">
										<td v-for="(value,key) in data" :key="key">{{value}}</td>
									</tr>
									</tbody>
								</table>
							</div>
	
						<div class="large-12 medium-12 small-12 cell">
								<label><b>file: </b>
									<button class="mr-2 btn btn-success" v-on:click="reset()">
										Choose file
									</button>
									{{file_name}}
									<input class="d-none" type="file" accept=".csv" id="file" ref="file"
										v-on:change="handleFileUpload()"/>
								</label>
						</div>
						<p v-if="test_csv_errors.length">
							<ul>
								<small><li v-for="(error,index) in test_csv_errors"  :key="index"><p class="text-danger">{{error}}</p></li></small>
							</ul>
						</p>
						<p class="text-success" v-if="file_format_okay">file okay, proceed to import</p>
						<p v-if="error_500.length">
							<ul>
									<small><li v-for="(error,index) in error_500" :key="index">
										<p class="text-danger">unexpected data format in your file, make sure your CSV or EXCEL file matches the demo</p>
										<p class="text-danger">select how you want to import your csv above</p>
									</li></small>
							</ul>
						</p>
	
						<p class="mt-5 text-muted">gender: <b>M</b> => male, <b>F</b> => female</p>
						<p class="text-muted">marital status: <b>M</b> => married, <b>S</b> => single, <b>D</b> => divorced, <b>W</b> => widowed</p>
						</div>
				</div>
				<div class="modal-footer border-0">
					<button type="button" class="btn btn-success"
							v-on:click="submitFile()"
							v-if="file">
							submit file
							<span v-if="submitting_file"
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true">
							</span>
					</button>
					<button type="button" class="btn btn-success"
							v-if="this.uploaded_file.length != 0"
							v-on:click="checkCSV()">
							check CSV file
							<span v-if = "checking_csv"
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"></span>
					</button>
					<button type="button" class="btn btn-success"
							v-if="file_format_okay"
							v-on:click="extractData()">
							{{extract_data_button_text}}
							<span v-if = "extracting_data"
								class="spinner-border spinner-border-sm"
								role="status"
								aria-hidden="true"></span>
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<script>
export default {
	name: 'memberAddFromCSV',
	data () {
	return {
		// csv file upload
		file_name: "No file chosen",
		submitting_file: false,
		checking_csv: false,
		extracting_data: false,
		extract_data_button_text: "import data",
		file: null,
		error_500: [],
		test_csv_errors: [],
		uploaded_file: '',
		csv_data: [],get_data_status: '',
		file_format_okay: false,
		csv_columns: {},
	}
	},
	created(){
		this.getGroups()
	},
	methods: {  
		//Submits the file to the server
		submitFile: function(){
		this.file_format_okay = false
		this.error_500 = []
		this.test_csv_errors = []
		let formData = new FormData();
		formData.append('csv', this.file);

		this.submitting_file = true
		this.$http.post(
			this.$BASE_URL + '/api/members/upload-csv/',
			formData,
			{	
				headers: {
				'Content-Type': 'multipart/form-data'
			}
		})
		.then(response =>{
			var data = response.data
			//if data is not array there are no errors
			if (! data.length){
				this.uploaded_file = data.csv
				alert("file uploaded")
				this.previewCSV()
				this.submitting_file = false
			}
		})
		.catch((err) =>{
			this.error_500.push(err)
			this.submitting_file = false
		});
    },
  // handle the case that the file changes
    handleFileUpload: function(){
		this.file = this.$refs.file.files[0]
        this.file_name = this.file.name
        this.uploaded_file = ''
        this.file_format_okay = false
        this.$refs.file.value = null
	},
	// reset csv file upload
	reset: function(){
        this.submitting_file = false
        this.checking_csv = false
        this.extracting_data = false
        this.extract_data_button_text = "import data"
        this.error_500 = []
        this.test_csv_errors = []
        this.uploaded_file = ''
        this.csv_data = []
        this.get_data_status = ''
        this.file_format_okay = false
        this.csv_columns =  {}
        this.file = null
        this.file_name = "No file chosen"
        document.getElementById('file').click()
    },
	//preview the csv file
	previewCSV: function(){
		this.get_data_status = 'setting up preview ...'
		var file_name = this.uploaded_file.split("/")[1]
		this.$http.get(this.$BASE_URL + '/api/members/preview-csv/'+ file_name + '/')
		.then(response => {
			this.csv_data = response.data
			this.get_data_status = ''
		})
		.catch((err) => {
			alert(err)
			this.get_data_status = ''
		})
    },
	// extract data from the csv file
	// check that the csv file is of the required format
    checkCSV: function(){
		this.test_csv_errors = []
		this.file_format_okay = false
		var file_name = this.uploaded_file.split("/")[1]

		this.checking_csv = true
		this.$http({
			method: 'post',
			url: this.$BASE_URL + '/api/members/check-csv/',
			data: {
				file_name: file_name,
				column_config: this.csv_columns
			},
		}).then(response => {
			var data = response.data
			//if data is not array there are no errors
			if (! data.length){
				this.file_format_okay = true
			}
			else{
				this.test_csv_errors = data
			}
			this.checking_csv = false
		}).catch((err) => {
			this.error_500.push(err)
			this.checking_csv = false
		})
    },
    extractData: function(){
		this.extract_data_button_text = "extracting..."
		var file_name = this.uploaded_file.split("/")[1]

		this.extracting_data = true
		this.$http({
			method: 'post',
			url: this.$BASE_URL + '/api/members/import-data-from-csv/',
			data: {
				file_name: file_name,
				column_config: this.csv_columns
			}
		}).then(() => {
			this.extract_data_button_text = "import data"
			this.extracting_data = false
			alert("data extracted succesfully")
		}).catch(() => {
			// fix the network timeout issue((this is a quick fix))
			this.extract_data_button_text = "import data"
			this.extracting_data = false
			alert("data extracted succesfully")
		})
    },
	}
}
</script>


<style >
</style>
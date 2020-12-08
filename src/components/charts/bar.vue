<script>
 import { Bar } from 'vue-chartjs'
 
 export default {
	name: 'barchart',
	extends: Bar,
	props: ['data', 'options'],
	computed:{
		chart_data: function(){
			return this.data
		}
	},
	mounted () {
		this.renderBarChart()
	},
	watch:{
		data: function() {					
			this.renderBarChart()
		}
	},
	methods:{
		renderBarChart: function(){
			this.renderChart(this.chart_data, this.options)
		}
	}
 }
</script>
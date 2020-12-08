<script>
    import { Doughnut } from 'vue-chartjs'
        
    export default {
    extends: Doughnut,
    props: ['data', 'options'],
	computed:{
		chart_data: function(){
			return this.data
		}
	},
	mounted () {
		this.renderDoughnutChart()
	},
	watch:{
		data: function() {					
			this.renderDoughnutChart()
		}
	},
	methods:{
		renderDoughnutChart: function(){
			this.renderChart(this.chart_data, this.options)
		}
	}
}
</script>
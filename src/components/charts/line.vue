<script>
import { Line } from 'vue-chartjs'

export default {
    name: 'lineChart',
    extends: Line,
    props: ['data', 'options'],
    computed:{
        chart_data: function(){
            return this.data
        }
    },
    mounted () {
        this.renderLineChart()
    },
    watch:{
        data: function() {
            this.renderLineChart()
        }
    },
    methods:{
        renderLineChart: function(){
            this.renderChart(this.chart_data, this.options)
        }
    }
}
</script>
<template>
  <div class="card mt-3 p-3">
    <h3>{{title}}</h3>
    <canvas :id="'Chart' + id" width="400" height="200"></canvas>
  </div>
</template>

<script>
var Chart = require('chart.js');

export default {
  name: "Chart",
  props: {
    quizData: Array,
    title: String,
    id: Number,
  },
  data() {
    return{
      labels: [],
      dataset: [],
    }
  },
  mounted(){
    this.createChart()
  },
  watch: {
    quizData: function () {
      this.createChart()
    }
  },
  methods: {
    createChart(){
        const months = ['Jan', 'Feb', 'Mar', "Apr", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"]
        this.quizData.forEach((item) => {
          const itemDate = new Date(item.date);
          const buildDate = itemDate.getDate() + '/' + months[itemDate.getMonth()] + '/' + itemDate.getFullYear() + ' - ' + itemDate.getHours() + ':' + itemDate.getMinutes();
          this.labels.push(buildDate);
          this.dataset.push(item.percentage);
        })
        new Chart(document.getElementById("Chart" + this.id), {
            type: 'line',
            data: {
                labels: this.labels,
                datasets: [{
                    data: this.dataset,
                    borderColor: "#3e95cd",
                    fill: false,
                    pointRadius: 4,
                    pointBackgroundColor: "#3e95cd",
                }]
            },
            options: {
                legend: {
                    display: false
                },
                tooltips:{
                    intersect : false,
                    mode:'index'
                }
            }
        });
    }
  }
}
</script>

<style scoped>

</style>

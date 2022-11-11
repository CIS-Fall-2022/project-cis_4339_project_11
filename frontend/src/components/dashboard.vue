<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <div class="container mx-auto h-4/6 w-4/6">
      <canvas ref="LineChart"></canvas>
    </div>
  </main>
</template>
<script>
import { Chart, registerables } from 'chart.js'
import axios from 'axios';
Chart.register(...registerables);

function toMonthName(monthNumber) { //Converts Month Number to Month Name
  // Source: https://bobbyhadz.com/blog/javascript-convert-month-number-to-name
  const date = new Date();
  date.setMonth(monthNumber - 1);

  return date.toLocaleString('en-US', {
    month: 'long',
  });
}

export default {
  data(){
    return {
      labels: [],
      chartData: []
    }
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    async fetchchartdata() {
      const apiURL = import.meta.env.VITE_ROOT_API + `/eventData/dashboard`
      let  response = await axios.get(apiURL);
      this.labels = response.data.map((item) => toMonthName(item.month))
      this.chartData = response.data.map((item) => item.attendees)
      console.log(this.labels)
      console.log(this.chartData)
    }
  },
  async mounted() {
    await this.fetchchartdata();
     new Chart(this.$refs.LineChart, {
      type: 'bar',
      data: {
        labels: this.labels,
        datasets: [
          {
            label: "Event Attendees",
            backgroundColor: "rgba(215, 0, 64 )",
            data: this.chartData,
          },
        ],
      },
      options: {
        scales: {
            y: {
                min:0,
                max: 10
            }
        }
      }
    });
  },
};
</script>

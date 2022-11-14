<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <!-- Graphs for Attendees per Month -->
    <div class="container mx-auto h-4/6 w-4/6">
      <canvas ref="LineChart"></canvas>
    </div>
<!-- Chart displaying all Attendees per Event -->
    <section class="pt-6 container mx-auto">
      <table class="min-w-full shadow-md rounded">
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Event Date</th>
          <th>Attendees</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="event in eventQuery" :key="event.eventName">
          <td class="p-2 text-center">{{ event.eventName }}</td>
          <td class="p-2 text-center">{{formattedDate(event.date)}}</td>
          <td class="p-2 text-center">{{event.attendees}}</td>
        </tr>
      </tbody>
    </table>
    </section>
  </main>
</template>
<script>
import { Chart, registerables } from 'chart.js'
import axios from 'axios';
import { DateTime } from "luxon";
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
      chartData: [],
      eventQuery: [] //Stores dash-table json 
    }
  },
  methods: {
    routePush(routeName) {
      this.$router.push({ name: routeName });
    },
    formattedDate(datetimeDB) {
      return DateTime.fromISO(datetimeDB).plus({ days: 1 }).toLocaleString(); //Copied from line 109 - 110 in findEvents.vue to change the ISO to normal date format
    },
    async fetchchartdata() {
      //fetches data for graph
      const apiURL = import.meta.env.VITE_ROOT_API + `/eventData/dashboard`
      let  response = await axios.get(apiURL);
      this.labels = response.data.map((item) => toMonthName(item.month))
      this.chartData = response.data.map((item) => item.attendees)
      // console.log(this.labels) //For debugging
      // console.log(this.chartData)
    },
    async fetchtable() {
      const apiURL = import.meta.env.VITE_ROOT_API + `/eventData/dash-table`
      let response = await axios.get(apiURL)
      this.eventQuery = response.data
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
    await this.fetchtable();
  },
};
</script>

<template>
  <main>
    <div>
      <h1 class="font-bold text-4xl text-red-700 tracking-widest text-center mt-10">Welcome</h1>
    </div>
    <!-- Graphs for Attendees per Month -->
    <div class="container mx-auto h-4/6 w-4/6">
      <canvas v-if="errorData.length === 0" ref="BarChart"></canvas>
      <!-- Error render -->
      <div v-else class="bg-transparent text-center py-4 lg:px-4">
        <div class="p-2 bg-red-600 items-center text-indigo-100 leading-none lg:rounded-full flex lg:inline-flex" role="alert">
          <span class="flex rounded-full bg-red-400 text-white uppercase px-2 py-1 text-xs font-bold mr-3">Error</span>
          <span class="font-semibold mr-2 text-left text-white flex-auto">{{errorData}}: Website not connected to server</span>
        </div>
  </div>
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
      eventQuery: [], //Stores dash-table json 
      errorData: [], //Stores Errors for API call.
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
      let  response = await axios.get(apiURL).catch(error => {
        console.log(error.message)
        this.errorData = error.message
        // alert(`ERROR: ${this.errorData}`)
      });
      this.labels = response.data.map((item) => toMonthName(item.month))
      this.chartData = response.data.map((item) => item.attendees)
      // console.log(this.labels) //For debugging
      // console.log(this.chartData)
      console.log(this.errorData)
      
    },
    async fetchtable() {
      const apiURL = import.meta.env.VITE_ROOT_API + `/eventData/dash-table`
      let response = await axios.get(apiURL)
      this.eventQuery = response.data
    }
  },
  async mounted() {
    await this.fetchchartdata();
     new Chart(this.$refs.BarChart, {
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
  updated(){
    console.log(this.errorData)
  }
};
</script>

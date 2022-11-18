<template>
  <main class="flex flex-row">
    <div id="_container" class="h-screen">
      <header class="w-full">
        <section class="text-center">
          <img class="m-auto" src="@\assets\DanPersona.svg" />
        </section>
        <nav class="mt-10">
          <ul class="flex flex-col gap-4">
            <li>
              <router-link to="/">
                <span style="position: relative; top: 6px" class="material-icons">dashboard</span>
                Dashboard
              </router-link>
            </li>
            <li>
              <router-link to="/intakeform">
                <span style="position: relative; top: 6px" class="material-icons">people</span>
                Client Intake Form
              </router-link>
            </li>
            <li>
              <router-link to="/eventform">
                <span style="position: relative; top: 6px" class="material-icons">event</span>
                Create Event
              </router-link>
            </li>
            <li>
              <router-link to="/findclient">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Client
              </router-link>
            </li>
            <li>
              <router-link to="/findEvents">
                <span style="position: relative; top: 6px" class="material-icons">search</span>
                Find Event
              </router-link>
            </li>
          </ul>
        </nav>
      </header>
    </div>
    <div class="grow w-4/5">
      <section
        class="justify-end items-center h-24 flex"
        style="
          background: linear-gradient(250deg, #C8102E 70%, #efecec 50.6%);
        "
      >
        <h1 class="mr-20 text-3xl text-white">{{organization}}</h1><!-- addition of the orgainzation variable that is declared below in the script tag -->
      </section>
      <div>
        <router-view></router-view>
      </div>
    </div>
  </main>
</template>

<script> // initialize script tag
import axios from "axios";

export default { // create local registration of vue component -- source: https://stackoverflow.com/questions/48727863/vue-export-default-vs-new-vue
  name: "App",
  data(){
    return{
      organization:'', // empty string for organizaiton name
    };
  },
  methods: {
    async handleOrganizationName(){ //create async method that will handle the display of the organization name
      let apiURL = import.meta.env.VITE_ROOT_API + `/organizationData/`; // declare variable to be api route that returns org information
      let response = await axios.get(apiURL)
      this.organization = response.data.organizationName // get only the organizaaiton name and place it in the empty string above
    }

   },
   async mounted(){ // async mount of the handle organization name method
    await this.handleOrganizationName()

   },
  }
;
</script>

<style>
#_container {
  background-color: #c8102e;
  color: white;
  padding: 18px;
}
</style>

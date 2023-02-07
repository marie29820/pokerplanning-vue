<template>
  <section>
    <navbar/>
    <section class="relative w-full h-full py-40 min-h-screen">
      <div class="absolute top-0 w-full h-full bg-blueGray-800 bg-no-repeat bg-full">
        <div class="container mx-auto px-4 h-full">
          <div class="flex content-center items-center justify-center h-full">
            <div class="w-full lg:w-6/12 px-4">
              <div
                  class="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-200 border-0">
                <div class="flex-auto px-4 lg:px-10 py-10 pt-0">
                  <div class="text-blueGray-400 text-center font-bold">
                    <div class="row justify-content-center">
                      <div class="col-lg-3 order-lg-2">
                        <div class="card-profile-image">
                          <img src="/img/launch.svg" alt="launch" class="launcher">
                        </div>
                      </div>
                    </div>
                  </div>
                  <form>
                    <div class="relative w-full mb-3">
                      <label
                          class="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Name
                      </label>
                      <b-form-input
                          type="text"
                          class="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                          placeholder="Your name [3-10 characters]"
                          v-model="name"
                          @keydown.enter.prevent="submit"
                          :state="nameState"/>
                    </div>
                    <div class="text-center mt-6">
                      <button
                          class="bg-blueGray-800 text-white active:bg-blueGray-600 text-sm font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 w-full ease-linear transition-all duration-150"
                          type="button"
                          @click="submit">
                        Launch !!!
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </section>
</template>

<script>
import navbar from "@/components/navbar.vue";
import {mapActions} from "pinia";
import {messageStore, technicalStore} from "@/store";
import {routesNames} from "@/config";
import {pokerPlanningApi, utils} from "@/service";

export default {
  name: "Home",
  data() {
    return {
      name: '',
    }
  },
  async created() {
    // - on reinitialise l'ensemble des données
    pokerPlanningApi.disconnect()
    messageStore().$reset()
  },
  computed: {
    nameState() {
      return utils.regexName(this.name)
    },
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom']),
    ...mapActions(technicalStore, ['setLoading']),
    submit() {
      if (this.nameState) {
        this.setPlayer({name: this.name, connected: false})
        this.$router.push({name: routesNames.room, params: {id: utils.uuidv4()}})
      }
    },
  },
  components: {
    navbar,
  },
};
</script>
<style>
.launcher {
  margin-top: 5px;
}
</style>
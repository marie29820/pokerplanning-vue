<template>
  <main class="w-full h-full bg-no-repeat bg-full bg-blueGray-800">
    <div v-show="loader" class="overlay">
      <b-spinner variant="light" class="spinner" label="Text Centered"></b-spinner>
    </div>
    <router-view/>
  </main>
</template>
<script>
import {mapState} from "pinia";
import {messageStore} from "@/store";
import {pokerPlanningApi} from "@/service";

export default {
  components: {},
  data() {
    return {
      loader: false
    }
  },
  watch: {
    loading(loading) {
      this.loader = loading;
    }
  },
  created() {
    // - reinitialiser l'ensemble des données
    window.addEventListener("beforeunload", this.leaving);
  },
  computed: {
    ...mapState(messageStore, ['player', 'loading'])
  },
  methods: {
    async leaving() {
      // - vider le store et se deconnecter
      pokerPlanningApi.disconnect()
      messageStore().$reset()
    },
  }
}
</script>
<style>
.spinner{
  opacity: 1;
}
.overlay{
  position: fixed;
  z-index: 1000;
  margin-top: 25%;
  margin-left: 50%;
}
</style>
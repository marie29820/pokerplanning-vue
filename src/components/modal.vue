<template>
  <b-input-group>
    <b-form-input
        v-model="user.name"
        @keydown.enter.prevent="enter"
        placeholder="Your name [3-10 characters]"
        :state="nameState"/>
    <b-input-group-append>
      <b-button variant="success" @click="submit()">Play
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>


import {utils} from "@/service";

export default {
  name: "modal",
  data() {
    return {
      user: {name: null},
    }
  },
  computed: {
    nameState() {
      return this.validName();
    }
  },
  methods: {
    submit() {
      if(this.validName()){
        this.$emit('add-player', this.user.name);
      }
    },
    validName(){
      return utils.regexName(this.user.name)
    },
    enter(){
      this.submit()
    }
  }
}
</script>

<style scoped>

</style>
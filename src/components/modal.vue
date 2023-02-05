<template>
  <b-input-group>
    <b-form-input
        v-model="user.name"
        @keydown.enter.prevent="enter"
        placeholder="Enter your name"
        :state="nameState"/>
    <b-input-group-append>
      <b-button variant="success" @click="submit()">Play
      </b-button>
    </b-input-group-append>
  </b-input-group>
</template>

<script>


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
      return this.user.name?.length > 2 && this.user.name?.length < 8 && /^[A-Za-z-@]+$/.test(this.user.name)
    },
    enter(){
      this.submit()
    }
  }
}
</script>

<style scoped>

</style>
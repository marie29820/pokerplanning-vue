<template>
  <b-modal no-close-on-backdrop
           no-close-on-esc
           hide-header-close
           hide-footer hide-header
           ref="playermodal">
    <b-input-group>
      <b-form-input
          v-model="user.name"
          @keydown.enter.prevent="submit()"
          placeholder="Your name [3-10 characters]"
          :state="nameState"/>
      <b-input-group-append>
        <b-button variant="success" @click="submit()">Play
        </b-button>
      </b-input-group-append>
    </b-input-group>
  </b-modal>
</template>
<script>
import {utils} from "@/service";

export default {
  name: "modal",
  props:['show'],
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
  watch:{
    show(show){
      if(show){
        this.$refs['playermodal'].show()
      } else {
        this.$refs['playermodal'].hide()
      }
    }
  },
  methods: {
    submit() {
      if (this.validName()) {
        this.$emit('add-player', this.user.name);
      }
    },
    validName() {
      return utils.regexName(this.user.name)
    },
  }
}
</script>

<style scoped>

</style>
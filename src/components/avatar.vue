<template>
  <main>
    <b-avatar v-if="step === 'HIDDEN'"
              :id="`avatar-${aPlayer.id}`"
              :badge="aPlayer.name"
              variant="primary"
              badge-top
              badge-offset="-0.7em"
              :badge-variant="avatarStyle()"
              size="3rem"
    />
    <b-avatar v-if="step === 'REVEAL'"
              :id="`avatar-${aPlayer.id}`"
              :badge="aPlayer.name"
              variant="primary"
              badge-top
              badge-offset="-0.7em"
              :badge-variant="avatarStyle()"
              size="3rem">
      <img v-if="aPlayer.card === 'coffee'" src="/img/icons8-cafe-36.png" alt="icon-cafe"/>
      <span v-else
            style="font-size: 2em">
        <b>{{ aPlayer.card }}</b>
      </span>
    </b-avatar>

  </main>
</template>

<script>
import {mapState} from "pinia";
import {messageStore} from "@/store";

export default {
  name: "avatar",
  props: ['step', 'aPlayer'],

  data() {
    return {}
  },

  computed: {
    ...mapState(messageStore, ['player']),
  },
  methods: {
    avatarStyle() {
      return this.aPlayer.card ? "success" : "danger"
    },
  }
}
</script>

<style scoped>
</style>
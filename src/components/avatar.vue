<template>
  <main>
    <b-avatar
        :id="`avatar-${aPlayer.id}`"
        v-if="step === 'HIDDEN'"
        :badge="aPlayer.name"
        badge-top
        badge-offset="-0.7em"
        :badge-variant="getAvatarStyle(aPlayer)"
        size="4rem"
    />
    <b-avatar
        :id="`avatar-${aPlayer.id}`"
        v-if="step === 'REVEAL'"
        :badge="aPlayer.name"
        badge-top
        badge-offset="-0.7em"
        :badge-variant="getAvatarStyle(aPlayer)"
        size="4rem">
              <span style="font-size: 2em"
                    v-if="aPlayer.card !== 'coffee'"><b>{{ aPlayer.card }}</b>
              </span>
      <img v-else src="/img/icons8-cafe-36.png" alt="icon-cafe"/>
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
    return {
    }
  },

  computed: {
    ...mapState(messageStore, ['player']),
  },
  methods: {
    getAvatarStyle(aPlayer) {
      return aPlayer.card ? "success" : "danger"
    },
  }
}
</script>

<style scoped>

</style>
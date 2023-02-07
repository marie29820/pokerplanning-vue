<template>
  <b-list-group>
    <b-list-group-item>
        <b-button v-if="step !== 'REVEAL'"
                  variant="info"
                  @click="reveal"
        >Show cards
        </b-button>
        <b-button v-else
                  variant="info"
                  @click="reset"
                  :disabled="!resetState"
        >Restart
        </b-button>
      <b-button
          :disabled="disabledcards"
          v-for="card in cards" :key="card"
          :class="[card.value === this.clicked.value?  '':'min-button', 'mx-1 my-1' ]"
          @click="choose(card)"
          :variant="card.value === this.clicked.value? 'primary':'outline-primary'"
      >
        <img v-if="card.value === 'coffee'" src="/img/icons8-cafe-24.png"/>
        <span v-else>{{ card.value }}</span>
      </b-button>
    </b-list-group-item>
  </b-list-group>
</template>
<script>
import {mapState} from "pinia";
import {messageStore, technicalStore} from "@/store";

export default {
  name: "cards",
  computed: {
    ...mapState(messageStore, ['room', 'player']),
    ...mapState(technicalStore, ['loading'])
  },
  data() {
    return {
      clicked: {},
      resetState: false,
      step: 'HIDDEN',
      disabledcards: false,
      cards: [
        {value: '0'}, {value: '1'}, {value: '2'}, {value: '3'}, {value: '5'}, {value: '8'},
        {value: '13'}, {value: '21'}, {value: '34'}, {value: '55'}, {value: '89'}, {value: '?'}, {value: 'coffee'},
      ],
    };
  },
  mounted() {
    this.step = this.room.step
    if (this.player && this.player.card) {
      this.clicked = {value: this.player.card}
    }
  },
  methods: {
    choose(card) {
      this.clicked = this.clicked === card ? {} : card
      this.$emit('update-card', this.clicked.value);
    },
    reveal() {
      this.$emit('revealCard');
    },
    reset() {
      this.$emit('resetCard');
    }
  },
  watch: {
    room(room) {
      // - sockjs via store
      this.step = room.step
    },
    step(step) {
      this.clicked = step === 'REVEAL' ? {} : this.clicked
      this.disabledcards = step === 'REVEAL'
      step === 'REVEAL' ? setTimeout(() => this.resetState = true, 6000) : this.resetState = false
    },
    loading(loading) {
      this.disabledcards = loading;
    }
  },
};
</script>

<style scoped>
.min-button:hover {
  background-color: white;
  color: #007bff;
  border-color: #007bff;
}
</style>
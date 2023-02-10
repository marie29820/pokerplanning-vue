<template>
  <section class="w-full h-full op" :style="{'opacity': opacity }">
    <div v-if="explode">
      <explode/>
    </div>
    <invite/>
    <div class="h-75 d-flex align-items-center justify-content-center">
      <div class="bg-blueGray-800">
        <div v-if="players.length > 8" class="row">
          <div v-if="players[8]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[8]" :step="step"/>
          </div>
          <div v-if="players[10]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[10]" :step="step"/>
          </div>
          <div v-if="players[12]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[12]" :step="step"/>
          </div>
          <div v-if="players[14]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[14]" :step="step"/>
          </div>
        </div>
        <div class="row">
          <div v-if="players[0]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[0]" :step="step"/>
          </div>
          <div v-if="players[2]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[2]" :step="step"/>
          </div>
          <div v-if="players[4]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[4]" :step="step"/>
          </div>
          <div v-if="players[6]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[6]" :step="step"/>
          </div>
        </div>
        <div class="row">
          <div class="col-md-2 mx-auto my-auto"></div>
          <div class="col-md-8">
            <img src="/img/pokerplanning.png" alt="table">
          </div>
          <div class="col-md-2 mx-auto my-auto"></div>
        </div>
        <div class="row">
          <div v-if="players[1]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[1]" :step="step"/>
          </div>
          <div v-if="players[3]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[3]" :step="step"/>
          </div>
          <div v-if="players[5]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[5]" :step="step"/>
          </div>
          <div v-if="players[7]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[7]" :step="step"/>
          </div>
        </div>
        <div v-if="players.length > 9" class="row">
          <div v-if="players[9]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[9]" :step="step"/>
          </div>
          <div v-if="players[11]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[11]" :step="step"/>
          </div>
          <div v-if="players[13]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[13]" :step="step"/>
          </div>
          <div v-if="players[15]" class="col-xs-1 mx-auto">
            <avatar :aPlayer="players[15]" :step="step"/>
          </div>
        </div>
      </div>
    </div>
    <div class="fixed-bottom">
      <cards
          @reset-card="resetCard"
          @update-card="updateCard"
          @reveal-card="revealCard"
      />
    </div>
    <modal @add-player="createPlayer" :show="playermodal"/>
  </section>
</template>

<script>


import {mapActions, mapState} from "pinia";
import {messageStore, technicalStore} from "@/store";
import {pokerPlanningApi} from "@/service";
import Explode from "@/components/explode.vue";
import Invite from "@/components/invite.vue";
import Modal from "@/components/modal.vue";
import Cards from "@/components/cards.vue";
import Avatar from "@/components/avatar.vue";

export default {
  name: "Room",
  components: {Avatar, Cards, Modal, Invite, Explode},
  data() {
    return {
      opacity: '0.4',
      newGame: false,
      user: {id: null, name: null},
      players: [],
      step: 'HIDDEN',
      explode: false,
      playermodal: false
    };
  },
  computed: {
    ...mapState(messageStore, ['room', 'player']),
    ...mapState(technicalStore, ['loading']),
  },
  mounted() {
    this.setLoading(true)
    pokerPlanningApi.connect()
        .then((uuid) => {
          this.user.id = uuid
          pokerPlanningApi.subscribeRoom(this.$route.params.id)
              .then(() => {
                this.$nextTick(() => {
                  if (this.player) {
                    // - si le joueur a créé la partie
                    // - ajout du player a la room
                    this.createPlayer(this.player.name);
                  } else {
                    // - si le joueur rejoint la partie
                    this.playermodal = true
                  }
                })
              })
        })
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer']),
    ...mapActions(technicalStore, ['setLoading']),
    makeToast() {
      this.$bvToast.toast('Average votes : ' + this.averageNote(), {
        noCloseButton: true,
        autoHideDelay: 6000,
        variant: 'info',
        solid: true
      })
    },
    getUsefullCards(){
     return Object.values(this.players)
          .filter(p => !isNaN(p.card) && p.card !== null)
          .map(p => parseInt(p.card));
    },
    averageNote() {
      const selectedCards = this.getUsefullCards();
      return selectedCards.length > 0
          ? (selectedCards.reduce((acc, cur) => acc + cur, 0) / selectedCards.length).toFixed(1)
          : 0;
    },
    consensus() {
      const selectedCards  = this.getUsefullCards();
      return selectedCards.length > 0 && selectedCards.every(c => c === selectedCards[0]);
    },
    createPlayer(name) {
      this.user.name = name
      pokerPlanningApi.addPlayer(this.$route.params.id, this.user).then(
          () => {
            this.setPlayer({id: this.user.id, name: this.user.name})
            this.playermodal = false
            this.setLoading(false)
          }
      )
    },
    async updateCard(card) {
      this.setPlayer({id: this.player.id, name: this.player.name, card: card})
      await pokerPlanningApi.play(this.room.id, this.player)
    },
    async revealCard() {
      await pokerPlanningApi.revealGame(this.room.id)
    },
    async resetCard() {
      await pokerPlanningApi.resetGame(this.room.id)
    },
  },
  watch: {
    room(room) {
      this.players.length = 0
      this.players.push(...room.players ?? [])
      this.step = room.step
      this.step === 'REVEAL' ? this.makeToast() : null;
      this.explode = this.step === 'REVEAL' ? this.consensus() : false;
    },
    loading(loading) {
      this.opacity = loading ? '0.4' : '1';
    }
  },
}
</script>

<style scoped>
img {
  margin: auto;
  width: 70%;
}

.avatar {
  position: absolute;
}

.username {
  font-family: 'tahoma', sans-serif;
  font-size: 1em;
  text-align: center;
}
</style>
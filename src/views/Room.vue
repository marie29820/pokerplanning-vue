<template>
  <section class="w-full h-full op" :style="{'opacity': opacity }">
    <div v-if="explode">
      <explode/>
    </div>
    <invite/>
    <div class="h-75 d-flex align-items-center justify-content-center">
      <div class="bg-blueGray-800">
        <div v-if="players.length > 8" class="row">
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(8)" :aPlayer="getplayer(8)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(10)" :aPlayer="getplayer(10)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(12)" :aPlayer="getplayer(12)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(14)" :aPlayer="getplayer(14)" :step="step"/>
          </div>
        </div>
        <div class="row">
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(0)" :aPlayer="getplayer(0)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(2)" :aPlayer="getplayer(2)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(4)" :aPlayer="getplayer(4)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(6)" :aPlayer="getplayer(6)" :step="step"/>
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
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(1)" :aPlayer="getplayer(1)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(3)" :aPlayer="getplayer(3)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(5)" :aPlayer="getplayer(5)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(7)" :aPlayer="getplayer(7)" :step="step"/>
          </div>
        </div>
        <div v-if="players.length > 9" class="row">
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(9)" :aPlayer="getplayer(9)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(11)" :aPlayer="getplayer(11)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(13)" :aPlayer="getplayer(13)" :step="step"/>
          </div>
          <div class="col-xs-1 mx-auto">
            <avatar v-if="getplayer(15)" :aPlayer="getplayer(15)" :step="step"/>
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
    <b-modal no-close-on-backdrop
             no-close-on-esc
             hide-header-close
             ref="playermodal" hide-footer hide-header>
      <modal @add-player="createPlayer"/>
    </b-modal>
  </section>
</template>

<script>


import {mapActions, mapState} from "pinia";
import {messageStore} from "@/store";
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
      explode: false
    };
  },
  computed: {
    ...mapState(messageStore, ['room', 'player', 'loading']),
    getplayer() {
      return i => this.players[i]
    },
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
                    this.$refs['playermodal'].show()
                  }
                })
              })
        })
  },
  methods: {
    ...mapActions(messageStore, ['setPlayer', 'setRoom', 'setLoading']),
    makeToast() {
      this.$bvToast.toast('Moyenne du poker planning : ' + this.averageNote(), {
        noCloseButton: true,
        autoHideDelay: 9000,
        variant: 'info',
        solid: true
      })
    },
    averageNote() {
      let total = this.players.map(p => p.card).filter(c => !isNaN(c) && null !== c)
          .reduce((acc, cur) => acc + parseInt(cur), 0)
      let vote = this.players.map(p => p.card).filter(c => !isNaN(c) && null !== c).length;
      return vote > 0 ? (total / vote).toFixed(1) : 0;
    },
    consensus() {
      let card;
      for (let p in this.players) {
        if (!isNaN(this.players[p].card) && null !== this.players[p].card) {
          if (!card) {
            card = this.players[p].card
          } else if (card !== this.players[p].card) {
            return false;
          }
        } else {
          return false;
        }
      }
      return true
    },
    createPlayer(name) {
      this.user.name = name
      pokerPlanningApi.addPlayer(this.$route.params.id, this.user).then(
          () => {
            this.setPlayer({id: this.user.id, name: this.user.name})
            this.$refs['playermodal'].hide()
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
      console.log(room)
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
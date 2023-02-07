import {defineStore} from 'pinia'

export const messageStore = defineStore('messages', {
  state: () => {
    return {
      room: {},
      player: null,
    }
  },
  actions: {
    setPlayer(player) {
      this.player = player
    },
    setRoom(room) {
      this.room = room
    },
  },
  persist: {
    enabled: true,
  },
})
export const technicalStore = defineStore('technical', {
  state: () => {
    return {
      smi: false,
      loading: false,
    }
  },
  actions: {
    setLoading(loading) {
      this.loading = loading
    },
    setSmi(smi) {
      this.smi = smi
    },
  },
  persist: {
    enabled: false,
  },
})

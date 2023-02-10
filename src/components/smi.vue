<template>
  <b-modal ref="smimodal"
           no-close-on-backdrop
           no-close-on-esc
           hide-header-close
           hide-footer hide-header
           body-bg-variant="light"
           id="modal-footer-sm" button-size="sm">
    <p class="my-2">The server seems unreachable</p>
    <p class="my-2">Try again later</p>
    <b-button v-b-modal.modal-footer-sm
              class="float-right"
              @click="reload()">Retry
    </b-button>
  </b-modal>
</template>

<script>
export default {
  name: "smi",
  props: ['show'],
  methods: {
    reload() {
      window.location.reload()
    }
  },
  watch: {
    show(show) {
      if (show) {
        this.$refs['smimodal'].show()
      } else {
        this.$refs['smimodal'].hide()
      }
    }
  },
}
</script>

<style scoped>

</style>
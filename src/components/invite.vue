<template>
  <b-button size="sm"
            variant="primary"
            class="my-2 invitebutton"
            @click="copy">Invite friends
  </b-button>
</template>
<script>
export default {
  name: "invite",
  data() {
    return {
      url: window.location.href,
    }
  },
  methods: {
    copy() {
      navigator.clipboard.writeText(this.url)
      this.$bvToast.toast("Copied to the clipboard !", {
        noCloseButton: true,
        autoHideDelay: 5000,
        variant: 'info',
        solid: true
      })
    },
  }
}
</script>
<style scoped>
.invitebutton{
  margin: 10px;
}
</style>
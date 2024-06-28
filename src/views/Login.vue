<template lang="pug">
  .login.fixed.overlay.flex.select-none(@click="reset")
    form.flex.m-auto.text-2xl(@submit.prevent="submit", :class="{'error-shake': error}")
      template(v-for="n in 4")
        input.text-center.w-40.h-60.rounded.mx-8.focus_outline-none(size="1", maxlength="1", type="number", v-model="pin[n - 1]", @keyup="onKeyUp", @keydown="onKeyDown", inputmode="numeric", pattern="[0-9]*", min="0")
    //- close btn
    button.absolute.top-0.right-0.p-20.focus_outline-none.text-white.text-base.md_text-lg(@click="close", aria-label="Exit")
      svg-x(style="height:1em;width:1em")
    //- sound effect
    audio(ref="audio", v-if="audioUrl", :src="audioUrl")
</template>

<script>
import svgX from '@/components/icons/SVG-X'
let lastRt
export default {
  name: 'Login',
  data () {
    return {
      pin: ['', '', '', ''],
      error: null,
      submitting: false
    }
  },
  computed: {
    audioUrl () {
      return this.$store.getters.main?.data.login_keystroke_sound?.url
    }
  },
  beforeRouteEnter (to, from, next) {
    lastRt = from
    next()
  },
  mounted () {
    this.reset()
  },
  watch: {
    error (err) {
      if (err) {
        setTimeout(() => {
          this.error = null
          if (err === 404) this.reset()
        }, 600)
      }
    }
  },
  methods: {
    async submit () {
      if (this.submitting) return
      const PIN = this.pin.join('')
      this.submitting = true
      // ERROR! too short
      if (PIN.length !== 4) {
        this.error = true
        return
      }
      try {
        // fetch
        const doc = await fetch('/api/clients', {
          method: 'POST',
          body: JSON.stringify({ pin: PIN })
        }).then(resp => resp.json())
        // load and save
        if (doc) {
          sessionStorage.setItem('client-doc', JSON.stringify(doc))
          this.$router.replace({ name: 'client-doc', params: { id: doc.id } })
        } else {
          this.error = 404
        }
      } catch (e) {
        console.error(e)
        alert('An error occured. Please check your connection')
      }
      this.submitting = false
    },
    onKeyDown (e) {
      if (e.keyCode === 13) return this.submit()
      // play audio
      if (this.$refs.audio && this.pin.join('').length < 4) {
        this.$refs.audio.currentTime = 0
        this.$refs.audio.play()
      }
      // [DELETE] go to previous input...
      if (e.keyCode === 8 && !e.target.value.length) {
        const prev = e.target.previousSibling
        return prev && prev.focus()
      }
    },
    onKeyUp (e) {
      // submit if 4
      if (this.pin.join('').length === 4) return this.submit()
      // go to next input
      if (e.keyCode !== 13 && e.target.value.length) {
        const next = e.target.nextSibling
        return next && next.focus()
      }
    },
    reset () {
      this.pin = ['', '', '', '']
      this.$el.querySelector('input').focus()
    },
    close () {
      return lastRt?.name ? this.$router.go(-1) : this.$router.push('/')
    }
  },
  components: { svgX }
}
</script>

<style>
.login input{
  -webkit-text-security:disc;
  caret-color:transparent;
  /*&:focus{
    outline-color:white;
  }*/

  /* Chrome, Safari, Edge, Opera */
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  /* Firefox */
  &[type=number] {
    -moz-appearance: textfield;
  }
}
.login .error-shake{
  animation: shake .5s linear;
}

@keyframes shake {
  8%, 41% {
    transform: translateX(-10px);
  }
  25%, 58% {
    transform: translateX(10px);
  }
  75% {
    transform: translateX(-5px);
  }
  92% {
    transform: translateX(5px);
  }
  0%, 100% {
    transform: translateX(0);
  }
}

</style>

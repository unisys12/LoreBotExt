<template>
<div id="app">
<section class="hero is-primary is-bold">
  <div class="space">
    <header class="columns is-vcentered">
      <section class="column is-6">
        <a href="index.html" class="title">
            <h1 class="title">LoreBot Chrome Extension <small>v{{ getAppVersion }}</small></h1>
        </a>
        <p class="sub-title">Bringing Destiny In-Game Lore to Your Browser</p>
      </section>
      <section class="column is-6 level">            
        <label for="displayName" class="label level-item">Gamertag: 
          <input type="text" name="displayName" v-model="displayName" class="level-item displayName">
          <button class="button level-item has-text-centered" @click="getDisplayName">Get Characters</button>
        </label>          
      </section>
    </header>
  </div>
</section>
<Character></Character>
<Grimoire></Grimoire>
</div>
</template>

<script>
import Store from './store'
import Character from './components/character.vue'
import Grimoire from './components/grimoire.vue'

export default {
  name: 'LoreBot',
  Store,
  data () {
    return {
      displayName: ''
    }
  },
  methods: {
    getDisplayName: function() {
      let vm = this
      let string = vm.displayName
      Store.commit('storeDisplayName', string)
    }
  },
  computed: {
    getAppVersion: function() {
      let pkg = require('../package.json')
      return pkg.version
    }
  },
  components: { Character, Grimoire }
}
</script>

<style scoped>
.space {
  padding: 2rem;
}

.displayName {
  margin: 0 1rem;
}
</style>

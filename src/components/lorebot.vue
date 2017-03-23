<template>
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
          <button class="button level-item has-text-centered" v-on:click="">Get Characters</button>
        </label>          
      </section>
    </header>
  </div>
</section>
</template>

<script>
export default {
  name: 'LoreBot',
  data () {
    return {

    }
  },
  computed: {
    getAppVersion: function() {
      let pkg = require('../../package.json')
      return pkg.version
    }
  }
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

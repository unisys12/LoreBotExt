<template>
<section class="section" :theGrimoire="getGrimoire()">
  <div class="container is-fluid" v-show="activity">
    <span class="title">Grimoire</span>
    <hr>
    <div class="columns">
      <pre>{{ activity }}</pre>
    </div>
  </div>
</section>
</template>

<script>
import Store from '../store'
import grimoireDefinitions from '../Bungie/grimoireDefs'

export default {
  name: 'Grimoire',
  Store,
  data () {
    return {
      grimoireMessage: '',
      activity: ''
    }
  },
  methods: {
    getGrimoire: async function(activity) {
      console.log('Currect Activity: ', this.fetchAcivity)
    }
  },
  computed: {
    fetchAcivity: function() {
      return Store.getters.fetchActivity
    }
  }
}
</script>

<style></style>
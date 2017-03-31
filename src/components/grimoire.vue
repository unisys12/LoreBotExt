<template>
<section class="section" :getActive="getGrimoire()">
  <div class="container" v-if="activity != ''">
    <span class="title">Grimoire</span>
    <hr>
    <div class="columns" v-for="card in grimoireCard">
        <article class="column is-three-quarters content">
            <h2>{{ card._id }}</h2>
            <h4 v-html="card.cardIntro"></h4>
            <p v-html="card.cardDescription"></p>
        </article>
        <figure class="column"><img :src="'https://bungie.net' + card.cardImage" alt="card-image"></figure>
    </div>
  </div>
  <div class="container" v-else>
    <span class="title">Grimoire</span>
    <hr>
    <article class="notification is-primary">
      {{ grimoireMessage }}
    </article>
  </div>
</section>
</template>

<script>
const _ = require('underscore')
import Store from '../store'
import grimoireDefinitions from '../Bungie/grimoireDefs'

export default {
  name: 'Grimoire',
  Store,
  data () {
    return {
      grimoireMessage: '',
      activity: '',
      activityName: '',
      activityDescription: '',
      destinationHash: '',
      placeHash: '',
      activityTypeHash: '',
      grimoireCard: ''
    }
  },
  methods: {
    getGrimoire: _.throttle(async function() {
      if(this.fetchCharacter.length == 0){
        this.grimoireMessage = 'There is no current activity...'
      }else{
        this.activity = await Store.getters.fetchActivity
        try {
          let cards = await grimoireDefinitions.fetchCards(this.activity.activityName)
          // Store grimoire card data
          if(cards.length > 0){
            Store.commit('storeGrimoire', cards)
            this.grimoireCard = cards
          }else{
            this.grimoireMessage = "Cannot seem to find any Grimoire related to this activity..."
          }
        } catch (error) {
          this.grimoireMessage = 'Fetching Grimoire related to current activity...'
        }
      }
    }, 5000)
  },
  computed: {
    fetchCharacter: function() {
      return Store.getters.fetchActive
    }
  }
}
</script>

<style></style>
<template>
<section class="section" :getActive="getGrimoire()">
  <div class="container" v-if="grimoireCard != ''">
    <span class="title">Grimoire</span>
    <hr>
    <div class="columns is-multiline" v-for="card in grimoireCard">
      <article class="column is-three-quarters content">
          <h2 v-html="card._id"></h2>
          <h4 v-html="card.cardIntro"></h4>
          <h4 v-html="card.cardAttribution"></h4>
          <p v-html="card.cardDescription"></p>
      </article>
      <figure class="column"><img :src="'https://bungie.net' + card.cardImage" alt="card-image"></figure>
      <section class="section">
        <div class="container">
          <div class="columns" v-show="card.categories.length > 0">
            <div class="column content category" v-for="categories in card.categories">
              <h2>{{ categories.name }}</h2>
              <a :href="categories.ishtar_url" target="_blank">More Info on {{ categories.name }}</a>
            </div>
          </div>
        </div>
      </section>
      <br>
    </div>
  </div>
  <div class="container" v-else>
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
      grimoireCard: '',
      categories: ''
    }
  },
  methods: {
    getGrimoire: _.throttle(async function() {
      if(this.fetchCharacter.length == 0) {
        this.grimoireMessage = 'No Active Characters Found...'
      }else{
        try {
          this.activity = await Store.getters.fetchActivity
          let cards = await grimoireDefinitions.fetchCards(this.activity.activityName)
          // Store grimoire card data
          if(cards.length > 0){
            this.grimoireCard = cards
          }else{
            this.grimoireMessage = "Cannot seem to find any Grimoire related to this activity..."
            this.grimoireCard = ''
          }
        } catch (error) {
          this.grimoireMessage = 'Fetching Grimoire related to current activity...', error
        }
      }
    }, 3000, true)
  },
  computed: {
    fetchCharacter: function() {
      return Store.getters.fetchActive
    }
  }
}
</script>

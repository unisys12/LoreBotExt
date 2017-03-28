<template>
<section class="category-display" :getCategories="getCategories()">
  <div class="container is-fluid" v-if="grimoireCard != ''">
    <span class="title">Grimoire Categories</span>
    <hr>
  <pre>{{ grimoireCard }}</pre>
    <div class="columns" v-for="category in grimoireCard">
      <section class="card column">
        <div class="card-header">
          <p class="header-title">{{ category.name }}</p>
        </div>
        <article class="card-content">
          <section class="content">
            <a :href="category.ishtar_url" target="_blank">More Info on {{ category.name }}</a>
          </section>
        </article>
      </section>
    </div>
  </div>  
  <div class="container" v-else>
    <span class="title">Grimoire Categories</span>
    <hr>
    <article class="notification is-primary">
      {{ categoryMessage }}
    </article>
  </div>
</section>

</template>

<script>
import Ishtar from '../Ishtar/api'
import Store from '../store'

export default {
  name: 'Categories',
  data () {
    return {
      categoryMessage: '',
      activity: '',
      grimoireCard: '',
      categories: ''
    }
  },
  Store,
  methods: {
    getCategories: async function(cards) {
      let categories = []
      let card = []
      this.grimoireCard = Store.getters.fetchCards
      
      if(this.grimoireCard != ''){
        this.grimoireCard.map(async function(x) {
          card.push(await Ishtar.getCards(x._id.toLowerCase().replace(' ', '-')))
        })
      }
      
      if(card.length > 0) {
        card.map((x)=>{
          this.categories = x.data.grimoire_card.categories
        })
      }

      if(this.categories == ''){
        this.categoryMessage = 'There does not seem to be any categories for this activity...'
      }
    }
  }
}
</script>

<style>

</style>

<template>
<section class="category-display" :getCategories="getCategories()">
  <div class="container is-fluid" v-if="categories != ''">
    <span class="title">Grimoire Categories</span>
    <hr>
    <div class="columns" v-for="category in categories">
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
const _ = require('underscore')

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
    getCategories: _.throttle(async function(cards) {
      let categories = []
      let card = []
      let vm = this
      this.grimoireCard = Store.getters.fetchCards
      
      if(this.grimoireCard != ''){
        this.grimoireCard.map(async function(x) {          
          let cardName = Ishtar.processSlug(x._id)          
          let instance = await Ishtar.getCards(cardName)          
          console.log('Instance: ', instance)
          if(instance.status != 200 || instance.data.grimoire_card.categories.length == 0){
            vm.categoryMessage = 'There does not seem to be any categories for this activity...'
          }else{
            card.push(instance)
            if(card.length > 0){
              card.map((x)=>{
                console.log('mapping cats to data w/: ', x.data.grimoire_card.categories)
                vm.categories = x.data.grimoire_card.categories
              })
            }
            //vm.categories = instance.data.grimoire_card.categories
            console.log(vm.categories)
          }          
        
        })
      }else{
        vm.categoryMessage = 'Since there is no activity, at the moment, we cannot display categories...'
      }

      
    }, 10000)
  }
}
</script>

<style>

</style>

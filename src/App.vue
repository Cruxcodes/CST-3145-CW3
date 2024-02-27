<template>
  <div id="app">
    <!-- <header>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />
      </div>
    </header> -->

    <main>
      <LessonItem
        :afterSchoolActivity="[
          {
            id: 1,
            icon: 'fas fa-table',
            subject: 'Maths',
            location: 'Manchester',
            price: 500,
            spaces: 5,
            availableSpace: 5,
          },
          {
            id: 2,
            icon: 'fas fa-pencil-alt',
            subject: 'English',
            location: 'Brentford',
            price: 1000,
            spaces: 5,
            availableSpace: 2,
          },
        ]"
        :showCart="[true]"
      />
    </main>
  </div>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
<script setup>
import HelloWorld from "./components/HelloWorld.vue";
import TheWelcome from "./components/TheWelcome.vue";
import LessonItem from "./components/LessonItem.vue";
import Checkout from "./components/Checkout.vue";
</script>
<script>
export default {
  data() {
    return {
      showCart: false,
      showSortOrder: false,
      searchedItem: "",
      initialRender: true,
      picked: "",
      selected: "",
      afterSchoolActivity: [],
      cart: [],
      serverURL:
        "https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/collections/lessons",
    };
  },
};
</script>

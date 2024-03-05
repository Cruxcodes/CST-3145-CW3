<template>
  <div id="app">
    <!-- <header>
      <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />

      <div class="wrapper">
        <HelloWorld msg="You did it!" />
      </div>
    </header> -->

    <header>
      <h2>AfterLessons</h2>
      <!-- This is the search bar -->
      <div class="headerFlex">
        <div class="search" v-show="!showCart">
          <input
            type="text"
            v-model="searchedItem"
            v-on:input="searchLessons"
          />
          <a v-bind:href="serverURL" target="_blank">link</a>
          <button @click="deleteAllCaches" class="test-elem">
            <font-awesome-icon icon="fas fa-trash" />
            Delete All Caches
          </button>
          <button @click="reloadPage" class="test-elem">
            <font-awesome-icon icon="fas fa-sync" />
            Reload Page
          </button>
          <button @click="unregisterAllServiceWorkers" class="test-elem">
            <span class="fab fa-uniregistry"></span>
            Unregister All ServiceWorkers
          </button>
        </div>

        <button style="border-radius: 30px; border: 1px solid gray">
          <div
            v-on:click="showCart = !showCart"
            @click="showCheckout"
            class="cartIcon"
          >
            <i
              class="fa-solid fa-cart-shopping"
              style="color: #9b9d9f; margin-right: 10px"
            ></i>
            <div>
              <p>{{ cart.length }}</p>
            </div>
            {{ currentView == LessonItem ? "Go to Cart" : "Go to Lesson" }}
          </div>
        </button>
      </div>
    </header>

    <main>
      <component
        :is="currentView"
        :afterSchoolActivity="afterSchoolActivity"
        :showCart="[true]"
        @add-item-to-cart="addToCart"
        :cart="cart"
        @remove-item-from-cart="removeFromCart"
      ></component>

      <!-- <LessonItem
        :afterSchoolActivity="afterSchoolActivity"
        :showCart="[true]"
        @add-item-to-cart="addToCart"
        :cart="cart"
      /> -->
    </main>
  </div>
</template>
<style>
@import "./assets/index.css";
</style>
<script setup>
import LessonItem from "./components/LessonItem.vue";
import Checkout from "./components/Checkout.vue";
</script>
<script>
export default {
  data() {
    return {
      currentView: LessonItem,
      testConsole: true,
      showTestConsole: true,
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
  components: {
    LessonItem,
    Checkout,
  },
  created: function () {
    let webstore = this;
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker.register("service-worker.js");
    // }
    // this.getLessons();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("./service-worker.js");
    }
    try {
      fetch(this.serverURL).then(function (response) {
        response.json().then(function (json) {
          webstore.afterSchoolActivity = json;
        });
      });
    } catch (ex) {
      console.log("errror");
    }
  },
  methods: {
    showCheckout() {
      if (this.currentView === Checkout) this.currentView = LessonItem;
      else this.currentView = Checkout;
    },
    async searchLessons() {
      try {
        const response = await fetch(
          `https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/search/collections/lessons?q=${this.searchedItem}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        this.afterSchoolActivity = responseData;
        return responseData; // Save the data in a component variable
      } catch (error) {
        // Handle errors
        console.error(error);
      }
    },
    addToCart(lesson) {
      if (lesson.availableSpace > 0) {
        lesson.availableSpace++;
      } else {
        lesson.availableSpace++;
        this.cart.push(lesson);
      }
      lesson.spaces--;
    },
    removeFromCart(lesson) {
      this.afterSchoolActivity.map((element) => {
        if (lesson.id == element.id) {
          lesson.spaces++;
          lesson.availableSpace--;
        }
      });
      this.cart = this.cart.filter((element) => element.availableSpace != 0);
    },
    reloadPage() {
      window.location.reload();
    },
    unregisterAllServiceWorkers() {
      navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
          registration.unregister();
        }
      });
      console.log("ServiceWorkers Unregistered");
    },
    deleteAllCaches() {
      caches.keys().then(function (names) {
        for (let name of names) caches.delete(name);
      });
      console.log("All Caches Deleted");
    },
  },
};
</script>

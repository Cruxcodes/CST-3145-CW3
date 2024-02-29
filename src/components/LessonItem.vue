<template>
  <div>
    <!-- Sort -->
    <h3>Sort Lessons by:</h3>
    <div class="sort">
      <div class="sortby">
        <div>
          <input
            type="radio"
            name="sort"
            value="subject"
            id="subject"
            v-model="picked"
            v-on:change="sortLessons(picked)"
          />
          <label for="subject">Subject</label>
        </div>
        <div>
          <input
            type="radio"
            name="sort"
            value="location"
            id="location"
            v-model="picked"
            v-on:change="sortLessons(picked)"
          />
          <label for="location">Location</label>
        </div>
        <div>
          <input
            type="radio"
            name="sort"
            value="price"
            id="price"
            v-model="picked"
            v-on:change="sortLessons(picked)"
          />
          <label for="price">Price</label>
        </div>
        <div>
          <input
            type="radio"
            name="sort"
            value="spaces"
            id="spaces"
            v-model="picked"
            v-on:change="sortLessons(picked)"
          />
          <label for="spaces"> Space Available</label>
        </div>
      </div>
      <select
        v-show="showSortOrder"
        v-model="selected"
        v-on:change="orderLesson()"
      >
        <option disabled value="">Select Order</option>
        <option :disabled="initialRender">Ascending</option>
        <option>Descending</option>
      </select>
    </div>
    <div class="lessons">
      <div class="activities">
        <div v-for="activity in afterSchoolActivity" :key="activity.id">
          <i v-bind:class="activity.icon"></i>
          <p>
            <font-awesome-icon :icon="activity.icon" />
          </p>
          <p>Subject: {{ activity.subject }}</p>
          <p>Location: {{ activity.location }}</p>
          <p>Price: £ {{ activity.price }}</p>
          <p>Spaces: {{ activity.spaces }}</p>
          <button
            v-if="canAddToCart(product)"
            v-bind:disabled="activity.spaces <= 0"
            v-on:click="addToCart(activity, true)"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LessonItem",
  props: ["afterSchoolActivity", "showCart", "cart"],
  data() {
    return {
      showSortOrder: false,
      searchedItem: "",
      initialRender: true,
      picked: "", // Holds the selected sorting option
      selected: "", // Holds the selected sort order
    };
  },
  methods: {
    canAddToCart(product) {
      return product.availableInventory > this.cartCount(product.id);
    },
    addToCart(lesson, type) {
      if (lesson.availableSpace > 0) {
        lesson.availableSpace++;
      } else {
        lesson.availableSpace++;
        this.cart.push(lesson);
      }
      lesson.spaces--;
    },
    orderLesson() {
      this.initialRender = false;
      this.afterSchoolActivity.reverse();
    },
    sortLessons(selected) {
      this.selected = "";
      this.initialRender = true;
      this.showSortOrder = true;
      switch (selected) {
        case "subject":
          this.afterSchoolActivity = this.afterSchoolActivity.sort((a, b) =>
            a.subject.localeCompare(b.subject)
          );
          break;
        case "location":
          this.afterSchoolActivity = this.afterSchoolActivity.sort((a, b) =>
            a.location.localeCompare(b.location)
          );
          break;
        case "price":
          this.afterSchoolActivity = this.afterSchoolActivity.sort(
            (a, b) => parseFloat(a.price) - parseFloat(b.price)
          );
          break;
        case "spaces":
          this.afterSchoolActivity = this.afterSchoolActivity.sort(
            (a, b) => a.spaces - b.spaces
          );
          break;
      }
    },
  },
};
</script>

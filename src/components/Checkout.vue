<template>
  <div class="cart">
    <p>This is the cart section</p>
    <div class="activities">
      <div
        v-for="activity in cart"
        v-show="activity.availableSpace > 0"
        :key="activity.id"
      >
        <i v-bind:class="activity.icon"></i>
        <p>Subject: {{ activity.subject }}</p>
        <p>Location: {{ activity.location }}</p>
        <p>Price: £ {{ activity.price }}</p>
        <p>Price: £ {{ activity.price }}</p>
        <p>Booked Slots: {{ activity.availableSpace }}</p>
        <button v-on:click="removeFromCart(activity)">Remove from Cart</button>
      </div>
    </div>
    <div class="totalincart">
      <h3>Cart Total: £ {{ totalInCart }}</h3>
    </div>

    <div class="checkout" style="margin-top: 20px" v-show="cart.length > 0">
      <h3>Checkout</h3>
      <form>
        <div>
          <div>
            <label for="name">Name:</label>
            <input type="text" v-model="name" />
          </div>
          <div>
            <label for="name">Phone:</label>
            <input type="tel" v-model="phoneNumber" />
          </div>
        </div>

        <button
          type="submit"
          :disabled="!isNameandNumberValid"
          v-on:click="checkout"
        >
          Checkout
        </button>
      </form>
    </div>
    <div class="noItem" v-show="cart.length <= 0">
      <p>Your cart is empty</p>
    </div>
  </div>
</template>

<script>
export default {
  props: ["cart"],
  data() {
    return {
      name: "",
      phoneNumber: "",
    };
  },
  computed: {
    isNameandNumberValid() {
      const namePattern = /^[a-zA-Z ]+$/;
      const phoneNumberTest = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
      return namePattern.test(this.name) && phoneNumberTest.test(this.phoneNumber);
    },
    totalInCart() {
      return this.cart.reduce((total, activity) => total + activity.price * activity.availableSpace, 0);
    },
  },
  methods: {
    removeFromCart(lesson) {
      this.afterSchoolActivity.map((element) => {
        if (lesson.id == element.id) {
          lesson.spaces++;
          lesson.availableSpace--;
        }
      });
      this.cart = this.cart.filter((element) => element.availableSpace != 0);
    },
    async pushOrder() {
      try {
        const response = await fetch(
          `https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/collections/orders`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              // Your data to be updated goes here
              name: this.name.toString(),
              phoneNumber: this.phoneNumber,
              lessons: this.cart.map((item) => {
                return {
                  lesson_id: item._id,
                  spaceTaken: item.availableSpace,
                };
              }),
            }),
          }
        );
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        if (responseData.insertedId != null) {
          for (i = 0; i < this.cart.length; i++) {
            console.log(this.cart[i]._id);
            await this.updateData(this.cart[i]._id, this.cart[i].spaces);
          }
        }
        return responseData;
      } catch (error) {
        // Handle errors
        console.error("Error updating data:", error.message);
      }
    },
    orderLesson() {
      this.initialRender = false;
      this.afterSchoolActivity.reverse();
    },
    async checkout(e) {
      e.preventDefault();
      const result = await this.pushOrder();
      if (result.insertedId != null) {
        alert(
          `Dear ${this.name} your order has been submitted. You shall be contacted on ${this.phoneNumber}`
        );
        location.reload(true);
      } else {
      }
    },
  },
};
</script>

<template>
  <div class="lessons">
    <div class="activities">
      <div v-for="activity in afterSchoolActivity" :key="activity.id">
        <i v-bind:class="activity.icon"></i>
        <p>Subject: {{ activity.subject }}</p>
        <p>Location: {{ activity.location }}</p>
        <p>Price: £ {{ activity.price }}</p>
        <p>Spaces: {{ activity.spaces }}</p>
        <button
          v-bind:disabled="activity.spaces <= 0"
          v-on:click="addToCart(activity, true)"
        >
          Add to Cart
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default{
   data: {
          showCart: false,
          showSortOrder: false,
          searchedItem: "",
          initialRender: true,
          name: "",
          phoneNumber: "",
          picked: "",
          selected: "",
          afterSchoolActivity: [],
          cart: [],
          serverURL:
            "https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/collections/lessons",
        },
        computed: {
          isNameandNumberValid() {
            const namePattern = /^[a-zA-Z ]+$/;
            const phoneNumberTest =
              /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
            return (
              namePattern.test(this.name) &&
              phoneNumberTest.test(this.phoneNumber)
            );
          },
          totalInCart() {
            let total = 0;
            for (let index = 0; index < this.cart.length; index++) {
              let value =
                this.cart[index].price * this.cart[index].availableSpace;
              total += value;
            }
            return total;
          },
          filteredList() {
            return this.afterSchoolActivity.filter((lesson) => {
              return (
                lesson.subject
                  .toLowerCase()
                  .includes(this.searchedItem.toLowerCase()) ||
                lesson.location
                  .toLowerCase()
                  .includes(this.searchedItem.toLowerCase())
              );
            });
          },
        },
        created() {
          if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register("service-worker.js");
          }
          this.getLessons();
        },
        methods: {
          addToCart(lesson, type) {
            if (lesson.availableSpace > 0) {
              lesson.availableSpace++;
            } else {
              lesson.availableSpace++;
              this.cart.push(lesson);
            }
            lesson.spaces--;
          },
          unregisterAllServiceWorkers() {
            navigator.serviceWorker
              .getRegistrations()
              .then(function (registrations) {
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
          removeFromCart(lesson) {
            this.afterSchoolActivity.map((element) => {
              if (lesson.id == element.id) {
                lesson.spaces++;
                lesson.availableSpace--;
              }
            });
            this.cart = this.cart.filter(
              (element) => element.availableSpace != 0
            );
          },
          sortLessons(selected) {
            this.selected = "";
            this.initialRender = true;
            this.showSortOrder = true;
            switch (selected) {
              case "subject":
                this.afterSchoolActivity = this.afterSchoolActivity.sort(
                  (a, b) => a.subject.localeCompare(b.subject)
                );
                break;
              case "location":
                this.afterSchoolActivity = this.afterSchoolActivity.sort(
                  (a, b) => a.location.localeCompare(b.location)
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
          async getLessons() {
            try {
              const response = await fetch(
                `https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/collections/lessons`,
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
          async updateData(entryId, spacesLeft) {
            try {
              const response = await fetch(
                `https://vueproject-env.eba-2ewpm3t7.eu-west-2.elasticbeanstalk.com/collections/lessons/${entryId}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    spaces: spacesLeft,
                  }),
                }
              );

              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              const responseData = await response.json();
              return responseData;
            } catch (error) {
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
      });
}
</script>

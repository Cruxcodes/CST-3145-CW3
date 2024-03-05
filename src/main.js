import Vue from "vue";
import App from "./App.vue";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faPhone,
  faTable,
  faPencilAlt,
  faTrash,
  faSync,
  faCartShopping,
} from "@fortawesome/free-solid-svg-icons";
// import { createApp } from "vue";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import "./assets/main.css";
library.add(faPhone);
library.add(faTable);
library.add(faPencilAlt);
library.add(faTrash);
library.add(faCartShopping);
library.add(faSync);
// createApp(App).component("font-awesome-icon", FontAwesomeIcon).mount("#app");

// new Vue({
//   render: (h) => h(App),
// }).$mount("#app");

Vue.component("font-awesome-icon", FontAwesomeIcon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  // components: { App },
  render: (h) => h(App),
});

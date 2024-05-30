<script setup>
import { RouterView } from 'vue-router'

import HeaderComponent from './components/HeaderComponent.vue';

</script>

<template>
  <v-container>
    <header>

      <v-toolbar title="VGR">
        <div class="navbar">

          <RouterLink to="/" class="navbar-item">
            <v-icon icon="md:home"></v-icon>
            хоум
          </RouterLink>

          <RouterLink to="/profile" class="navbar-item">
            профиль
            <v-icon :icon="`mdiSvg:${mdiAccount}`"></v-icon>
          </RouterLink>
          <div v-if="authService.isAuth()">{{ username }}</div>

        </div>
      </v-toolbar>
    </header>

    <router-view />
  </v-container>
</template>
<script>
import authService from '@/services/auth.service';


export default {
  data() {
    return {
      isAuthenticated: false,
      user: null// Предполагаем, что у вас есть метод, который проверяет, аутентифицирован ли пользователь
    };
  },
  mounted() {
    // setInterval(this.getUser(), 1000);

  },
  computed: {
    username() {
      return authService.getCurrentUser().username;
    }
  },
  methods: {
    getUser() {
      var curUser = authService.getCurrentUser();
      this.user = curUser;
      return curUser;
    },
    isAuth() {
      return authService.isAuth();
    },
  }

};
</script>


<style scoped>
.navbar {
  display: flex;
  justify-items: space-between;
  background-color: blue;
}

.navbar-item {
  width: 100px;
  border: 1px black solid;
}
</style>

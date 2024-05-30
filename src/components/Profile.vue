<template>
  <div>
    <h1>Профиль пользователя</h1>
    <p v-if="user">Имя пользователя: {{ user.username }} {{ user.email }}</p>
    <p v-else>Пользователь не вошел в систему</p>
    <div>
      <v-btn @click="createGameContext">
        <RouterLink to="/games">Games</RouterLink>
      </v-btn>
    </div>
    <div>
      <v-btn @click="logout" color="primary">Log out</v-btn>
    </div>
  </div>

</template>

<script>
import authService from '@/services/auth.service';



export default {
  data() {
    return {
      user: null
    };
  },
  mounted() {
    this.getUserData();
  },
  methods: {
    getUserData() {
      this.user = authService.getCurrentUser();
    },
    click() {
      // Добавьте здесь код, который нужно выполнить при нажатии на кнопку
    },
    logout() {
      console.log("logout")
      authService.logout()
    }
  }
};
</script>

<style scoped>
/* Добавьте стили здесь, если это необходимо */
</style>

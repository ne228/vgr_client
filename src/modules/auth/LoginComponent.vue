<template>
  <v-container>
    <h2>Login</h2>
    <div>
      <h3>Login</h3>
      <v-form @submit.prevent="login">
        <v-text-field v-model="user.username" label="Username" required></v-text-field>
        <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary">Login</v-btn>
      </v-form>
      <p v-if="error" class="red--text">{{ error }}</p>
    </div>
    <div>
      <h3>Login as guest</h3>
      <v-form @submit.prevent="guest_login">
        <v-text-field v-model="guest.username" label="Username" required></v-text-field>
        <v-btn type="submit" color="primary">Login as guest</v-btn>
      </v-form>
      <p v-if="guest_error" class="red--text">{{ guest_error }}</p>
    </div>
  </v-container>
</template>

<script>
import authService from '@/services/auth.service';

export default {
  data() {
    return {
      user: {
        username: '',
        password: ''
      },
      guest: {
        username: ''
      },
      error: '',
      guest_error: '',
    };
  },
  methods: {
    async login() {
      try {
        await authService.login(this.user);
        this.$router.push('/profile');
      } catch (error) {
        this.error = error.response.data.message || 'Произошла ошибка.';
      }
    },
    async guest_login() {
      try {
        await authService.guest_login(this.guest);
        this.$router.push('/profile');
      } catch (error) {
        this.guest_error = error.response.data.message || 'Произошла ошибка.';
      }
    }
  }
};
</script>

<style>
.red--text {
  color: red;
}
</style>

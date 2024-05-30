<template>
  <v-container>
    <h2>Register</h2>
    <div>
      <v-form @submit.prevent="register">
        <v-text-field v-model="user.username" label="Username" required></v-text-field>
        <v-text-field v-model="user.email" label="Email" required></v-text-field>
        <v-text-field v-model="user.password" label="Password" type="password" required></v-text-field>
        <v-btn type="submit" color="primary">Register</v-btn>
      </v-form>
      <p v-if="error" class="red--text">{{ error }}</p>
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
        email: '',
        password: ''
      },
      error: '',
    };
  },
  methods: {
    async register() {
      try {
        await authService.register(this.user);

        await authService.login(this.user);
        this.$router.push('/profile');
      } catch (error) {
        this.error = error.response.data.message || 'Произошла ошибка.';
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

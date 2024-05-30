<template>
    <v-container>
        <v-alert v-if="error" type="error">{{ error }}</v-alert>
        <v-btn color="primary" @click="get">Получить данные</v-btn>
    </v-container>
</template>

<script>
import { getData, post } from '@/services/apiService';

export default {
    data() {
        return {
            error: null
        };
    },
    methods: {
        async connect() {
            const id = this.$route.params.id;
            try {
                const response = await getData("connect/" + id);
                if (response.success) {
                    console.log("ok") 
                    this.$router.push({ name: '/game/' + id }); // Перенаправляем на route1 в случае успеха
                } else {
                    this.error = response.message; // В случае неудачи выводим сообщение об ошибке
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.error = 'Произошла ошибка при получении данных';
            }
        }
    },
    async created() {
        await this.get()
    }
};
</script>
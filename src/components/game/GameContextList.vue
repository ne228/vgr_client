<template>
    <div>
        <div>GameContexts</div>
        <v-btn @click="createGameContext">
            Create Game
        </v-btn>
        <hr>
    </div>
    <div>
        <!-- Создание списка GameContextLink на основе данных из API -->
        <GameContextLink v-for="(gameContext, index) in gameContexts" :key="index" :gameContext="gameContext" />
    </div>
    <div>
        <error-message :error="errorMessage" />
        <!-- Ваш код компонента -->
    </div>
</template>

<script>

import GameContextLink from '@/components/game/GameContextLink.vue'; // Импортируем компонент
import ErrorMessage from '../ErrorMessage.vue';
import router from '@/router';
// import apiService from '@/services/apiService';
import { getData, post } from '@/services/apiService';
import { errorMessages } from 'vue/compiler-sfc';

export default {
    name: 'GameContext',
    components: {
        GameContextLink,
        ErrorMessage
    },
    data() {
        return {
            gameContexts: [],
            errorMessages: null,
        };
    },
    async created() {
        await this.fetchGameContexts();
    },
    methods: {
        async fetchGameContexts() {
            try {
                console.log('tests')
                let gameContextId = this.$route.params.id;
                const response = await getData("get_contexts")
                console.log("success")
                if (response.status == 200) {
                    console.log("success")
                    console.log(response)
                    this.gameContexts = response.data;
                } else {
                    this.errorMessage = response.error
                    console.log(response)
                    console.log('errror')
                }
                // console.log("success")
            } catch (error) {
                console.error('Failed to fetch game contexts:', error);
                this.errorMessage = error
                console.log('catch error')
            }
        },

        async createGameContext() {
            try {
                try {
                    console.log('tests')
                    const response = await getData("create_context")

                    if (response.status == 200) {
                        // router.push('/game_contexts')
                        await this.fetchGameContexts();

                    } else {
                        this.errorMessage = response.error
                    }
                } catch (error) {
                    console.error('Failed to fetch create contexts:', error);
                }

                // this.gameContexts = response.data;
            } catch (error) {
                console.error('Failed to fetch create contexts:', error);
            }
        }
    }
}
</script>

<style scoped>
/* Здесь можно добавить стили, если необходимо */
</style>
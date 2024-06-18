<template>
    <v-dialog max-width="700" max-height="900">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn>Подробнее</v-btn>

        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="pa-5 ma-5">
                <v-card-actions class="d-flex justify-content-between w-100">
                    <h2 class="w-100 bold">Карта</h2>
                    <v-btn class="bg-info" text="Close" @click="isActive.value = false"></v-btn>
                </v-card-actions>
                <v-divider></v-divider>
                <div class="big-card-container mt-3">
                    <CardComponent class="pa-5 big-card" :cardData="cardData" :isSelected="isSelected" :toggle="toggle">
                    </CardComponent>
                </div>
            </v-card>
        </template>
    </v-dialog>


</template>

<script>
import { getData } from '@/services/apiService';
import CardComponent from './CardComponent.vue';

export default {
    props: {
        cardData: Object,
    },
    components: {
        CardComponent
    },
    data() {
        return {
            cardActions: []
        };
    },
    methods: {
        async getEndpoint(path) {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData(path);

                if (response.status == 200) {
                    console.log("get ", path, response)
                    this.cardActions = response.data;// JSON.parse(response.data)
                    console.log(this.cardActions)
                } else {
                    this.error = error.response.data.message;
                }
            } catch (error) {
                console.error('Error fetching data:', error.response.data.message);
                this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        },
        async toggle() {

        }
    },
}

</script>

<style scoped>
.big-card {
    margin-left: auto;
    margin-right: auto;
}
</style>
<template>
    <v-dialog max-width="400" max-height="900">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="mb-2 w-100" v-bind="activatorProps">{{ cardData.title }} <span v-if="cardData.power > 0">+ {{
                cardData.power }} </span>
            </v-btn>
        </template>

        <template v-slot:default="{ isActive }">
            <v-card class="pa-5 ma-5">
                <v-card-actions class="d-flex justify-content-between w-100">
                    <h2 class="w-100 bold">Карта</h2>
                    <v-btn variant="outlined" text="Закрыть" @click="isActive.value = false"></v-btn>
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
        async getActions() {
            this.error = ''
            const id = this.$route.params.id;
            console.log("cardId", this.cardData);
            try {
                const response = await getData(`get_card_action/${id}?cardId=${this.cardData.id}`);

                if (response.status == 200) {
                    console.log("get ", response)
                    var data = response.data.cardActions;
                    this.cardActions = data;
                    console.log(this.cardActions)
                } else {
                    this.error = error.response.data.message;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        },
        async toggle() {

        }
    },
}

</script>

<style scoped>
.small-card {
    width: 100%;
    transition: all 2s ease-in-out;
    border-radius: 10px;
    /* border: 3px solid black; */
    /* margin-right: 15px; */
    min-height: 42px;
    cursor: pointer;
}

.big-card {
    margin-left: auto;
    margin-right: auto;
}

.enemy-card {
    display: flex;
    flex-direction: column;
    justify-items: baseline;
    justify-content: space-between;
    /* border: 2px solid red; */
    height: 100%;

}


.text-left {
    align-self: flex-start;
    left: 0;
}

.actions {
    border-radius: 10px;
    border: 3px solid black;
    background-color: #595bc9;
    margin: 2%;
}

.action {
    margin: 1%;
    width: 100%;
}

.item-text {
    max-height: 100px;
}

.item-img {
    max-height: 160px;
}

.big-card-container {
    display: flex;
    justify-content: center
}
</style>
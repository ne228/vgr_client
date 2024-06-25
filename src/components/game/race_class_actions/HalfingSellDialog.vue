<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn color="primary" @click="activateSpell" v-bind="activatorProps">
                    <img class="icon" src="/src/assets/halfing.png"></img>
                    Халфинг : Продать шмотку
                </v-btn>
            </template>

            <v-card>
                <v-card-title class="text-center">
                    Халфинг : Продать шмотку
                </v-card-title>
                <div class="text-center subtitle">
                    Продать шмотку за двойную цену
                </div>

                <!-- Выбранные карточки -->
                <v-divider></v-divider>
                <div class="mt-2">
                    <v-card-subtitle>Выбранные карточки</v-card-subtitle>
                    <v-row class="selected-cards">
                        <v-col v-for="(card, index) in selectedCards" :key="index" cols="12" md="4">
                            <CardSmallComponent :cardData="card"></CardSmallComponent>
                        </v-col>
                    </v-row>
                </div>
                <v-divider></v-divider>

                <!-- Список карточек -->
                <v-list lines="three">
                    <v-list-subheader>Доступные карточки</v-list-subheader>

                    <v-list-item v-for="(card, index) in cards" :key="index" :value="card"
                        @click="toggleCardSelection(card)" :class="{ selected: isSelected(card) }">
                        <v-list-item-content>
                            <v-list-item-title>{{ card.title }}</v-list-item-title>
                            <v-list-item-subtitle>{{ card.text }}</v-list-item-subtitle>
                        </v-list-item-content>
                    </v-list-item>
                </v-list>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn text="Clear" variant="outlined" @click="clearSelection">Очистить</v-btn>
                    <v-btn text="Close" variant="plain" @click="dialog = false">Закрыть</v-btn>
                    <v-btn color="primary" variant="tonal" @click="doHalfingSell"
                        :disabled="selectedCards.length != maxItems">
                        Продать
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import CardSmallComponent from '../CardSmallComponent.vue';
import CardInfo from '../CardInfo.vue';
import { getData } from '@/services/apiService';

export default {
    components: {
        CardSmallComponent,
        CardInfo
    },
    name: 'WizardFlyDialog',
    props: {
        cards: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            selectedCards: [],
            maxItems: 1 // максимальное количество выбранных элементов
        };
    },
    methods: {
        toggleCardSelection(card) {
            const index = this.selectedCards.indexOf(card);
            if (index > -1) {
                this.selectedCards.splice(index, 1);
            } else if (this.selectedCards.length < this.maxItems) {
                this.selectedCards.unshift(card); // Добавляем элемент в начало массива
            }
        },
        isSelected(card) {
            return this.selectedCards.includes(card);
        },
        clearSelection() {
            this.selectedCards = [];
        },
        async doHalfingSell() {
            const id = this.$route.params.id;
            var card1Id = this.selectedCards[0] ? this.selectedCards[0].id : "null";


            // Construct the endpoint URL with the card IDs
            var endpointUrl = `halfing_sell/${id}?cardId=${card1Id}`;
            await this.getEndpoint(endpointUrl);
            this.dialog = false;
            this.selectedCards = []
        },
        async getEndpoint(path) {
            this.error = '';
            const id = this.$route.params.id;
            try {
                const response = await getData(path);

                if (response.status == 200) {
                    console.log('get ', path, response);
                    this.cardActions = response.data; // JSON.parse(response.data)
                    console.log(this.cardActions);
                } else {
                    this.error = error.response.data.message;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.error = error; //'Произошла ошибка при получении данных';
            }
        }
    }
};
</script>

<style scoped>
.cards {
    display: flex;
    flex-direction: column;
}

.card {
    display: flex;
    flex-direction: row;
}

.card-data {
    width: 100%;
}

.selected-cards {
    min-height: 100px;
    padding: 1%;
}

.subtitle {
    font-size: 0.8em;
}

.v-list-item.selected {
    background-color: black;
    color: white;
}

.icon {
    width: 25px;
    height: 25px;
    margin-right: 5px;
    margin-left: -3px;
}
</style>
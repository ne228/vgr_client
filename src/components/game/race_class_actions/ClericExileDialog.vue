<template>
    <v-container>
        <!-- Кнопка активации диалога -->
        <v-btn class="text-center">
            <v-dialog v-model="dialog" max-width="600">
                <template v-slot:activator="{ props: activatorProps }">
                    <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Клерик: Изгнание"
                        variant="tonal" v-bind="activatorProps">
                        Клерик: Изгнание
                    </v-btn>
                </template>

                <v-card>
                    <v-card-title class="text-center">Клерик: Изгнание</v-card-title>
                    <v-card-text class="text-center">Можешь сбросить до З карт в бою против Андедов. Каждый сброс дает
                        тебе +3
                        Бонус.</v-card-text>


                    <!-- Выбранные карточки -->
                    <v-divider></v-divider>
                    <div class="mt-2">
                        <v-card-subtitle>Выбранные карточки</v-card-subtitle>
                        <v-row class="selected-cards">
                            <v-col v-for=" (card, index) in selectedCards" :key="index" cols="12" md="4">
                                <CardSmallComponent :cardData="card"></CardSmallComponent>
                            </v-col>
                        </v-row>
                    </div>
                    <v-divider></v-divider>

                    <!-- Список карточек с чекбоксами -->
                    <v-list lines="three" select-strategy="classic">
                        <v-list-subheader>Доступные карточки</v-list-subheader>

                        <v-list-item v-for="(card, index) in cards" :key="index" :value="card"
                            @click="toggleCardSelection(card)">
                            <template v-slot:prepend="{ isActive }">
                                <v-list-item-action start>
                                    <v-checkbox-btn :model-value="isSelected(card)"></v-checkbox-btn>
                                </v-list-item-action>
                            </template>

                            <v-list-item-content>
                                <v-list-item-title>{{ card.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{ card.text }}</v-list-item-subtitle>
                            </v-list-item-content>

                            <!-- <template v-slot:append>
                                <CardInfo text @click.stop="showDetails(card)">

                                </CardInfo>
                            </template> -->
                        </v-list-item>
                    </v-list>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn text="Close" variant="plain" @click="dialog = false">Закрыть</v-btn>
                        <v-btn color="primary" variant="tonal" @click="doClericExile"
                            :disabled="selectedCards.length != 3">
                            Изгнание
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-btn>
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
    name: 'ClericExileDialog',
    props: {
        cards: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            selectedCards: []
        };
    },
    methods: {
        toggleCardSelection(card) {
            const index = this.selectedCards.indexOf(card);
            if (index > -1) {
                this.selectedCards.splice(index, 1);
            } else if (this.selectedCards.length < 3) {
                this.selectedCards.push(card);
            }
        },
        isSelected(card) {
            return this.selectedCards.includes(card);
        },
        async doClericExile() {
            const id = this.$route.params.id;
            var card1 = this.selectedCards[0]
            var card2 = this.selectedCards[1]
            var card3 = this.selectedCards[2]

            await this.getEndpoint(`cleric_exile/${id}?card1Id=${card1.id}&card2Id=${card2.id}&card3Id=${card3.id}`)
            this.dialog = false;
            this.selectedCards = []
        },
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

.checkbox {}
</style>

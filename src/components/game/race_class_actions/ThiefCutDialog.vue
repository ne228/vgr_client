<template>
    <v-container>
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn color="primary" v-bind="activatorProps">
                    <img class="icon" src="/src/assets/thief.png"></img>
                    Вор : Подрезка
                </v-btn>
            </template>
            <v-card>
                <v-stepper v-model="step" editable hide-actions
                    :items="['Выберите карту', 'Выберите игрока', 'Подрезка']">
                    <template class="step" v-slot:item.1>
                        <v-card>
                            <h4 class="text-center">
                                Можешь скинуть карту, чтобы подрезать другого игрока (-2 в бою).
                            </h4>
                            <v-divider class="mt-2"></v-divider>
                            <div class="mt-2">
                                <v-card-subtitle>Выбранная карта</v-card-subtitle>
                                <v-row class="selected-cards">
                                    <v-col v-for="(card, index) in selectedCards" :key="index" cols="12" md="4">
                                        <CardSmallComponent :cardData="card"></CardSmallComponent>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-divider></v-divider>

                            <!-- Список карточек -->
                            <v-list lines="three" class="all-cards">
                                <v-list-subheader>Доступные карточки</v-list-subheader>

                                <v-list-item v-for="(card, index) in cards" :key="index" :value="card"
                                    @click="toggleCardSelection(card)" :class="{ selected: isSelected(card) }">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ card.title }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ card.text }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text="Clear" variant="outlined" @click="clearSelection">Очистить</v-btn>
                                <v-btn text="Close" variant="plain" @click="dialog = false">Закрыть</v-btn>
                            </v-card-actions>

                        </v-card>
                    </template>

                    <template class="step" v-slot:item.2>
                        <v-card>
                            <h4 class="text-center">
                                Можешь скинуть карту, чтобы подрезать другого игрока (-2 в бою).
                            </h4>
                            <v-divider class="mt-2"></v-divider>
                            <div class="mt-2">
                                <v-card-subtitle>Выбранный игрок</v-card-subtitle>
                                <v-row class="selected-player-cards">
                                    <v-col v-for="(player, index) in selectedPlayers" :key="index" cols="12" md="4">
                                        <v-dialog max-width="500">
                                            <template v-slot:activator="{ props: activatorProps }">
                                                <v-btn v-bind="activatorProps">{{
                                                    player.user.username }}</v-btn>
                                            </template>

                                            <template v-slot:default="{ isActive }">
                                                <v-card title="Информация об игроке">
                                                    <div class="player-card-window">
                                                        <PlayerCard :player="player">
                                                        </PlayerCard>
                                                    </div>


                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </template>
                                        </v-dialog>
                                    </v-col>
                                </v-row>
                            </div>
                            <v-divider class="mt-2"></v-divider>

                            <!-- Список карточек -->
                            <v-list lines="three" class="all-cards">
                                <v-list-subheader>Доступные игроки</v-list-subheader>
                                <v-list-item v-for="(player, index) in resolvedPlayers" :key="index" :value="card"
                                    @click="togglePlayerSelection(player)"
                                    :class="{ selected: isPlayerSelected(player) }">
                                    <v-list-item-content>
                                        <v-list-item-title>{{ player.user.username }}</v-list-item-title>
                                        <v-list-item-subtitle> Сила {{ player.totalPower }}</v-list-item-subtitle>
                                    </v-list-item-content>
                                </v-list-item>
                            </v-list>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text="Clear" variant="outlined" @click="clearSelection">Очистить</v-btn>
                                <v-btn text="Close" variant="plain" @click="dialog = false">Закрыть</v-btn>
                            </v-card-actions>


                        </v-card>
                    </template>

                    <template v-slot:item.3>
                        <v-card>
                            <h4 class="text-center">
                                Можешь скинуть карту, чтобы подрезать другого игрока (-2 в бою).
                            </h4>
                            <v-divider class="mt-2"></v-divider>
                            <div class="mt-2 text-center">
                                <v-card-title>Выбранная карта</v-card-title>
                                <v-row class="">
                                    <v-col v-for="(card, index) in selectedCards" :key="index">
                                        <CardSmallComponent :cardData="card"></CardSmallComponent>
                                    </v-col>
                                </v-row>
                            </div>

                            <div class="mt-2 mb-2  text-center text">
                                <v-card-title>Выбранный игрок</v-card-title>
                                <div class="">
                                    <div v-for="(player, index) in selectedPlayers" :key="index">
                                        <v-dialog max-width="500">
                                            <template v-slot:activator="{ props: activatorProps }">
                                                <v-btn class="w-100" v-bind="activatorProps">{{
                                                    player.user.username }}</v-btn>
                                            </template>

                                            <template v-slot:default="{ isActive }">
                                                <v-card title="Информация об игроке">
                                                    <div class="player-card-window">
                                                        <PlayerCard :player="player">
                                                        </PlayerCard>
                                                    </div>


                                                    <v-card-actions>
                                                        <v-spacer></v-spacer>
                                                        <v-btn text="Закрыть" @click="isActive.value = false"></v-btn>
                                                    </v-card-actions>
                                                </v-card>
                                            </template>
                                        </v-dialog>
                                    </div>
                                </div>
                            </div>


                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn text="Clear" variant="outlined" @click="clearSelection">Очистить</v-btn>
                                <v-btn text="Close" variant="plain" @click="dialog = false">Закрыть</v-btn>
                                <v-btn color="primary" variant="tonal" @click="doThiefCut"
                                    :disabled="selectedCards.length != maxItems || selectedPlayers.length != maxPlayerItems">
                                    Подрезать
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </template>
                </v-stepper>


            </v-card>
        </v-dialog>

    </v-container>
</template>

<script>
import CardSmallComponent from '../CardSmallComponent.vue';
import CardInfo from '../CardInfo.vue';
import PlayerCard from '../PlayerCard.vue';
import { getData } from '@/services/apiService';

export default {
    components: {
        CardSmallComponent,
        CardInfo,
        PlayerCard
    },
    name: 'ThiefCut',
    props: {
        cards: {
            type: Array,
            required: true
        },
        players: {
            type: Array,
            required: true
        },
        fight: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            dialog: false,
            selectedCards: [],
            selectedPlayers: [],
            maxPlayerItems: 1,
            maxItems: 1,
            step: 1
        };
    },
    computed: {
        resolvedPlayers() {
            const cutPlayerIds = this.fight.fightCounter.thiefCuts.map(player => player.id);

            // Фильтруем players, удаляя тех, кто есть в cutPlayers
            var res = this.players.filter(player => !cutPlayerIds.includes(player.id));

            return res
        }
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
        togglePlayerSelection(player) {
            const index = this.selectedPlayers.indexOf(player);
            if (index > -1) {
                this.selectedPlayers.splice(index, 1);
            } else if (this.selectedPlayers.length < this.maxPlayerItems) {
                this.selectedPlayers.unshift(player); // Добавляем элемент в начало массива
            }
        },
        isPlayerSelected(player) {
            return this.selectedPlayers.includes(player);
        },
        clearSelection() {
            this.selectedCards = [];
            this.selectedPlayers = [];
            this.step = 1;
        },
        async doThiefCut() {
            const id = this.$route.params.id;
            var card1Id = this.selectedCards[0] ? this.selectedCards[0].id : "null";
            var playerId = this.selectedPlayers[0] ? this.selectedPlayers[0].id : "null";

            // Construct the endpoint URL with the card IDs
            var endpointUrl = `thief_cut/${id}?cardId=${card1Id}&playerId=${playerId}`;
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
.all-cards {
    max-height: 250px;
}

.cards {
    display: flex;
    flex-direction: column;
}



.card-data {
    width: 100%;
}

.selected-cards {
    min-height: 100px;
    padding: 1%;
}

.selected-player-cards {
    min-height: 100px;
    overflow-y: scroll;
}

.selected-player {
    /* height: 100px; */
    width: 100%;

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
<template>
    <div>
        <div v-if="gameContext">
            <div v-if="!gameContext.isGameStarted">
                <p><strong>Players:</strong></p>
                <v-row justify="center">
                    <v-col v-for="(player, index) in gameContext.players" :key="index" cols="12" md="4">
                        <p> {{ player.username }}</p>
                        <PlayerCard :player="player" :title="'Player ' + (index + 1)" />
                    </v-col>
                </v-row>
            </div>
            <div v-else>
                <div class="game-info mt-2">
                    <p> {{ gameContext.messages[gameContext.messages.length - 1] }}</p>
                </div>
                <v-row v-if="!getFight" justify="center">
                    <v-col v-for="(player, index) in gameContext.players" :key="index" cols="12" md="4">
                        <PlayerCard :player="player" :title="'Player ' + (index + 1)" />
                    </v-col>
                </v-row>
            </div>
            <div v-if="getFight">
                <div class="mt-3 fight-container">
                    <div class="power-container" v-if="getFight.playersPower">
                        <div> {{ getFight.playersPower }}</div>
                        <div>
                            <v-img class="icon-power" :src="'/src/assets/power.png'"></v-img>
                        </div>
                    </div>
                    <div class="d-flex flex-row fight-element w-100">
                        <div class="fight-players w-100">
                            <div class="fight-player">
                                <PlayerCard color="white" :player="getMove.player" :title="Player" />
                            </div>
                            <div class="fight-player" v-for="(order, index) in getTrustedOrders" :key="index">
                                <PlayerCard v-if="order.trust" color="white" :player="order.player" :title="Player" />
                            </div>
                        </div>
                        <div v-if="getFight.helpTreasureCards.length > 0" class="w-100">
                            <CardSlider :cards="getFight.helpTreasureCards">
                            </CardSlider>
                        </div>
                    </div>

                    <div class="text-center fight-element">
                        <hr>
                        <strong class="vs-text">VS</strong>
                        <hr>
                    </div>

                    <div class="fight-element fight-enemies mt-3">
                        <CardSlider v-if="getFight.enemyCards"
                            :cards="getFight.enemyCards.concat(getFight.harmTreasureCards).concat(getFight.doorCards)">
                        </CardSlider>
                    </div>
                    <div class="power-container power-end" v-if="getFight.enemiesPower">
                        <div>
                            <v-img class="icon-power" :src="'/src/assets/power.png'"></v-img>
                        </div>
                        <div> {{ getFight.enemiesPower }}</div>

                    </div>
                    <!-- <div>
                        <p>Obeservers</p>
                        <v-row justify="center">
                            <v-col v-for="fightAgree in getFight.fightAgrees" :key="fightAgree.player.id" cols="12"
                                md="4">
                                <PlayerCard :player="fightAgree.player" :title="Player"
                                    :color="fightAgree.agree ? 'blue' : 'red'">
                                </PlayerCard>
                            </v-col>
                        </v-row>
                    </div> -->
                    <br>
                </div>
            </div>

            <div>

            </div>


            <UserActions></UserActions>
            <div class="log">
                <p v-for="(message, index) in gameContext.messages" :key="index" cols="12" md="4">
                    {{ index + 1 }}: {{ message }}
                </p>
            </div>
            <pre class="formattedGameContext">{{ formattedGameContext }}</pre>
        </div>
        <div v-else>
            <p>Loading...</p>
        </div>
    </div>
</template>

<script>


import { Client } from '@stomp/stompjs';
import { getData } from '@/services/apiService'
import PlayerCard from './PlayerCard.vue';
import UserActions from './UserActions.vue';
import CardSlider from './CardSlider.vue';


export default {
    components: {
        PlayerCard,
        UserActions,
        CardSlider
    },
    data() {
        return {
            gameContext: null,
            stompClient: null,
            error: '',
            isFullScreen: false,
        };
    },
    computed: {
        getFight() {
            if (this.gameContext == null)
                return null;

            if (!this.gameContext.gameStarted)
                return null;

            var move = this.gameContext.moves[this.gameContext.moves.length - 1]
            if (move.fight == null)
                return null;

            return move.fight;
        },
        getTrustedOrders() {
            console.log("GET NOT TRUSTED", this.getFight);
            return this.getFight.fightOrders.filter(order => order.trust);
        },
        getMove() {
            if (this.gameContext == null)
                return null;

            if (!this.gameContext.gameStarted)
                return null;

            var move = this.gameContext.moves[this.gameContext.moves.length - 1]
            return move;
        },
        formattedGameContext() {
            // Преобразование JSON-объекта в строку с красивым форматированием
            return JSON.stringify(this.gameContext, null, 3);
        },
        observerPlayer() {
            return this.gameContext.players.filter(player => player.id !== this.getMove.player.id);
        },
        cardColor(booleanValue) {
            return booleanValue ? 'error' : 'success';
        },
        isFullScreen() {
            return !!(
                document.fullscreenElement ||
                document.webkitFullscreenElement ||
                document.mozFullScreenElement ||
                document.msFullscreenElement
            );
        }
    },
    methods: {
        async loadGameContext() {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData("get_context/" + id);

                if (response.status == 200) {
                    console.log("getcontext: ", response)
                    this.gameContext = response.data;// JSON.parse(response.data)
                    console.log(this.gameContext)
                } else {
                    this.error = error.response.data.message;
                }
            } catch (error) {
                console.error('Error fetching data:', error.response.data.message);
                this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        },
        checkFullScreen() {
            console.log(document.fullscreenElement);
            this.isFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);
        }
    },
    async mounted() {
        await this.loadGameContext();
        var stompClientGameContext;
        const gameContextId = this.$route.params.id;
        stompClientGameContext = new Client({
            brokerURL: 'ws://127.0.0.1:8080/game',
            onConnect: () => {
                stompClientGameContext.subscribe(`/topic/contexts/${gameContextId}`, message => {
                    try {
                        var messageBody = JSON.parse(message.body);
                        if (messageBody.id == gameContextId)
                            this.gameContext = messageBody
                        // console.log('Received: ' + message);
                    } catch (error) {
                        console.error('error: ' + message.body);
                    }
                });
                const id = this.$route.params.id;
                // stompClient.publish({ destination: `/game/${id}.munchkin.context`, body: id });
                console.log("connected /public/munchkin.context")
            }
        });
        stompClientGameContext.activate();

        const log = document.getElementById('log');

        function addLogEntry(entry) {
            const logEntry = document.createElement('div');
            logEntry.textContent = entry;
            log.appendChild(logEntry);
            log.scrollTop = log.scrollHeight;
        }

    },
    created() {
        document.addEventListener('fullscreenchange', this.checkFullScreen);
        document.addEventListener('webkitfullscreenchange', this.checkFullScreen);
        document.addEventListener('mozfullscreenchange', this.checkFullScreen);
        document.addEventListener('msfullscreenchange', this.checkFullScreen);
        this.checkFullScreen(); // Initial check
    },
    beforeDestroy() {
        document.removeEventListener('fullscreenchange', this.checkFullScreen);
        document.removeEventListener('webkitfullscreenchange', this.checkFullScreen);
        document.removeEventListener('mozfullscreenchange', this.checkFullScreen);
        document.removeEventListener('msfullscreenchange', this.checkFullScreen);
    },

};
</script>
<style scopped>
.formattedGameContext {

    max-width: 100wh;
    overflow: scroll;
}

.game-info {

    margin-left: 25%;
    margin-left: 25%;
    padding: 1%;
    border: 2px solid black;
    border-radius: 20px;
    width: 50%;
}

.log {
    border: 2px solid black;
    border-radius: 20px;
    max-height: 100px;
    overflow-y: scroll;
    padding: 1%;
    width: 100%;
    margin: 1%;
}

.fight-players {
    display: flex;
    justify-content: center;
    /* Центрируем по горизонтали */
    align-items: center;
    /* Центрируем по вертикали */
}

.fight-player {
    margin: 0 10px;
    /* Отступы между элементами */
}

.right {
    right: 0;

}

.power-container {
    display: flex;
    flex-direction: row;
    font-size: 1.1em;
    font-weight: 600;

}

.power-end {
    justify-content: flex-end;
}

.icon-power {
    width: 32px;
    height: 32px;
    margin-left: 5px;
    margin-right: 5px;
}

.fight-container {
    border: 3px solid black;
    border-radius: 15px;
    padding: 1%;
}

.vs-text {
    font-size: 1.2em;
    font-weight: 800;
}
</style>
<template>
    <!-- <v-btn color="success" class="" @click="start">Start</v-btn>
    <v-btn color="primary" class="ml-3" @click="connect">Connect</v-btn>
    <v-btn color="secondary" class="ml-3" @click="disconnect">Disconnect</v-btn> -->
    <v-alert v-if="error" class="mt-3" type="error">{{ error }}</v-alert>
    <div>
        <br>
        <hr>
        <div class="action_list">
            <div class="action">
                <CreateFightOrder v-if="findAction('create_fight_order')"></CreateFightOrder>
            </div>
            <div class="action">
                <FightOrders v-if="findAction('confirm_fight_order')"></FightOrders>
            </div>
            <div v-for="(action, index) in actions" :key="index">
                <v-btn class="action" :color="action.color" @click="doEndpoint(action.path)">
                    {{ action.name }}</v-btn>
            </div>
        </div>
        <CardSlider v-if="cards" :cards="cards">
        </CardSlider>


    </div>
</template>

<script>
import { Client } from '@stomp/stompjs';

import { getData } from '@/services/apiService'
import CardSlider from './CardSlider.vue';
import CreateFightOrder from './fight_orders/CreateFightOrder.vue';
import FightOrders from './fight_orders/FightOrders.vue';



export default {
    components: {
        CardSlider,
        CreateFightOrder,
        FightOrders
    },
    data() {
        return {
            cards: [],
            actions: null,
            error: ''
        };
    },
    computed: {

    },
    async mounted() {
        // GAME ACTIONS
        await this.loadActions();

        var stompClientActions;
        const gameContextId = this.$route.params.id;
        stompClientActions = new Client({
            brokerURL: 'ws://127.0.0.1:8080/game',
            onConnect: () => {
                stompClientActions.subscribe(`/topic/actions/${gameContextId}`, message => {
                    try {
                        this.loadActions();
                        return;
                        // TODO  maybe
                        console.log('Subscribe /topic/actions/', message.body);
                        var messageBody = JSON.parse(message.body);
                        this.actions = messageBody
                    } catch (error) {
                        console.error('error /topic/actions/: ' + message.body);
                    }
                });
                const id = this.$route.params.id;
                // stompClient.publish({ destination: '/public/munchkin.actions', body: id });
                console.log("connected to /public/munchkin.actions")
            }
        });
        stompClientActions.activate();



        // GAME CONTEXT

        await this.loadCards();
        var stompClientGameContext;
        stompClientGameContext = new Client({
            brokerURL: 'ws://127.0.0.1:8080/game',
            onConnect: () => {
                stompClientGameContext.subscribe(`/topic/cards/${gameContextId}`, message => {
                    try {
                        this.loadCards();
                        return;
                        // TODO  maybe
                        console.log('Subscribe /topic/cards/', message.body);
                        var messageBody = JSON.parse(message.body);
                        this.cards = messageBody.cards;
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
    },
    methods: {
        async doEndpoint(endpoint) {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData(endpoint);
                if (response.status == 200) {
                    console.log(response.data)
                } else {
                    this.error = error.response.data;
                }
            } catch (error) {
                console.error('Error fetching data:', error.response.data);
                this.error = error.response.data; //'Произошла ошибка при получении данных';
            }
        },
        findAction(actionPath) {
            if (this.actions == null)
                return false

            for (let i = 0; i < this.actions.length; i++) {
                if (this.actions[i].path.includes(actionPath)) {

                    // this.actions.splice(i, 1);
                    // console.log("action", this.actions)
                    return true;
                    break; // Нашли элемент, выходим из цикла
                }
            }
            return false;
        },
        async loadActions() {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData("get_actions/" + id);
                if (response.status == 200) {
                    console.log("get_actions", response)
                    this.actions = response.data.actions;  //JSON.parse(response.data.actions)
                } else {
                    this.error = error.response.data;
                }
            } catch (error) {
                console.error(error)
                console.error('Error fetching data:', error.response.data);
                this.error = error.response.data; //'Произошла ошибка при получении данных';
            }
        },
        async loadCards() {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData("get_cards/" + id);

                if (response.status == 200) {
                    // this.cards = response.data.message;
                    console.log(response.data.cards)
                    var data = response.data.cards; //JSON.parse(response.data)
                    this.cards = data

                } else {
                    this.error = error.response.data;
                }
            } catch (error) {
                // console.error('Error fetching data:', error.response.data.message);
                // this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        }
    }
}
</script>

<style scoped>
.action_list {
    display: flex;
    flex-direction: column;
    width: 100%;


    justify-content: space-around;
    background-color: aquamarine;
}

.action {
    /* width: 200px; */

    margin: 10px;
}
</style>
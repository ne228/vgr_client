<template>

    <v-alert v-if="error" class="mt-3" type="error">{{ error }}</v-alert>
    <div>
        <br>
        <hr>
        <div class="action_list">
            <div class="action" v-if="findAction('create_fight_order')">
                <CreateFightOrder></CreateFightOrder>
            </div>
            <div class="action" v-if="findAction('confirm_fight_order')">
                <FightOrders></FightOrders>
            </div>

            <div class="action" v-if="findAction('halfing_sell')">
                <HalfingSellDialog :cards="get_items_cards"></HalfingSellDialog>
            </div>
            <div class="action" v-if="findAction('halfing_roll')">
                <HalfingRollDialog :cards="cards"></HalfingRollDialog>
            </div>

            <div class="action" v-if="findAction('cleric_exile')">
                <ClericExileDialog :cards="cards"></ClericExileDialog>
            </div>

            <div class="action" v-if="findAction('wizard_fly')">
                <WizardFlyDialog :cards="cards"></WizardFlyDialog>
            </div>

            <div class="action" v-if="findAction('warrior_rampage')">
                <WarriorRampageDialog :cards="cards"></WarriorRampageDialog>
            </div>

            <div class="action" v-if="findAction('wizard_pacification')">
                <WizardPacificationDialog :cards="getFight.enemyCards">
                </WizardPacificationDialog>
            </div>

            <div class="action" v-if="findAction('thief_cut')">
                <ThiefCutDialog :fight="getFight" :cards="cards" :players="getFight.fightPlayers">
                </ThiefCutDialog>
            </div>

            <div class="action" v-if="findAction('thief_steal')">
                <ThiefStealDialog :context="context">
                </ThiefStealDialog>
            </div>

            <div v-for="(action, index) in get_actions" :key="index">
                <v-btn class="action" :color="action.color" @click="doEndpoint(action.path)">
                    {{ action.name }}
                </v-btn>
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

import ClericExileDialog from './race_class_actions/ClericExileDialog.vue';
import HalfingSellDialog from './race_class_actions/HalfingSellDialog.vue';
import HalfingRollDialog from './race_class_actions/HalfingRollDialog.vue';
import WizardFlyDialog from './race_class_actions/WizardFlyDialog.vue';
import WizardPacificationDialog from './race_class_actions/WizardPacificationDialog.vue';
import WarriorRampageDialog from './race_class_actions/WarriorRampageDialog.vue';
import ThiefCutDialog from './race_class_actions/ThiefCutDialog.vue';
import ThiefStealDialog from './race_class_actions/ThiefStealDialog.vue';

export default {
    components: {
        CardSlider,
        CreateFightOrder,
        FightOrders,
        ClericExileDialog,
        HalfingSellDialog,
        HalfingRollDialog,
        WizardFlyDialog,
        WizardPacificationDialog,
        WarriorRampageDialog,
        ThiefCutDialog,
        ThiefStealDialog
    },
    props: {
        context: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            cards: [],
            actions: [],
            error: '',
            finded_actions: []
        };
    },
    computed: {
        getFight() {
            if (this.context == null)
                return null;

            if (!this.context.gameStarted)
                return null;

            var move = this.context.moves[this.context.moves.length - 1]
            if (move.fight == null)
                return null;

            return move.fight;
        },
        get_items_cards() {
            var res = []
            this.cards.forEach(element => {
                if (element.cost != null)
                    if (element.cost > 0) {
                        res.push(element);
                    }

            });
            return res;
        },
        get_actions() {
            let result_actions = this.actions.filter(action => !this.finded_actions.includes(action));
            return result_actions;
        }
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
                    this.finded_actions.push(this.actions[i])
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
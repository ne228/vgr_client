<template>
    <div class="d-flex justify-space-around">
        <v-menu>
            <template v-slot:activator="{ props }">
                <v-btn color="primary" v-bind="props" @click="getFightOrders()">
                    Confirm Fight Orders
                </v-btn>
            </template>
            <v-list>

                <v-list-item v-for="(fightOrder, index) in getNotTrustedOrders" :key="index" :value="index">
                    <FightOrder :orderData="fightOrder" @updateEvent="getFightOrders">
                    </FightOrder>
                </v-list-item>
            </v-list>
        </v-menu>
    </div>
</template>

<script>
import { getData } from '@/services/apiService';
import FightOrder from './FightOrder.vue';

export default {
    data() {
        return {
            fightOrders: []
        };
    },
    computed: {
        getNotTrustedOrders() {
            return this.fightOrders.filter(order => !order.trust);
        }

    },
    components: {
        FightOrder
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
        async getFightOrders() {
            this.error = ''
            const id = this.$route.params.id;
            try {
                const response = await getData(`get_fight_orders/${id}`);

                if (response.status == 200) {
                    console.log("get ", response)
                    var data = response.data.fightOrders;
                    this.fightOrders = data;
                    console.log(this.fightOrders)
                } else {
                    this.error = error.response.data.message;
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        },
    },
    async mounted() {
        await this.getFightOrders();
    }
}

</script>

<style scoped>
.actions {
    /* min-width: 300px; */


}

.card {
    min-width: 280px;
    min-height: 400px;

}

.enemy-card {
    display: flex;
    flex-direction: column;
    justify-items: baseline;
    justify-content: space-between;
    /* border: 2px solid red; */
    height: 100%;

}

.enemy-card-item {
    /* border: 1px black solid; */
}

.align-bottom {

    /* width: 100%;
    background-color: aqua;
    justify-self: end;
    align-self: flex-end; */
}

.text-left {
    align-self: flex-start;
    left: 0;
}

.action {
    margin: 1%;
}
</style>
<template>
    <v-btn class="text-center">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account"
                    v-bind:text='orderData.player.user.username + " - " + orderData.treasureCount + " trasures"'
                    variant="tonal" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Fight Order">
                <v-card-text>
                    <span>This player will help you for <strong>{{ orderData.treasureCount }} </strong> treasures</span>
                </v-card-text>
                <v-card-text>

                    <div>
                        <PlayerCard :player="orderData.player"></PlayerCard>
                    </div>

                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>
                    <v-btn color="red" text="Delete" variant="tonal" @click="confirm(false)"></v-btn>
                    <v-btn color="primary" text="Confirm" variant="tonal" @click="confirm(true)"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script>
import { getData } from '@/services/apiService';
import PlayerCard from '../PlayerCard.vue';

export default {
    props: {
        orderData: {
            required: true,
            type: Object
        }
    },
    components: {
        PlayerCard
    },
    data() {
        return {
            errorMessage: '',
            dialog: false
        };
    },
    methods: {
        async confirm(trust) {
            const id = this.$route.params.id;
            await this.getEndpoint(`confirm_fight_order/${id}?orderId=${this.orderData.id}&confirm=${trust}`)
            this.dialog = false;
            this.$emit("updateEvent");
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
                console.error('Error fetching data:', error.response.data.message);
                this.error = error.response.data.message; //'Произошла ошибка при получении данных';
            }
        },

    }
}

</script>

<style scoped></style>
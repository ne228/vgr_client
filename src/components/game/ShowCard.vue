<template>
    <v-btn class="text-center">
        <v-dialog v-model="dialog" max-width="600">
            <template v-slot:activator="{ props: activatorProps }">
                <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Create Fight Order"
                    variant="tonal" v-bind="activatorProps"></v-btn>
            </template>

            <v-card prepend-icon="mdi-account" title="Create Fight Order">
                <v-card-text>
                    <span>Choose the amount of treasure you want to get for helping in battle</span>
                </v-card-text>
                <v-card-text>
                    <v-row dense>
                        <v-col>
                            <v-text-field v-model="inputValue" type="number" @input="checkInput"
                                :error-messages="errorMessage" :rules="[positiveNumberRule]" label="Amount of treasure*"
                                required></v-text-field>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider></v-divider>

                <v-card-actions>
                    <v-spacer></v-spacer>

                    <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

                    <v-btn color="primary" text="Send" variant="tonal" @click="createFightOrder()"></v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-btn>
</template>

<script>
import { getData } from '@/services/apiService';

export default {
    data() {
        return {
            inputValue: null,
            errorMessage: '',
            dialog: false
        };
    },
    computed: {
        positiveNumberRule() {
            return value => !!value || 'The value must be greater than 0';
        }
    },
    methods: {
        async createFightOrder() {
            const id = this.$route.params.id;
            await this.getEndpoint(`create_fight_order/${id}?treasureCount=${this.inputValue}`)
            this.dialog = false;
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
        checkInput() {
            if (this.inputValue !== null && this.inputValue <= 0) {
                this.errorMessage = 'The value must be greater than 0';
            } else {
                this.errorMessage = '';
            }
        }
    }
}

</script>

<style scoped></style>
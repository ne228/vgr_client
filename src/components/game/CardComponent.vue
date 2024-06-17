<template>
    <v-card :color="isSelected ? 'grey-lighten-1' : 'grey-lighten-3'" class="card" @click="getActions()" v-bind="props">
        <img class="card-image mx-auto" :src="getImageUrl()"></img>

        <v-menu activator="parent">
            <div v-if="cardActions">
                <div class="actions">
                    <p class="text-center">потом удалю {{ cardData.title }}</p>
                </div>
                <v-list class="actions" v-if="cardActions.length > 0">
                    <v-list-item v-if="cardActions" v-for="(item, i) in cardActions" :key="i">
                        <v-list-item-title class="action">
                            <v-btn class="w-100" color="#e5e5e5" @click="getEndpoint(item.path)">
                                {{ item.text }}
                            </v-btn>
                        </v-list-item-title>
                    </v-list-item>
                </v-list>
            </div>
        </v-menu>
    </v-card>




</template>


<script>
import { getData, getUrl } from '@/services/apiService';

export default {
    props: {
        cardData: Object,
        isSelected: {
            type: Boolean,
            default: false
        },
        toggle: Function,
        imageBlob: null,
        imageBlobUrl: ''
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
            this.toggle();
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
        getImageUrl() {
            try {
                const id = this.$route.params.id;
                let url = getUrl() + (`/${id}/image/${this.cardData.id}/`);

                return url;
            } catch (exc) {
                return "null"
            }

        }
    },
    async mounted() {
        // console.log("getUrl", getUrl())
        // await this.fetchImage();
    },
    beforeDestroy() {
        // Ревокнуть URL.createObjectURL, когда компонент уничтожается
        URL.revokeObjectURL(this.imageBlobUrl);
    }
}

</script>

<style scoped>
.card {
    transition: all 2s ease-in-out;
    border-radius: 20px;
    border: 4px solid black;
    margin-right: 15px;
    width: auto;
    height: 300px;
    width: 200px;
}




.text-left {
    align-self: flex-start;
    left: 0;
}

.actions {
    border-radius: 10px;
    border: 3px solid black;
    background-color: #4c1a11;
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

.font-size-8 {
    font-size: 0.8em;
}

.card-image {
    width: 100%;
    /* Растянуть изображение по ширине контейнера */
    height: auto;
    /* Поддержание соотношения сторон */
    position: absolute;
    /* Позиционирование абсолютно внутри контейнера */
    top: 0;
    /* Положение изображения сверху */
    left: 0;
    /* Положение изображения слева */
}

.delete {
    min-height: 100px;
    background-color: #595bc9;
    font-size: 1em;
}
</style>
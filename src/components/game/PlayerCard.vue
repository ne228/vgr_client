<template>
    <v-card :color="color" class="mb-5 card">

        <v-card-title class="custom-title">
            <v-card-actions class="card-action">
                <div>
                    <span>{{ title }}</span>
                </div>
                <div class="show-btn">
                    <v-btn :icon="show ? 'mdi-chevron-up' : 'mdi-chevron-down'" @click="show = !show"></v-btn>
                </div>
            </v-card-actions>
        </v-card-title>
        <v-card-text class="ml-5">
            <v-avatar>
                <v-img v-if="player.gender == 'MAN'" class="icon" :src="'/src/assets/man.png'"></v-img>
                <v-img v-if="player.gender == 'WOMAN'" class="icon" :src="'/src/assets/woman.png'"></v-img>
            </v-avatar>

            <span class="ml-2">{{ player.user.username }}</span>
            <span class="ml-2">{{ player.gold }} gold</span>

        </v-card-text>

        <v-expand-transition>
            <div v-show="show">
                <v-divider></v-divider>
                <v-card-text>
                    <!-- <v-card class="mx-auto" max-width="300"> -->
                    <v-list density="compact">
                        <v-list-subheader class="text-center">Информация:</v-list-subheader>

                        <v-list-item color="primary">
                            <template v-slot:prepend>
                                <v-img class="icon" :src="'/src/assets/level-up.png'"></v-img>
                            </template>

                            <v-list-item-title class="ml-3">{{ player.lvl }} уровень</v-list-item-title>
                        </v-list-item>

                        <div class="mt-2" v-if="player.gold > 0">
                            <v-list-subheader class="text-center">Золото:</v-list-subheader>
                            <v-list-item color="primary">
                                <template v-slot:prepend>
                                    <v-img class="icon" :src="'/src/assets/gold.png'"></v-img>
                                </template>

                                <v-list-item-title class="ml-3"> {{ player.gold }} </v-list-item-title>
                            </v-list-item>
                        </div>


                        <v-list-subheader v-if="player.classes.length > 0" class="text-center">Класс:</v-list-subheader>

                        <div class="mt-2" v-if="player.superMunchkinCard">
                            <v-list-item>
                                <CardSmallComponent :cardData="player.superMunchkinCard"></CardSmallComponent>
                            </v-list-item>
                        </div>
                        <div class="mt-2" v-for="_class in player.classes">
                            <v-list-item>
                                <CardSmallComponent :cardData="_class"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <v-list-subheader v-if="player.races.length > 0" class="text-center">Класс:</v-list-subheader>
                        <div class="mt-2" v-if="player.halfBloodCard">
                            <v-list-item>
                                <CardSmallComponent :cardData="player.halfBloodCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-for="race in player.races">
                            <v-list-item>
                                <CardSmallComponent :cardData="race"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-if="player.armorItemCard">
                            <v-list-subheader class="text-center">Броник:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="player.armorItemCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-if="player.legsItemCard">
                            <v-list-subheader class="text-center">Обувка:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="player.legsItemCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-if="player.headItemCard">
                            <v-list-subheader class="text-center">Головняк:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="player.headItemCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-if="player.weaponItemCard_1">
                            <v-list-subheader class="text-center">Левая рука:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="player.weaponItemCard_1"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-if="player.weaponItemCard_2">
                            <v-list-subheader class="text-center">Правая рука:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="player.weaponItemCard_2"></CardSmallComponent>
                            </v-list-item>
                        </div>
                        <div class="mt-2" v-for="bonusItemCard in player.bonusItemCards">
                            <v-list-subheader class="text-center">Бонусная карта:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="bonusItemCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                        <div class="mt-2" v-for="curseCard in player.curses">
                            <v-list-subheader class="text-center">Проклятия:</v-list-subheader>
                            <v-list-item>
                                <CardSmallComponent :cardData="curseCard"></CardSmallComponent>
                            </v-list-item>
                        </div>

                    </v-list>

                </v-card-text>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
import CardSmallComponent from './CardSmallComponent.vue';
export default {
    props: {
        title: {
            type: String,
            default: "Игрок"
        },
        player: {
            type: Object,
            required: true
        },
        color: {
            type: String,
            required: false,
            default: "dark"
        }
    },
    components: {
        CardSmallComponent
    },
    data() {
        return {
            playerIconUrl: 'https://www.imagensempng.com.br/wp-content/uploads/2021/08/Icone-usuario-Png.png', // Заглушка для иконки игрока, замените на ваш URL
            show: false,
        };
    }
};
</script>

<style scoped>
.card {
    border: solid 3px black;
    border-radius: 15px;
}

.custom-title {
    display: flex;
    font-size: large;
}

.card-action {
    display: flex;
    /* flex-direction: column; */
    justify-content: space-between;
    width: 100%;

}



.icon {
    width: 32px;
    height: 32px;
}
</style>
<template>
    <div class="slider-div">
        <v-sheet class="mx-auto mb-5" elevation="0">
            <v-slide-group v-model="model" class="slider card_list" show-arrows>
                <transition-group name="slide">
                    <v-slide-group-item class="card" v-for="(card, index) in cards" :key="index"
                        v-slot="{ isSelected, toggle }">
                        <CardComponent class="pa-5" :cardData="card" :isSelected="isSelected" :toggle="toggle">
                        </CardComponent>
                    </v-slide-group-item>
                </transition-group>
            </v-slide-group>
        </v-sheet>
    </div>

</template>
<script>
import CardComponent from './CardComponent.vue';

export default {
    props: {
        cards: Array,
    },
    components: {
        CardComponent
    },
    data: () => ({
        // model: null, 
        cards_dsiplay: [],
    }),
    methods: {
        set_cards_display() {
            let updatedDisplayCards = this.cards_dsiplay;
            // Удаляем карты из cards_on_display, которых нет в массиве cards
            for (let i = updatedDisplayCards.length - 1; i >= 0; i--) {
                if (!this.cards.includes(updatedDisplayCards[i])) {
                    updatedDisplayCards.splice(i, 1);
                }
            }

            // Добавляем в cards_on_display карты из массива cards, которых еще нет в массиве cards_on_display
            for (let i = 0; i < this.cards.length; i++) {
                if (!updatedDisplayCards.includes(this.cards[i])) {
                    updatedDisplayCards.push(this.cards[i]);
                }
            }
            console.log("computed", this.cards_dsiplay)

        }
    },
    beforeUpdate() {
        console.log("updated")
        this.set_cards_display()
    }

}
</script>

<style scopped>
.card {
    margin: 0 10px;
}
</style>
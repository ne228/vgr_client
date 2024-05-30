<template>
    <div>
        <p>Id: {{ gameContext.id }}</p>
        <p>Date: {{ gameContext.date }}</p>
        <v-btn @click="createGameContext">
            <RouterLink :to="'/games/' + gameContext.id">Play</RouterLink>
        </v-btn>
        <p>Link for friends</p>
        <a :href="'connect/' + gameContext.id">Ссылка для друга</a>
        <hr>
    </div>
</template>

<script>
export default {
    name: 'GameContextLink',
    props: {
        gameContext: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
/* Здесь можно добавить стили, если необходимо */
</style>
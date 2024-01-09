<script setup lang="ts">
import { type Receipt } from '~/components/receipt.vue';


const route = useRoute()
const id = route.params.id as string
const masks = false

const response = await $fetch(`/api/sample/${id}`)
const { date: rawDate, ...rest } = response.sample.receipt
const receipt: Receipt = { ...rest, date: new Date(rawDate) } as Receipt
</script>

<template>
    <main class="w-full p-10 flex flex-col items-center" :class="{ masks }">
        <Receipt :receipt="receipt" />
    </main>
</template>

<style>
#nuxt-devtools-container {
    visibility: hidden;
}
</style>
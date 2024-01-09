<script setup lang="ts">
import { type Receipt } from '~/components/receipt.vue';

const screenshot = ref()
async function hit() {
    const res = await fetch("/api/screenshot")
    const resJSON: { image: string } = await res.json()
    screenshot.value = `data:image/png;base64,${resJSON.image}`
}

const masks = ref(false)
const receipt = reactive<Receipt>({
    layout: "lidl",
    items: [
        { name: "Bananen 1a Madeira", price: 2.12, taxClass: "A", detail: "2kg" },
        { name: "Paprika 1a", price: 3.84, taxClass: "A" },
        { name: "Nutella", price: 3.99, taxClass: "A" },
        { name: "Honig Blüte", price: 6.67, taxClass: "A" },
        { name: "Jägermeister XL", price: 12.56, taxClass: "B" },
    ],
    address: "Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen",
    detail1: "UST-ID-NR: DE8141100850\n* * * *\nVIELEN DANK FÜR IHREN EINKAUF!\nLIDL LOHNT SICH.\n* * * *\n+ Ausbildung oder Duales Studium? +\nLidl bietet beides!\nVertrieb, Logistik oder Büro.\nBewerben Sie sich jetzt für den\nAusbildungs-/ Studienbeginn 2015\n+ + + www.karriere-bei-lidl.de + + +",
    date: new Date(2720987),
    background: "rgb(229, 235, 245)",
    itemsLayout: "lidl",
    font: "Inconsolata",
    card: false,
    px: "1rem",
    py: "1rem"
})

</script>

<template>
    <main class="p-10 flex gap-x-8 items-start" :class="{ masks }">
        <div class="grid grid-cols-1 gap-4 content-start">
            <Switch label="Masks" v-model="masks" />
            <Select label="Layout" v-model="receipt.layout" :options="['lidl']" />
            <Select label="ItemsLayout" v-model="receipt.itemsLayout" :options="['lidl', 'real']" />
            <ItemEditor v-model="receipt.items" />
            <ClientOnly>
                <ColorPicker v-model="receipt.background" label="Background" />
                <DatePicker label="Date" v-model="receipt.date" />
            </ClientOnly>
            <TextArea v-model="receipt.address" label="Address" />
            <TextArea v-model="receipt.detail1" label="Detail 1" />
            <Select label="Font" v-model="receipt.font" :options="['Inconsolata', 'DejavuSansMono']" />
            <Switch label="Card" v-model="receipt.card" />
        </div>
        <Receipt :receipt="receipt" />
    </main>
</template>

<style>
#nuxt-devtools-container {
    visibility: hidden;
}
</style>
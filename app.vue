<script setup lang="ts">
import type { ReceiptItem } from './components/ReceiptItems.vue';

const screenshot = ref()
async function hit() {
  const res = await fetch("/api/screenshot")
  const resJSON: { image: string } = await res.json()
  screenshot.value = `data:image/png;base64,${resJSON.image}`
}

const address = ref("Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen")
const date = ref<Date>(new Date("2023"))
const masks = ref(false)
const color = ref("rgb(249, 255, 255)")
const items = ref<ReceiptItem[]>([
  { name: "Bananen 1a Madeira", price: 2.12, taxClass: "A", detail: "2kg" },
  { name: "Paprika 1a", price: 3.84, taxClass: "A" },
  { name: "Nutella", price: 3.99, taxClass: "A" },
  { name: "Honig Blüte", price: 6.67, taxClass: "A" },
  { name: "Jägermeister XL", price: 12.56, taxClass: "B" },
])
const detail1 = ref("UST-ID-NR: DE8141100850\n* * * *\nVIELEN DANK FÜR IHREN EINKAUF!\nLIDL LOHNT SICH.\n* * * *\n+ Ausbildung oder Duales Studium? +\nLidl bietet beides!\nVertrieb, Logistik oder Büro.\nBewerben Sie sich jetzt für den\nAusbildungs-/ Studienbeginn 2015\n+ + + www.karriere-bei-lidl.de + + +")
</script>

<template>
  <main class="p-10 bg-slate-100 flex gap-x-8" :class="{ masks }">
    <div class="grid grid-cols-1 gap-4 content-start">
      <Switch label="Masks" v-model="masks" />
      <ItemEditor v-model="items" />
      <ClientOnly>
        <ColorPicker v-model="color" label="Background" />
      </ClientOnly>
      <TextArea v-model="address" label="Address" />
      <TextArea v-model="detail1" label="Detail 1" />
      <DatePicker label="Date" v-model="date" />
    </div>
    <Receipt :background="color" :address="address" :items="items" :date="date" :detail1="detail1" />
  </main>
</template>

<style>
#nuxt-devtools-container {
  visibility: hidden;
}

.masks #receipt {
  color: white;
}
</style>
<script setup lang="ts">
import type { ReceiptItem } from './ReceiptItems.vue';

function hashCode(str: string) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}


interface Props {
    items: ReceiptItem[]
    layout?: "lidl",
    background?: string,
    width?: string,
    address?: string,
    py?: string,
    px?: string,
    barcodeHeight?: string,
    date?: Date,
    detail1?: string,
}
const { items } = withDefaults(defineProps<Props>(), {
    layout: "lidl",
    background: "white",
    width: "400px",
    address: "Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen",
    py: "1rem",
    px: "10px",
    barcodeHeight: "100rem",
    date: () => new Date(),
    detail1: "\nUST-ID-NR: DE8141100850\n* * * *\nVIELEN DANK FÜR IHREN EINKAUF!\nLIDL LOHNT SICH.\n* * * *\n+ Ausbildung oder Duales Studium? +\nLidl bietet beides!\nVertrieb, Logistik oder Büro.\nBewerben Sie sich jetzt für den\nAusbildungs-/ Studienbeginn 2015\n+ + + www.karriere-bei-lidl.de + + +"
})
const barcodeValue = computed(() => {
    const names = items.map(i => i.name).reduce((a, b) => a + b, "")
    return Math.max(hashCode(names), -hashCode(names)).toString()
})
</script>

<template>
    <div id="receipt" class="flex flex-col items-center leading-4"
        :style="{ 'background-color': background, 'width': width, 'font-family': 'Inconsolata', 'padding': `${py} ${px}` }">
        <template v-if="layout == 'lidl'">
            <img class="logo w-20" src="/assets/lidl-logo.png" alt="lidl-logo">
            <div class="address whitespace-pre text-center">
                {{ address }}
            </div>
            <ReceiptItems :items="items" layout="lidl" />
            <div class="mt-6">
                <Barcode :value="barcodeValue" :height="barcodeHeight" />
            </div>
            <div class="w-full flex justify-between">
                <div>5571</div>
                <div>140377/03</div>
                <div>{{ date.toLocaleDateString("de-DE") }}</div>
                <div>{{ date.toLocaleTimeString("de-DE") }}</div>
            </div>
            <div class="mt-4 text-center whitespace-pre">
                {{ detail1 }}
            </div>
        </template>
    </div>
</template>

<style>
.masks .logo {
    opacity: 0;
}
</style>
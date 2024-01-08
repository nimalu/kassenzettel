<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import type { ReceiptItem, Props as ReceiptItemsProps } from './ReceiptItems.vue';

function hashCode(str: string) {
    let hash = 0;
    for (let i = 0, len = str.length; i < len; i++) {
        let chr = str.charCodeAt(i);
        hash = (hash << 5) - hash + chr;
        hash |= 0;
    }
    return hash;
}


export interface Props {
    items: ReceiptItem[]
    layout?: "lidl",
    itemsLayout?: ReceiptItemsProps["layout"],
    background?: string,
    width?: string,
    address?: string,
    py?: string,
    px?: string,
    barcodeHeight?: string,
    date?: Date,
    detail1?: string,
    font?: string,
    barcode?: boolean,
    qrcode?: boolean,
}
const { items } = withDefaults(defineProps<Props>(), {
    layout: "lidl",
    itemsLayout: "lidl",
    background: "white",
    width: "400px",
    address: "Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen",
    py: "1rem",
    px: "10px",
    barcodeHeight: "100rem",
    date: () => new Date(),
    detail1: "\nUST-ID-NR: DE8141100850\n* * * *\nVIELEN DANK FÜR IHREN EINKAUF!\nLIDL LOHNT SICH.\n* * * *\n+ Ausbildung oder Duales Studium? +\nLidl bietet beides!\nVertrieb, Logistik oder Büro.\nBewerben Sie sich jetzt für den\nAusbildungs-/ Studienbeginn 2015\n+ + + www.karriere-bei-lidl.de + + +",
    font: "Inconsolata"
})
const barcodeValue = computed(() => {
    const names = items.map(i => i.name).reduce((a, b) => a + b, "")
    return Math.max(hashCode(names), -hashCode(names)).toString()
})
</script>

<template>
    <div id="receipt" class="flex flex-col items-center leading-4"
        :style="{ 'background-color': background, 'width': width, 'font-family': font, 'padding': `${py} ${px}` }">
        <template v-if="layout == 'lidl'">
            <img class="logo w-20" src="/assets/lidl-logo.png" alt="lidl-logo">
            <div class="address whitespace-pre text-center">
                {{ address }}
            </div>
            <ReceiptItems :items="items" :layout="itemsLayout" />
            <div class="mt-6 flex flex-col items-center">
                <Barcode v-if="barcode" :value="barcodeValue" :height="barcodeHeight" />
                <qrcode-vue v-if="qrcode" :value="barcodeValue + 'aö42q8780cjlöö344jkl238907897cxv9nklj23q4öjklxcv8q3ß9ß5390ß89cjvadsjcyvjüwerou8923#k'"
                    background="transparent" :size="200" />
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
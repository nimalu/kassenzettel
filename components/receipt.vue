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


export interface Receipt {
    items: ReceiptItem[]
    layout: "lidl",
    itemsLayout: ReceiptItemsProps["layout"],
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
    card?: boolean,
}
const { receipt } = defineProps<{ receipt: Receipt }>()
const barcodeValue = computed(() => {
    const names = receipt.items.map(i => i.name).reduce((a, b) => a + b, "")
    return Math.max(hashCode(names), -hashCode(names)).toString()
})
</script>

<template>
    <div id="receipt" class="flex flex-col items-center leading-4"
        :style="{ 'background-color': receipt.background, 'width': receipt.width, 'font-family': receipt.font, 'padding': `${receipt.py} ${receipt.px}` }">
        <template v-if="receipt.layout == 'lidl'">
            <img class="logo w-20" src="/assets/lidl-logo.png" alt="lidl-logo">
            <div class="address whitespace-pre text-center">
                {{ receipt.address }}
            </div>
            <ReceiptItems :items="receipt.items" :layout="receipt.itemsLayout" :card="receipt.card" />
            <div class="mt-6 flex flex-col items-center">
                <Barcode v-if="receipt.barcode" :value="barcodeValue" :height="receipt.barcodeHeight" />
                <qrcode-vue v-if="receipt.qrcode"
                    :value="barcodeValue + 'aö42q8780cjlöö344jkl238907897cxv9nklj23q4öjklxcv8q3ß9ß5390ß89cjvadsjcyvjüwerou8923#k'"
                    background="transparent" :size="200" />
            </div>
            <div class="w-full flex justify-between">
                <div>5571</div>
                <div>140377/03</div>
                <div>{{ receipt.date?.toLocaleDateString("de-DE") }}</div>
                <div>{{ receipt.date?.toLocaleTimeString("de-DE") }}</div>
            </div>
            <div class="mt-4 text-center whitespace-pre">
                {{ receipt.detail1 }}
            </div>
        </template>
    </div>
</template>

<style>
.masks .logo {
    opacity: 0;
}
.masks #receipt {
  color: transparent;
}
</style>
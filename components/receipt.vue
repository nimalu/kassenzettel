<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'
import type { ReceiptItem, Props as ReceiptItemsProps } from './ReceiptItems.vue';

export interface Layout {
    background?: string,
    py?: string,
    px?: string,
    barcodeHeight?: string,
    font?: string,
    barcode?: boolean,
    qrcode?: boolean,
    itemsLayout?: ReceiptItemsProps["layout"]
}
export interface Receipt {
    items: ReceiptItem[]
    layoutBase: "lidl",
    layout: Layout,
    address?: string,
    date?: Date,
    detail1?: string,
    card?: boolean,
}

const { receipt } = defineProps<{ receipt: Receipt }>()
const layout = computed(() => receipt.layout)
const barcodeValue = computed(() => {
    const names = receipt.items.map(i => i.name).reduce((a, b) => a + b, "")
    return hashCode(names)
})
const receiptStyle = computed(() => {
    const l = layout.value
    const s = {
        'background-color': getOrDefault(l, "background", 'rgb(235, 245, 245)'),
        'width': '400px',
        'font-family': getOrDefault(l, "font", "Inconsalata"),
        'padding': `${getOrDefault(l, "py", "1rem")} ${getOrDefault(l, "px", "1rem")}`
    }
    return s
})
</script>

<template>
    <div id="receipt" class="flex flex-col items-center leading-4" :style="receiptStyle">
        <template v-if="receipt.layoutBase == 'lidl'">
            <img class="logo w-20" src="/assets/lidl-logo.png" alt="lidl-logo">
            <div class="address whitespace-pre text-center">
                {{ receipt.address }}
            </div>
            <ReceiptItems :items="receipt.items" :layout="layout.itemsLayout" :card="receipt.card" />
            <div class="mt-6 flex flex-col items-center">
                <Barcode v-if="layout.barcode" :value="barcodeValue" :height="layout.barcodeHeight" />
                <qrcode-vue v-if="layout.qrcode" class="qrcode"
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
.masks .logo,
.masks .qrcode {
    opacity: 0;
}

.masks #receipt {
    color: transparent;
    background-color: black !important;
}
</style>
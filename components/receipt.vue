<script setup lang="ts">
import type { ReceiptItem } from './ReceiptItems.vue';

interface Props {
    layout: "lidl",
    background: string,
    width: string,
    address: string,
    py: string,
    px: string,
    barcodeHeight: string,
    items: ReceiptItem[]
}
withDefaults(defineProps<Props>(), {
    layout: "lidl",
    background: "white",
    width: "400px",
    address: "Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen",
    py: "1rem",
    px: "10px",
    barcodeHeight: "100rem",
    items: () => [
        { name: "Salami la Paprika", price: 0.99, taxClass: "A" },
        { name: "Trauben hell kg", price: 2.02, taxClass: "A", detail: "0,912 kg x 2,22   EUR/kg" },
        { name: "Dosenbier", price: 0.99, taxClass: "B" },
    ] 
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
                <Barcode :value="barcodeHeight" :height="barcodeHeight" />
            </div>
            <div class="w-full flex justify-between">
                <div>5571</div>
                <div>140377/03</div>
                <div>30.12.14</div>
                <div>13:22</div>
            </div>
            <div class="mt-4 flex flex-col items-center">
                <div>UST-ID-NR: DE8141100850</div>
                <div>* * * *</div>
                <div>VIELEN DANK FÜR IHREN EINKAUF!</div>
                <div>LIDL LOHNT SICH.</div>
                <div>* * * *</div>
                <div>+ Ausbildung oder Duales Studium? +</div>
                <div>Lidl bietet beides!</div>
                <div>Vertrieb, Logistik oder Büro.</div>
                <div>Bewerben Sie sich jetzt für den</div>
                <div>Ausbildungs-/ Studienbeginn 2015</div>
                <div>+ + + www.karriere-bei-lidl.de + + +</div>
            </div>
        </template>
    </div>
</template>

<style>
.masks .logo {
    opacity: 0;
}
</style>
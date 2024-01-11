<script setup lang="ts">
import QrcodeVue from 'qrcode.vue'

export interface Layout {
    background?: string,
    py?: string,
    px?: string,
    barcodeHeight?: string,
    font?: string,
    barcode?: boolean,
    qrcode?: boolean,
}
export type ReceiptItem = {
    name: string,
    price: number,
    taxClass?: string,
    detail?: string
}
export interface Receipt {
    items?: ReceiptItem[]
    layoutBase?: "lidl" | "real",
    layout?: Layout,
    address?: string,
    date?: Date,
    detail1?: string,
    card?: boolean,
}

const { receipt } = defineProps<{ receipt: Receipt }>()
const layout = computed(() => receipt.layout)
const barcodeValue = computed(() => {
    const names = (receipt.items ?? []).map(i => i.name).reduce((a, b) => a + b, "")
    return hashCode(names)
})
const receiptStyle = computed(() => {
    const l = layout.value ?? {}
    const s = {
        'background-color': getOrDefault(l, "background", 'rgb(235, 245, 245)'),
        'width': '400px',
        'font-family': getOrDefault(l, "font", "Inconsolata"),
        'padding': `${getOrDefault(l, "py", "1rem")} ${getOrDefault(l, "px", "1rem")}`
    }
    return s
})
const price = computed(() => (receipt.items ?? []).reduce((a, b) => b.price + a, 0))
const payed = computed(() => Math.round(price.value / 10.0 + 0.5) * 10)
const taxGroups = computed(() => {
    const groups: Record<string, ReceiptItem[]> = Object.groupBy(receipt.items, ({ taxClass }: ReceiptItem) => taxClass)
    const taxRates = [0.19, 0.07, 0.12]
    return Object.entries(groups)
        .map(([taxClass, group]) => ({ taxClass, price: group.reduce((a, b) => b.price + a, 0) }))
        .map(({ taxClass, price }, index) => ({
            taxClass,
            net: (1 - taxRates[index]) * price,
            gross: price,
            tax: taxRates[index] * price,
            taxRate: taxRates[index]
        }))
        .filter(({ taxRate }) => taxRate)
})
</script>

<template>
    <div id="receipt" class="flex flex-col items-center leading-4" :style="receiptStyle">
        <template v-if="!receipt.layoutBase || receipt.layoutBase == 'lidl'">
            <img class="logo w-20" src="/assets/lidl-logo.png" alt="lidl-logo">
            <div class="address whitespace-pre text-center">
                {{ receipt.address }}
            </div>
            <div class="w-full">
                <div class="items w-full grid gap-x-1 grid-cols-[1fr_max-content_0.5rem]">
                    <div>
                    </div>
                    <div>
                        &nbsp;&nbsp; EUR
                    </div>
                    <div>
                    </div>
                    <template v-for="item in receipt.items">
                        <div>
                            {{ item.name }}
                        </div>
                        <div class="text-right">
                            {{ item.price < 0 ? "-" : "&nbsp;" }} {{ Math.max(0,item.price).toFixed(2) }} </div>
                                <div>
                                    {{ item.taxClass }}
                                </div>
                                <template v-if="item.detail">
                                    <div>
                                        &nbsp;&nbsp;&nbsp;
                                        {{ item.detail }}
                                    </div>
                                    <div>
                                    </div>
                                    <div>
                                    </div>
                                </template>
                    </template>
                </div>
                <div>
                    <div class="text-right">-----------</div>
                    <div class="flex justify-between text-3xl">
                        <div>zu zahlen</div>
                        <div>{{ price.toFixed(2) }}</div>
                    </div>
                    <div class="text-right">-----------</div>
                    <div class="text-right -mt-5">-----------</div>
                </div>
                <div>
                    <div v-if="receipt.card" class="flex justify-between">
                        <div>EC-Karte</div>
                        <div>{{ price.toFixed(2) }}&nbsp;</div>
                    </div>
                    <div v-if="!receipt.card" class="flex justify-between">
                        <div>Bar</div>
                        <div>{{ payed.toFixed(2) }}&nbsp;</div>
                    </div>
                    <div v-if="!receipt.card" class="flex justify-between">
                        <div>Rückgeld</div>
                        <div>{{ (price - payed).toFixed(2) }}&nbsp;</div>
                    </div>
                </div>
                <div class="mt-4 w-full grid grid-cols-[1fr_1fr_1fr_max-content]">
                    <div>MWST%</div>
                    <div class="grid grid-cols-[max-content_1fr]">
                        <div>MWST</div>
                        <div class="text-center">+</div>
                    </div>
                    <div class="grid grid-cols-[max-content_1fr]">
                        <div>Netto</div>
                        <div class="text-center">=</div>
                    </div>
                    <div>Brutto</div>
                    <template v-for="taxGroup in taxGroups">
                        <div>{{ taxGroup.taxClass }}&nbsp;&nbsp;{{ (taxGroup.taxRate * 100).toFixed() }} %</div>
                        <div>{{ taxGroup.tax.toFixed(2) }}</div>
                        <div>{{ taxGroup.net.toFixed(2) }}</div>
                        <div class="text-right">{{ taxGroup.gross.toFixed(2) }}</div>
                    </template>
                    <div class="col-span-4">-----------------------------------------------</div>
                    <div>Summe</div>
                    <div>{{ taxGroups.reduce((a, b) => b.tax + a, 0).toFixed(2) }}</div>
                    <div>{{ taxGroups.reduce((a, b) => b.net + a, 0).toFixed(2) }}</div>
                    <div>{{ price.toFixed(2) }}</div>
                </div>
            </div>
            <div class="mt-6 flex flex-col items-center">
                <Barcode v-if="layout && layout.barcode" :value="barcodeValue" :height="layout.barcodeHeight" />
                <qrcode-vue v-if="layout && layout.qrcode" class="qrcode"
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
        <template v-else-if="receipt.layoutBase == 'real'">
            <img class="logo w-20" src="/assets/real-logo.png" alt="real-logo">
            <div class="address whitespace-pre text-center">
                {{ receipt.address }}
            </div>
            <div class="w-full">
                <div class="items w-full pl-16 pr-6 mt-8 justify-between grid grid-cols-[max-content_1fr_max-content]">
                    <template v-for="item in receipt.items">
                        <div>
                            {{ item.name }}
                        </div>
                        <div class="text-right">
                            {{ item.price }}
                            {{ item.price < 0 ? "-" : "&nbsp;" }} </div>
                                <div>
                                    {{ item.taxClass }}
                                </div>
                                <template v-if="item.detail">
                                    <div class="col-span-3">
                                        {{ item.detail }}
                                    </div>
                                </template>
                    </template>
                    <div class="flex justify-between font-bold">
                        <div>Summe</div>
                        <div>EUR</div>
                    </div>
                    <div class="text-right font-bold">{{ price.toFixed(2) }}&nbsp;&nbsp;</div>
                    <div>&nbsp;</div>
                    <div class="col-span-3">&nbsp;</div>
                    <div class="flex justify-between">
                        <div>Bar</div>
                        <div>EUR</div>
                    </div>
                    <div class="text-right">{{ payed.toFixed(2) }}&nbsp;&nbsp;</div>
                    <div>&nbsp;</div>
                    <div class="flex justify-between">
                        <div>Rückgeld</div>
                        <div>EUR</div>
                    </div>
                    <div class="text-right">{{ (payed - price).toFixed(2) }}&nbsp;&nbsp;</div>
                    <div>&nbsp;</div>
                </div>
                <div class="mt-8 w-full pl-16 pr-10 ">
                    <div class="w-full flex justify-between gap-x-1">
                        <div>Mehrwerstst.</div>
                        <div>ohne MwSt</div>
                        <div>mit MwSt</div>
                    </div>
                    <div class="w-full grid grid-cols-[2fr_2fr_2fr_2fr] text-right">
                        <template v-for="taxGroup in taxGroups.filter(a => a.taxClass)">
                            <div class="text-left">{{ taxGroup.taxClass }} {{ (taxGroup.taxRate * 100).toFixed(1) }}%</div>
                            <div>{{ taxGroup.tax.toFixed(2) }}</div>
                            <div>{{ taxGroup.net.toFixed(2) }}</div>
                            <div>{{ taxGroup.gross.toFixed(2) }}</div>
                        </template>
                    </div>
                </div>
            </div>
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

.masks .items {
    color: red;
    background-color: red;
}
</style>
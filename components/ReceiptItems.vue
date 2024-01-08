<script setup lang="ts">
export type ReceiptItem = {
    name: string,
    price: number,
    negative?: boolean,
    taxClass?: string,
    detail?: string
}
export type Props = {
    layout?: "lidl" | "real",
    items: ReceiptItem[]
}
const props = withDefaults(defineProps<Props>(), { layout: "lidl" })
const price = computed(() => props.items.reduce((a, b) => b.price + a, 0))
const payed = computed(() => Math.round(price.value / 10.0 + 0.5) * 10)
const taxGroups = computed(() => {
    const groups: Record<string, ReceiptItem[]> = Object.groupBy(props.items, ({ taxClass }: ReceiptItem) => taxClass)
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
})
</script>

<template>
    <div v-if="layout == 'lidl'" class="w-full">
        <div class="items w-full grid gap-x-1 grid-cols-[1fr_max-content_0.5rem]">
            <div>
            </div>
            <div>
                &nbsp;&nbsp; EUR
            </div>
            <div>
            </div>
            <template v-for="item in items">
                <div>
                    {{ item.name }}
                </div>
                <div class="text-right">
                    {{ item.negative ? "-" : "&nbsp;" }}
                    {{ item.price.toFixed(2) }}
                </div>
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
            <div class="flex justify-between">
                <div>Bar</div>
                <div>{{ payed.toFixed(2) }}&nbsp;</div>
            </div>
            <div class="flex justify-between">
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
    <div v-else-if="layout == 'real'" class="w-full">
        <div class="items w-full pl-16 pr-6 mt-8 justify-between grid grid-cols-[max-content_1fr_max-content]">
            <template v-for="item in items">
                <div>
                    {{ item.name }}
                </div>
                <div class="text-right">
                    {{ item.price }}
                    {{ item.negative ? "-" : "&nbsp;" }}
                </div>
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
                <template v-for="taxGroup in taxGroups">
                    <div class="text-left">{{ taxGroup.taxClass }} {{ (taxGroup.taxRate * 100).toFixed(1) }}%</div>
                    <div>{{ taxGroup.tax.toFixed(2) }}</div>
                    <div>{{ taxGroup.net.toFixed(2) }}</div>
                    <div>{{ taxGroup.gross }}</div>
                </template>
            </div>
        </div>
    </div>
</template>

<style>
.masks .items {
    color: red;
    background-color: red;
}
</style>
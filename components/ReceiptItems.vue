<script setup lang="ts">
export type ReceiptItem = {
    name: string,
    price: number,
    negative?: boolean,
    taxClass?: string,
    detail?: string
}
const props = withDefaults(defineProps<{
    layout?: "lidl",
    items: ReceiptItem[]
}>(), { layout: "lidl" })
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
                <div>
                    {{ item.negative ? "-" : "&nbsp;" }}
                    {{ item.price }}
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
        <div class="my-4 w-full font-bold grid grid-cols-[1fr_50px]">
            <div>Gesamter Rabatt</div>
            <div>0,30</div>
        </div>
        <div class="w-full grid grid-cols-[1fr_1fr_1fr_max-content]">
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
                <div>{{ taxGroup.gross }}</div>
            </template>
            <div class="col-span-4">-----------------------------------------------</div>
            <div>Summe</div>
            <div>{{ taxGroups.reduce((a, b) => b.tax + a, 0).toFixed(2) }}</div>
            <div>{{ taxGroups.reduce((a, b) => b.net + a, 0).toFixed(2) }}</div>
            <div>{{ price.toFixed(2) }}</div>
        </div>
    </div>
</template>
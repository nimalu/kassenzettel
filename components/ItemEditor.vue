<script setup lang="ts">
import type { ReceiptItem } from './ReceiptItems.vue';

const { modelValue } = defineProps<{ modelValue: ReceiptItem[] }>()
const emit = defineEmits(["update:modelValue"])


function update<T extends keyof ReceiptItem>(index: number, key: T, value: ReceiptItem[T]) {
    while (index >= modelValue.length) {
        modelValue.push({ name: "", price: 0 })
    }
    const item = modelValue[index]
    if (key == "price") {
        const newPrice = Number.parseFloat(value?.toString() ?? "0")
        if (!Number.isNaN(newPrice)) {
            item.price = newPrice
        } else {
            item.price = item.price
        }
    } else {
        item[key] = value
    }
    const isEmpty = (item: ReceiptItem) => item.name.length == 0 && item.price == 0
    emit("update:modelValue", modelValue.filter(a => !isEmpty(a)))
}
</script>
<template>
    <div>
        <label class="block mb-2 text-sm font-medium text-gray-900">Items</label>
        <div class="grid grid-cols-[auto_auto_auto_auto] gap-1">
            <template v-for="item, index in [...modelValue, { name: '', price: 0 }]" :key="index">
                <input type="text" class="w-48 border" :value="item.name"
                    @input="e => update(index, 'name', e.target.value)">
                <input type="text" class="w-16 border text-right" :value="item.price"
                    @input="e => update(index, 'price', e.target.value)">
                <input type="text" class="w-5 border text-center" :value="item.taxClass"
                    @input="e => update(index, 'taxClass', e.target.value)">
                <input type="text" class="w-28 border" :value="item.detail"
                    @input="e => update(index, 'detail', e.target.value)">
            </template>
        </div>

    </div>
</template>

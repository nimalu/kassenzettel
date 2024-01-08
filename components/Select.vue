<script setup lang="ts" generic="T extends string">
const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    label?: string,
    options: T[]
}>(), {
    options: () => []
})
const id = computed(() => label ? label : uuid.value?.toString())

const model = defineModel<T>()
</script>

<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>

        <select :id="id" v-model="model" class="p-2">
            <option v-for="option in options" :value="option">{{ option }}</option>
        </select>
    </div>
</template>
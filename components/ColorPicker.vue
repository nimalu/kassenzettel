<script setup lang="ts">
import ColorInput from 'vue-color-input'

const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    label?: string
}>(), {
})
const id = computed(() => label ? label : uuid.value?.toString())

const model = defineModel<string>()
</script>
<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
        <color-input v-model="model" position="bottom right" />
    </div>
</template>
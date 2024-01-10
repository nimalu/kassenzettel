<script setup lang="ts">
const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    placeholder?: string,
    label?: string
}>(), {
})
const id = computed(() => label ? label : uuid.value?.toString())

const model = defineModel<string>()
</script>
<template>
    <div class="w-64">
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
        <textarea :id="id" rows="4"
            class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-50"
            :placeholder="placeholder" v-model="model"></textarea>

    </div>
</template>
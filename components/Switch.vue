<script setup lang="ts">
const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    label?: string
}>(), {
})
const id = computed(() => label ? label : uuid.value?.toString())

const model = defineModel<boolean>()
</script>
<template>
    <div class="flex">
        <span class="mr-3 text-sm font-medium text-gray-900">{{ label }}</span>
        <label :for="id" class="flex items-center cursor-pointer relative mb-4">
            <input type="checkbox" :id="id" class="sr-only" v-model="model">
            <div class="toggle-bg bg-gray-200 border-2 border-gray-200 h-6 w-11 rounded-full"></div>
        </label>
    </div>
</template>

<style scoped>
.toggle-bg:after {
    content: '';
    @apply absolute top-0.5 left-0.5 bg-white border border-gray-300 rounded-full h-5 w-5 transition shadow-sm;
}

input:checked+.toggle-bg:after {
    transform: translateX(100%);
    @apply border-white;
}

input:checked+.toggle-bg {
    @apply bg-blue-600 border-blue-600;
}
</style>
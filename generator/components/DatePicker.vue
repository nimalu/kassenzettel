<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'

const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    label?: string,
}>(), {
})

const id = computed(() => label ? label : uuid.value?.toString())

const model = defineModel<Date>()
</script>
<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
        <VueDatePicker :uid="id" enable-seconds v-model="model" />
    </div>
</template>
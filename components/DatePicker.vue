<script setup lang="ts">
const instance = getCurrentInstance()
const uuid = ref(instance?.uid)

const { label } = withDefaults(defineProps<{
    label?: string,
    modelValue: Date
}>(), {
})
const emit = defineEmits(['update:modelValue'])
function update(e: InputEvent) {
    emit('update:modelValue', new Date(e.target.value))
}

const id = computed(() => label ? label : uuid.value?.toString())
</script>
<template>
    <div>
        <label :for="id" class="block mb-2 text-sm font-medium text-gray-900">{{ label }}</label>
        <input type="datetime-local" :id="id" :value="modelValue.toISOString().slice(0, 19)" @change="update">
    </div>
</template>
<script setup>
const props = defineProps(["value"])
onMounted(() => JsBarcode("#barcode", props.value, {
    background: "rgba(0,0,0,0)",
    fontSize: 0
}))
</script>
<template>
    <svg id="barcode"></svg>
</template>
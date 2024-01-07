<script setup>
const props = defineProps(["value", "height"])
onMounted(() => JsBarcode("#barcode", props.value, {
    background: "rgba(0,0,0,0)",
    fontSize: 0,
    height: props.height ?? "100rem",
}))
</script>
<template>
    <svg id="barcode"></svg>
</template>
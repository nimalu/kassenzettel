<script setup>
const props = defineProps(["value", "height"])
function renderBarcode(v) {
    if (typeof JsBarcode !== 'undefined') {
        JsBarcode("#barcode", v, {
            background: "rgba(0,0,0,0)",
            fontSize: 0,
            height: props.height ?? "100rem",
        })
    }
}
watch(() => props.value, renderBarcode)
onMounted(() => renderBarcode(props.value))
</script>
<template>
    <svg class="barcode" id="barcode"></svg>
</template>

<style>
.masks .barcode {
    opacity: 0;
}
</style>
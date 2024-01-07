<script setup lang="ts">
const screenshot = ref()
async function hit() {
  const res = await fetch("/api/screenshot")
  const resJSON: { image: string } = await res.json()
  screenshot.value = `data:image/png;base64,${resJSON.image}`
}
</script>
<template>
  <div class="flex items-center justify-center mt-10">
    <Receipt />
    <button @click="hit" class="bg-white">Hit</button>
    <img :src="screenshot" alt="">
  </div>
</template>

<style>
body {
  background-color: #111;
}
#nuxt-devtools-container {
  visibility: hidden;
}
</style>
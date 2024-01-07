<script setup lang="ts">
const screenshot = ref()
async function hit() {
  const res = await fetch("/api/screenshot")
  const resJSON: { image: string } = await res.json()
  screenshot.value = `data:image/png;base64,${resJSON.image}`
}

const address = ref("Mageburger Straße\n39245 Gommern\nMo-Sa 8-14 Uhr So geschlossen")
const masks = ref(false)
</script>
<template>
  <main class="p-10 bg-slate-100 flex gap-x-8" :class="{ masks }">
    <div class="grid grid-cols-2 gap-4 content-start">
      <div class="col-span-2">
        <TextArea v-model="address" label="Address" />
      </div>
      <Switch label="Masks" v-model="masks" />
    </div>
    <Receipt :address="address" />
  </main>
</template>

<style>
#nuxt-devtools-container {
  visibility: hidden;
}
.masks {
  color: white;
}
</style>
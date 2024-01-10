<script setup lang="ts">
import type { ReceiptItem } from '~/components/ReceiptItems.vue';
import type { Receipt } from '~/components/receipt.vue';

function sample<T>(arr: T[]) {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomFloat(from: number, to: number) {
    return Math.random() * (to - from) + from
}

function randomInt(from: number, to: number) {
    return Math.floor(Math.random() * (to - from)) + from
}

function randomBackground() {
    const r = randomInt(100, 250)
    const g = randomInt(100, 250)
    const b = randomInt(100, 250)
    return `rgb(${r}, ${g}, ${b})`
}

function randomAddress() {
    const street = sample([
        "Magdeburger Straße", "Danziger Straße", "Bremer Straße", "Im Blauweg"
    ])
    const number = randomInt(1, 99)
    const postcode = randomInt(10000, 88888)
    const city = sample([
        "Schorndorf", "Berlin", "Magdeburg", "Karlsruher", "München", "Hamburg"
    ])
    const times = sample([
        "", "Mo-Fr 8-18 Uhr", "Mo-Fr 8-19 Uhr So geschlossen"
    ])
    return `${street} ${number}
    ${postcode} ${city}
    ${times}
    `
}

function randomDate(start: Date, end: Date) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomItem(): ReceiptItem {
    return {
        name: sample(["Kartoffeln", "Bio Paprika", "Möhren kg", "Banen Madeira 1", "Mel Hon", "Bosch Schr", "BIO Gurke", "Zitrone Madagaskar", "2 Paar Socken"]),
        price: -(-randomFloat(0, randomFloat(1, randomFloat(2, 200))).toFixed(2)),
        taxClass: sample(["", "A", "A", "A", "B", "E"]),
        detail: sample(["", "", "", "", "2 EUR kg x 200g", "200g", "Angebot"])
    }
}

function randomItems() {
    const number = randomInt(1, randomInt(1, 100))
    const items = []
    for (let i = 0; i < number; i++) {
        items.push(randomItem())
    }
    return items
}


function generateRandomReceipt(): Receipt {
    return {
        items: randomItems(),
        layout: sample(["lidl"]),
        itemsLayout: sample(["lidl", "real"]),
        background: randomBackground(),
        address: randomAddress(),
        py: `${randomFloat(0.2, 2)}rem`,
        px: `${randomFloat(0.2, 2)}rem`,
        barcodeHeight: randomInt(10, 100) + "px",
        date: randomDate(new Date(1999), new Date()),
        detail1: "Kommen Sie gerne wieder",
        barcode: sample([true, false]),
        qrcode: sample([true, false]),
        card: sample([true, false]),
        font: sample(['Inconsolata', 'DejavuSansMono']),
    }
}


const ids = ref<string[]>([])
async function generate() {
    const jobs: Promise<void>[] = []
    for (let i = 0; i < 100; i++) {
        jobs.push((async () => {
            const receipt = generateRandomReceipt()
            const { id } = await $fetch(`/api/sample`, { method: 'POST', body: { receipt } })
            ids.value.push(id)
            await $fetch(`/api/sample/${id}/generate`, { method: 'POST' })
        })())
    }
    await Promise.all(jobs)
    const blob = await $fetch(`/api/download`, { method: 'POST' }) as Blob
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob);
    document.body.appendChild(link)
    link.click()
}
</script>
<template>
    <div class="p-4">
        <button @click="generate">Generate</button>
        <div class="w-full flex flex-wrap gap-1">
            <div v-for="id in ids" :key="id" class="grid grid-cols-2 w-36 border">
                <img :src="'/images/' + id + '.png'" alt="">
                <img :src="'/masks/' + id + '.png'" alt="">
            </div>
        </div>
    </div>
</template>
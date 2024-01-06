<template>
    <div class="bg-cyan-50 text-slate-900 flex flex-col items-center receipt py-6 px-2 w-[400px]">
        <div>
            <img class="w-20"
                src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fbrandslogos.com%2Fwp-content%2Fuploads%2Fimages%2Flarge%2Flidl-supermarkets-logo-black-and-white.png&f=1&nofb=1&ipt=6dc49be518802aa0544c863587d13c52259dfbce74b151b6c5d881a187062971&ipo=images"
                alt="lidl-logo">
        </div>
        <div class="flex flex-col items-center">
            <div>Magdeburger Straße</div>
            <div>39245 Gommern</div>
            <div>Mo-Sa 8-20 Uhr So geschlossen</div>
        </div>

        <div class="w-full grid grid-cols-[1fr_50px]">
            <div></div>
            <div>EUR</div>
            <div>Salami 1a Paprika</div>
            <div>0,99 A</div>
            <div>Trauben hell kg</div>
            <div>2,02 A</div>
            <div>Paprika rot kg</div>
            <div>0,78 A</div>
        </div>
        <div class="text-3xl w-full flex justify-between items-center">
            <div>zu zahlen</div>
            <div>
                <div>-----------</div>
                <div>26,93</div>
                <div>-----------</div>
            </div>
        </div>
        <div class="w-full grid grid-cols-[1fr_50px]">
            <div>Bar</div>
            <div>50,00</div>
            <div>Rückgeld</div>
            <div>-23,07</div>
        </div>
        <div class="my-4 w-full font-bold grid grid-cols-[1fr_50px]">
            <div>Gesamter Rabatt</div>
            <div>0,30</div>
        </div>
        <table class="w-full table-fixed">
            <thead>
                <tr>
                    <th>MWST%</th>
                    <th>MWST</th>
                    <th>+</th>
                    <th>Netto</th>
                    <th>=</th>
                    <th>Brutto</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>A 7 %</td>
                    <td>1,01</td>
                    <td></td>
                    <td>14,45</td>
                    <td></td>
                    <td>15,46</td>
                </tr>
                <tr>
                    <td>A 7 %</td>
                    <td>1,01</td>
                    <td></td>
                    <td>14,45</td>
                    <td></td>
                    <td>15,46</td>
                </tr>
            </tbody>
        </table>
        <div>
            <Barcode value="adfjalk" />
        </div>
        <div class="w-full flex justify-between">
            <div>5571</div>
            <div>140377/03</div>
            <div>30.12.14</div>
            <div>13:22</div>
        </div>
        <div class="mt-4 flex flex-col items-center">
            <div>UST-ID-NR: DE8141100850</div>
            <div>* * * *</div>
            <div>VIELEN DANK FÜR IHREN EINKAUF!</div>
            <div>LIDL LOHNT SICH.</div>
            <div>* * * *</div>
            <div>+ Ausbildung oder Duales Studium? +</div>
            <div>Lidl bietet beides!</div>
            <div>Vertrieb, Logistik oder Büro.</div>
            <div>Bewerben Sie sich jetzt für den</div>
            <div>Ausbildungs-/ Studienbeginn 2015</div>
            <div>+ + + www.karriere-bei-lidl.de + + +</div>
        </div>
    </div>
</template>

<style scoped>
.receipt {
    font-family: 'Inconsolata';
}
</style>
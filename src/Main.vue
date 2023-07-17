<script setup lang="ts">
import breakupData from '/092拆分.txt?raw'
import codeData from '/092编码.txt?raw'
import {nextTick, ref} from "vue";
import {blobToBase64, takeScreenshot} from "./utils";
import {saveAs} from 'file-saver'

interface ListData {
    char: string,
    code?: string[],
    breakup?: string,
}

let inputText = ref("")

let breakupMap = {}
let codeMap: { [key: string]: string[] } = {}
for (let x of breakupData.split('\n') as string[]) {
    let split = x.split('\t');
    breakupMap[split[0]] = split[1]
}
for (let x of codeData.split('\n') as string[]) {
    let split = x.split('\t')
    if (codeMap[split[0]] == undefined) {
        codeMap[split[0]] = []
    }
    codeMap[split[0]].push(split[1])
}

function getListData(text: string): ListData[] {
    let chars = [...text]
    return chars.map(x => {
        let breakup: string | null = breakupMap[x] || null
        let code: string[] | null = codeMap[x] || null
        return {
            char: x,
            code: code,
            breakup: breakup,
        }
    })
}

async function sleep(millis: number) {
    return new Promise(r => {
        setTimeout(r, millis)
    })
}

window['updateAndGetImage'] = async (text: string) => {
    let view = document.querySelector('#view') as HTMLElement
    inputText.value = text
    await nextTick();
    let blob = await takeScreenshot(view)
    return await blobToBase64(blob)
}

async function saveImageClick() {
    let view = document.querySelector('#view') as HTMLElement
    let blob = await takeScreenshot(view);
    console.log(blob);
    saveAs(blob, 'image.png')
}
</script>

<template>
    <table>
        <tr>
            <td>
                <div id="view" class="td-view">
                    <ul id="data-ul">
                        <li v-for="x in getListData(inputText)" class="字根-display">
                            <span>{{ x.char }}</span>
                            <span v-if="x.code != null">&nbsp;</span>
                            <span v-if="x.code != null">{{ x.code.join(', ') }}</span>
                            <span>：</span>
                            <span>{{ x.breakup || "？" }}</span>
                        </li>
                    </ul>
                </div>
            </td>
            <td style="vertical-align: top">
                <div class="td-view">
                    <input type="text" placeholder="Input characters" v-model="inputText"><br>
                    <button @click="saveImageClick">Save image</button>
                </div>
            </td>
        </tr>
    </table>
</template>

<style lang="scss">
#data-ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    display: inline-block;
}

#data-ul {
    $border-color: green;

    li {
        border-left: $border-color 1px solid;
        border-right: $border-color 1px solid;
        border-top: $border-color 1px solid;
    }

    li:last-child {
        border-bottom: $border-color 1px solid;
    }
}

@font-face {
    font-family: "〇九二字根专用";
    src: url('/092-breakup.otf');
}

.字根-display {
    font-family: '〇九二字根专用', sans-serif, Sans;
}

.td-view {
    padding: 10px;
}

</style>

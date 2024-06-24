<script setup lang="ts">
import {saveAs} from "file-saver";
import {nextTick, ref} from "vue";
import {imageSaverManager} from "../handler";
import {appParams} from "../params-data";
import {object2Map} from "../utils";

async function saveImageClick() {
  try {
    appParams.value[selectedName.value] = JSON.parse(params.value);
    await nextTick();
    let blob = await imageSaverManager().get(selectedName.value).generate();
    console.log(blob);
    saveAs(blob, 'image.png')
  } catch (e) {
    alert(`Exception: ${e}`)
  }
}

let props = defineProps<{
  name?: string,
  params?: string,
}>();

let nameOptions = Array.from(object2Map(appParams.value).keys()).map(x => ({
  label: x,
  value: x,
}));

let params = ref<string>(props.params ?? '');
let selectedName = ref<string>(props.name ?? '');
</script>

<template>
  <n-space vertical>
    <n-select placeholder="Please select the app name"
              :options="nameOptions"
              v-model:value="selectedName"
    />
    <n-input type="textarea" v-model:value="params"></n-input>
    <n-button @click="saveImageClick">Generate!</n-button>
  </n-space>
</template>

<style scoped lang="scss">

</style>

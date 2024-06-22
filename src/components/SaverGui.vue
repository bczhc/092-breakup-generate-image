<script setup lang="ts">
import {saveAs} from "file-saver";
import {ref} from "vue";
import {imageSaverManager} from "../../automation/handler";

async function saveImageClick() {
  let handler = imageSaverManager().get(selectedName.value);
  if (!handler) {
    alert('App name not found')
    return
  }

  try {
    let blob = await handler.generate(JSON.parse(params.value));
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

let nameOptions = Array.from(imageSaverManager().handlers.keys()).map(x => ({
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

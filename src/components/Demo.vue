<script setup lang="ts">
import {registerSimpleImageGenerator} from "../handler";
import {takeScreenshot} from "../utils";
import {ref} from "vue";

const appName = 'demo';

let imageView = ref(null);

let props = defineProps<{
  params: object,
}>()

registerSimpleImageGenerator(appName, async () => {
  return takeScreenshot(imageView.value)
})
</script>

<template>
  <span class="red-text" id="span" ref="imageView">{{ props.params['text'] }}</span>
</template>

<style lang="scss">
.red-text {
  color: red;
}
</style>

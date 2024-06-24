<!-- 2.13" e-ink screen -->
<!-- Specification: 250x122 -->

<script setup lang="ts">
import {registerSimpleImageGenerator} from "../handler";
import {takeScreenshot} from "../utils";
import {ref} from "vue";

const appName = 'eink-screen';

let props = defineProps<{
  params: object,
}>()

let imageView = ref(null);

registerSimpleImageGenerator(appName, async () => {
  return takeScreenshot(imageView.value, 1)
})
</script>

<template>
  <div id="border-wrapper">
    <div id="main-screen" ref="imageView">
      <span style="font-family: 'Noto Sans CJK SC', sans-serif" id="line1" class="text-line">测试</span><br>
      <span style="font-family: 'Noto Sans CJK SC', sans-serif" id="line2" class="text-line">₿: 64000$</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
#main-screen {
  width: 250px;
  height: 122px;
}

#border-wrapper {
  display: inline-block;
  border: black solid 1px;
}

.text-line {
  font-size: 25px;
  margin-left: 10px;
  display: inline;
}

#line2 {
  padding-top: 0;
}

@font-face {
  font-family: 'Noto Sans';
  src: url('/NotoSans-Regular.ttf');
}
</style>

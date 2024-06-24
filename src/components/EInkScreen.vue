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

interface Params {
  electricity: number,
  toZeroDate: string,
}

</script>

<template>
  <div id="border-wrapper">
    <div id="main-screen" ref="imageView">
      <span id="line1" class="text-line">宿舍电量：{{ (props.params as Params).electricity }} kW·h</span><br>
      <span id="line2" class="text-line">归零时间：{{ (props.params as Params).toZeroDate }}</span><br>
      <span is="line3" class="text-line">今日天气：TODO</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
#main-screen {
  width: 212px;
  height: 104px;
}

#border-wrapper {
  display: inline-block;
  border: black solid 1px;
}

// noinspection CssInvalidPropertyValue, CssUnknownProperty
.text-line {
  font-smooth: never;
  -moz-osx-font-smoothing: never;
  -webkit-font-smoothing: never;
  font-size: 16px;
  margin-left: 10px;
  display: inline;
  line-height: 1;
  font-family: 'unifont', sans-serif;
}

@font-face {
  font-family: 'Noto Sans';
  src: url('/NotoSans-Regular.ttf');
}

@font-face {
  font-family: 'unifont';
  src: url('/unifont-15.1.05.otf')
}
</style>

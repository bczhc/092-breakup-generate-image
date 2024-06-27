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
  lines: string[],
}

</script>

<template>
  <div id="border-wrapper">
    <div id="main-screen" ref="imageView">
      <span v-for="(line, index) in (props.params as Params).lines" :id="`line${index}`" class="text-line">{{ line }}<br/></span>
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
  margin-left: 6px;
  display: inline;
  line-height: 1;
  font-family: 'unifont', sans-serif;
}

#line1 {
  position: relative;
  top: -2px;
}

#line2 {
  position: relative;
  top: -4px;
}

#line3 {
  position: relative;
  top: -6px;
}

#line4 {
  position: relative;
  top: -8px;
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

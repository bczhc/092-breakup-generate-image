<!-- 2.13" e-ink screen -->
<!-- Specification: 250x122 -->

<script setup lang="ts">
import FontPreloader from "./FontPreloader.vue";
import {ImageSaverHandler, imageSaverManager, Params} from "../handler";
import {takeScreenshot} from "../utils";
import $ from 'jquery';

imageSaverManager().register('eink-screen', new class extends ImageSaverHandler {
  async generate(_params: Params): Promise<Blob> {
    return await takeScreenshot($('#main-screen')[0], 1);
  }
})
</script>

<template>
  <FontPreloader/>

  <div id="border-wrapper">
    <div id="main-screen">
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

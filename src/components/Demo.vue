<script setup lang="ts">
import {ImageSaverHandler, imageSaverManager, Params} from "../handler";
import $ from 'jquery';
import {takeScreenshot} from "../utils";

imageSaverManager().register('demo', new class extends ImageSaverHandler {
  async generate(params: Params): Promise<Blob> {
    let $span = $('#span');
    $span.text(params['text']);
    $span[0].innerText = params['text'];
    return await takeScreenshot($span[0]);
  }
})
</script>

<template>
  <span class="red-text" id="span"/>
</template>

<style lang="scss">
.red-text {
  color: red;
}
</style>

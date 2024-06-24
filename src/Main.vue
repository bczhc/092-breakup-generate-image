<script setup lang="ts">
import C092BreakUp from './components/092BreakUp.vue'
import Demo from "./components/Demo.vue";
import SaverGui from "./components/SaverGui.vue";
import EInkScreen from "./components/EInkScreen.vue";
import ParamsFormGui from "./components/ParamsFormGui.vue";
import FontPreloader from "./components/FontPreloader.vue";
import {appParams} from "./params-data";
</script>

<template>
  <FontPreloader/>

  <div class="app-component">
    <C092BreakUp :params="appParams['092breakup']"/>
    <ParamsFormGui v-model:params="appParams['092breakup']"/>
  </div>
  <div class="app-component">
    <Demo :params="appParams['demo']"/>
    <ParamsFormGui v-model:params="appParams['demo']"/>
  </div>
  <div class="app-component">
    <EInkScreen :params="appParams['eink-screen']"/>
  </div>

  <div class="center" style="width: 100%">
    <div id="click-saver">
      <n-space justify="center" vertical>
        <n-p>Function Call Test</n-p>
        <SaverGui name="092breakup" :params="JSON.stringify({text: '天下事有难易乎？'})"/>
      </n-space>
    </div>
  </div>
</template>

<style lang="scss">
.app-component {
  border: black solid 1px;
}

.center {
  width: 100%;
  display: flex;
  justify-content: center;
}

#click-saver {
  display: inline-block;
  justify-content: center;
  margin-top: 50px;
  width: 30%;
}
</style>

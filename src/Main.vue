<script setup lang="ts">
import C092BreakUp from './components/092BreakUp.vue'
import Demo from "./components/Demo.vue";
import SaverGui from "./components/SaverGui.vue";
</script>

<template>
  <div class="app-component">
    <C092BreakUp/>
  </div>
  <div class="app-component">
    <Demo/>
  </div>
  <div class="center" style="width: 100%">
    <div id="click-saver">
      <SaverGui name="092breakup" :params="JSON.stringify({text: '天下事有难易乎？'})"/>
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

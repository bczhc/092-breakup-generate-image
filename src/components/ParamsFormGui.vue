<script setup lang="ts">
let props = defineProps<{
  params: object,
}>()
</script>

<template>
  <n-form label-placement="left" style="padding: 10px">
    <n-form-item :label="paramName" v-for="paramName in new Map(Object.entries(props.params)).keys()">
      <n-input v-model:value="props.params[paramName]"/>
    </n-form-item>
  </n-form>
</template>

<style scoped lang="scss">

</style>

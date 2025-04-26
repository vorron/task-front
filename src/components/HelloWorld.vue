<template>
  <div class="container">
    <h1>Scroll Test</h1>
    <div 
      class="list-container"
      ref="listContainer"
      @scroll="handleScroll"
    >
      <div v-for="item in 30" :key="item" class="list-item">
        Item {{ item }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const listContainer = ref<HTMLElement | null>(null);

const handleScroll = () => {
  console.log('++++++ SCROLL EVENT ++++++');
  if (!listContainer.value) return;
  
  const { scrollTop, scrollHeight, clientHeight } = listContainer.value;
  console.log(`Scroll position: ${scrollTop} / ${scrollHeight - clientHeight}`);
};

onMounted(() => {
  console.log('Mounted, container ref:', listContainer.value);
  
  if (listContainer.value) {
    listContainer.value.addEventListener('scroll', handleScroll);
    console.log('Scroll listener manually attached');
  }
});
</script>

<style>
.container {
  padding: 20px;
}

.list-container {
  border: 2px solid red;
  max-height: 300px;
  overflow-y: auto;
}

.list-item {
  height: 50px;
  border-bottom: 1px solid blue;
  display: flex;
  align-items: center;
  padding: 0 15px;
}
</style>
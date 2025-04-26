<template>
    <div class="container" ref="scrollContainer" @scroll="handleScroll">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="item"
      >
        {{ index }}
      </div>
      <div v-if="isLoading" class="loading">Загрузка...</div>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, computed } from 'vue';
  
  export default {
    setup() {
      const items = ref([]);
      const isLoading = ref(false);
      const scrollContainer = ref(null);
      const itemsPerPage = 20;  // Количество элементов для первоначальной загрузки и каждой последующей
  
      // Начальная загрузка данных
      const loadInitialData = () => {
        isLoading.value = true;
        setTimeout(() => { // Имитация асинхронной загрузки
          for (let i = 0; i < itemsPerPage; i++) {
            items.value.push(i); // В реальном приложении здесь был бы запрос к API
          }
          isLoading.value = false;
        }, 500); // Задержка для имитации загрузки
      };
  
      // Функция для загрузки новых данных
      const loadMoreData = () => {
        if (isLoading.value) return; // Предотвращаем множественные запросы во время загрузки
  
        isLoading.value = true;
        setTimeout(() => { // Имитация асинхронной загрузки
          const startIndex = items.value.length;
          for (let i = 0; i < itemsPerPage; i++) {
            items.value.push(startIndex + i); // В реальном приложении здесь был бы запрос к API
          }
          isLoading.value = false;
        }, 500); // Задержка для имитации загрузки
      };
  
      // Функция-обработчик события прокрутки
      const handleScroll = () => {
        if (!scrollContainer.value) return;
  
        const element = scrollContainer.value;
  
        const scrollTop = element.scrollTop;
        const clientHeight = element.clientHeight;
        const scrollHeight = element.scrollHeight;
  
        // Условие для запуска загрузки новых данных: прокрутка до конца списка (с небольшим запасом)
        if (scrollTop + clientHeight >= scrollHeight - 50) {  // 50px запас, чтобы начать загрузку чуть раньше конца
          loadMoreData();
        }
      };
  
  
      onMounted(() => {
        loadInitialData();
      });
  
      return {
        items,
        isLoading,
        scrollContainer,
        handleScroll,
      };
    },
  };
  </script>
  
  <style scoped>
  .container {
    width: 300px;
    height: 400px;
    margin: 50px auto;
    border: 1px solid #ccc;
    overflow-y: auto; /* Включаем вертикальную прокрутку */
    padding: 10px;
  }
  
  .item {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }
  
  .item:last-child {
    border-bottom: none;
  }
  
  .loading {
    text-align: center;
    padding: 10px;
    color: #888;
  }
  </style>
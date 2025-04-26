<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import type Item from "./Item";
import { BackService } from "./BackService";

const scrollContainer = ref<HTMLDivElement | null>(null);

const items = ref<Item[]>([]);
const loading = ref(false);

const searchQuery = ref("");

const isDragging = ref(false);
const draggedItemId = ref<number | null>(null);
const draggedOverItemId = ref<number | null>(null);

const displayedItems = computed(() => items.value);

const fetchItems = async (isNextPage: boolean, searchQuery = "") => {
  loading.value = true;
  try {
    const data = await BackService.getData(isNextPage, searchQuery);
    items.value = isNextPage ? [...items.value, ...data.items] : data.items;
  } catch (error) {
    console.error("Error fetching items:", error);
  } finally {
    loading.value = false;
  }
};

const handleScroll = () => {
  if (!scrollContainer.value) return;
  const { scrollTop, clientHeight, scrollHeight } = scrollContainer.value;
  if (scrollTop + clientHeight >= scrollHeight - 100)
    fetchItems(true, searchQuery.value);
};

const onDragStart = (id: number) => {
  isDragging.value = true;
  draggedItemId.value = id;
};

const onDragEnd = () => {
  isDragging.value = false;
  draggedItemId.value = null;
  draggedOverItemId.value = null;
};

const onDragOver = (id: number) => {
  if (isDragging.value) draggedOverItemId.value = id;
};

const onDrop = async (id: number) => {
  if (!isDragging.value || !draggedItemId.value || draggedItemId.value === id)
    return;

  const draggedIndex = items.value.findIndex(
    (item) => item.id === draggedItemId.value
  );
  const dropIndex = items.value.findIndex((item) => item.id === id);
  if (draggedIndex === -1 || dropIndex === -1) return;
  BackService.setOrder(draggedItemId.value, id);
  const newItems = [...items.value];
  const [draggedItem] = newItems.splice(draggedIndex, 1);
  newItems.splice(dropIndex, 0, draggedItem);
  items.value = newItems;
};

watchEffect(() => fetchItems(false, searchQuery.value));
</script>

<template>
  <div class="container">
    <h1>Item List (1,000,000 items)</h1>

    <div class="search-container">
      <input
        v-model="searchQuery"
        placeholder="Search items..."
        class="search-input"
      />
    </div>

    <div class="list-container" ref="scrollContainer" @scroll="handleScroll">
      <div
        v-for="item in displayedItems"
        :key="item.id"
        class="list-item"
        draggable="true"
        @dragstart="onDragStart(item.id)"
        @dragover.prevent="onDragOver(item.id)"
        @drop="onDrop(item.id)"
        @dragend="onDragEnd"
      >
        <input
          type="checkbox"
          v-model="item.selected"
          @change="BackService.toggleSelection(item)"
        />
        <span>{{ item.text }}</span>
      </div>

      <div v-if="loading" class="loading">Loading more items...</div>
    </div>
  </div>
</template>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.list-container {
  border: 1px solid #ddd;
  border-radius: 4px;
  max-height: 600px;
  overflow-y: auto;
}

.list-item {
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  gap: 10px;
  background-color: #fff;
  transition: background-color 0.2s;
}

.list-item:hover {
  background-color: #f5f5f5;
}

.list-item input[type="checkbox"] {
  cursor: pointer;
}

.loading,
.end-of-list {
  padding: 15px;
  text-align: center;
  color: #666;
}

/* Drag & drop styles */
.list-item.dragging {
  opacity: 0.5;
}

.list-item.drop-target {
  background-color: #e1f5fe;
}
</style>

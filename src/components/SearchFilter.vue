<template>
  <div class="bg-white rounded-xl shadow-md p-6 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
      <!-- Search -->
      <div class="relative md:col-span-2 lg:col-span-1">
        <MagnifyingGlassIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          v-model="localFilters.search"
          type="text"
          placeholder="Search recipes..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          @input="handleSearchInput"
          @keyup.enter="performSearch"
        />
      </div>
      
      <!-- Category Filter -->
      <select
        v-model="localFilters.category"
        @change="updateFilters"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option v-for="category in categories" :key="category" :value="category">
          {{ category === 'All' ? 'All Categories' : category }}
        </option>
      </select>
      
      <!-- Difficulty Filter -->
      <select
        v-model="localFilters.difficulty"
        @change="updateFilters"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
      >
        <option v-for="difficulty in difficulties" :key="difficulty" :value="difficulty">
          {{ difficulty === 'All' ? 'Any Difficulty' : difficulty }}
        </option>
      </select>
      
      <!-- Max Cook Time -->
    </div>
    
    <!-- Search Button -->
    <div class="flex justify-center">
      <button
        @click="performSearch"
        :disabled="!localFilters.search.trim()"
        class="bg-primary-600 hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg font-medium transition-colors"
      >
        Search Recipes
      </button>
    </div>
    
    <!-- Active Filters -->
    <div v-if="hasActiveFilters" class="mt-4 pt-4 border-t border-gray-200">
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-600">Active filters:</span>
        <div class="flex flex-wrap gap-2">
          <span v-if="localFilters.search" class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
            Search: "{{ localFilters.search }}"
          </span>
          <span v-if="localFilters.category !== 'All'" class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
            Category: {{ localFilters.category }}
          </span>
          <span v-if="localFilters.difficulty !== 'All'" class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
            Difficulty: {{ localFilters.difficulty }}
          </span>
          <span v-if="localFilters.maxCookTime < 120" class="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs">
            Max time: {{ localFilters.maxCookTime }}m
          </span>
          <button 
            @click="clearFilters"
            class="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-xs hover:bg-gray-300 transition-colors"
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import { MagnifyingGlassIcon, ClockIcon } from '@heroicons/vue/24/outline';
import type { RecipeFilters } from '../types/recipe';
import { categories, difficulties } from '../data/recipes';

const props = defineProps<{
  filters: RecipeFilters;
}>();

const emit = defineEmits<{
  'update-filters': [filters: RecipeFilters];
  search: [searchTerm: string];
}>();

const localFilters = ref<RecipeFilters>({ ...props.filters });

const hasActiveFilters = computed(() => {
  return localFilters.value.search !== '' ||
         localFilters.value.category !== 'All' ||
         localFilters.value.difficulty !== 'All' ||
         localFilters.value.maxCookTime < 120;
});

const handleSearchInput = () => {
  emit('update-filters', { ...localFilters.value });
};


const performSearch = () => {
  if (localFilters.value.search.trim()) {
    emit('search', localFilters.value.search);
  }
};

const updateFilters = () => {
  emit('update-filters', { ...localFilters.value });
};

const clearFilters = () => {
  localFilters.value = {
    search: '',
    category: 'All',
    difficulty: 'All',
    maxCookTime: 120
  };
  updateFilters();
};

// Watch for external filter changes
watch(() => props.filters, (newFilters) => {
  localFilters.value = { ...newFilters };
}, { deep: true });
</script>
<script setup lang="ts">
import { ClockIcon, UsersIcon } from '@heroicons/vue/24/outline';
import type { Recipe } from '../types/recipe';

defineProps<{
  recipe: Recipe;
  viewMode?: 'grid' | 'list';
}>();

defineEmits<{
  'view-recipe': [recipe: Recipe];
}>();

const difficultyColors = {
  Easy: 'bg-green-100 text-green-800',
  Medium: 'bg-yellow-100 text-yellow-800',
  Hard: 'bg-red-100 text-red-800',
};
</script>

<template>
  <div
    :class="[
      'bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden',
      viewMode === 'list'
        ? 'flex flex-row items-stretch hover:-translate-y-0'
        : 'transform hover:-translate-y-1 flex flex-col'
    ]"
  >
    <!-- IMAGE -->
    <div
      :class="[
        'relative overflow-hidden',
        viewMode === 'list' ? 'w-1/3 min-h-[180px]' : 'w-full h-48'
      ]"
    >
      <img 
        :src="recipe.image" 
        :alt="recipe.title"
        :class="[
          'object-cover transition-transform duration-300 hover:scale-105',
          viewMode === 'list' ? 'h-full w-full' : 'h-48 w-full'
        ]"
      />
      <!-- Category -->
      <div class="absolute top-3 right-3">
        <span class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {{ recipe.category }}
        </span>
      </div>
      <!-- Difficulty -->
      <div class="absolute top-3 left-3">
        <span 
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="difficultyColors[recipe.difficulty]"
        >
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>

    <!-- CONTENT -->
    <div
      :class="[
        'p-6 flex flex-col justify-between',
        viewMode === 'list' ? 'w-2/3' : 'w-full'
      ]"
    >
      <div>
        <h3 class="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {{ recipe.title }}
        </h3>
        <p class="text-gray-600 mb-4 text-sm line-clamp-2">
          {{ recipe.description }}
        </p>

        <div class="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div class="flex items-center space-x-4">
            <span class="flex items-center">
              <ClockIcon class="w-4 h-4 mr-1" />
              {{ recipe.cookTime + recipe.prepTime }}min
            </span>
            <span class="flex items-center">
              <UsersIcon class="w-4 h-4 mr-1" />
              {{ recipe.servings }}
            </span>
          </div>
        </div>

        <div class="flex flex-wrap gap-1 mb-4">
          <span 
            v-for="tag in recipe.tags.slice(0, 3)" 
            :key="tag"
            class="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <button @click="$emit('view-recipe', recipe)"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        Recipe Details
      </button>
    </div>
  </div>
</template>

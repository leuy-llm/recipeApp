<template>
  <div class="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
    <div class="relative overflow-hidden">
      <img 
        :src="recipe.image" 
        :alt="recipe.title"
        class="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
      />
      <div class="absolute top-3 right-3">
        <span class="bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-medium text-gray-700">
          {{ recipe.category }}
        </span>
      </div>
      <div class="absolute top-3 left-3">
        <span 
          class="px-2 py-1 rounded-full text-xs font-medium"
          :class="difficultyColors[recipe.difficulty]"
        >
          {{ recipe.difficulty }}
        </span>
      </div>
    </div>
    
    <div class="p-6">
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
      
      <button 
        @click="$emit('view-recipe', recipe)"
        class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
      >
        View Recipe
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ClockIcon, UsersIcon } from '@heroicons/vue/24/outline';
import type { Recipe } from '../types/recipe';

defineProps<{
  recipe: Recipe;
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
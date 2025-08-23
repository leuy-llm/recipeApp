<template>
  <div class="bg-white rounded-xl shadow-lg overflow-hidden">
    <div class="relative">
      <img 
        :src="recipe.image" 
        :alt="recipe.title"
        class="w-full h-64 md:h-96 object-cover"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      <div class="absolute bottom-6 left-6 text-white">
        <h1 class="text-3xl md:text-4xl font-bold mb-2">{{ recipe.title }}</h1>
        <p class="text-lg opacity-90">{{ recipe.description }}</p>
      </div>
      <button 
        @click="$emit('close')"
        class="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-colors"
      >
        <XMarkIcon class="w-6 h-6" />
      </button>
    </div>
    
    <div class="p-6 md:p-8">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <ClockIcon class="w-6 h-6 mx-auto mb-2 text-primary-600" />
          <p class="text-sm text-gray-600">Prep Time</p>
          <p class="font-bold text-gray-900">{{ recipe.prepTime }}min</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <FireIcon class="w-6 h-6 mx-auto mb-2 text-secondary-600" />
          <p class="text-sm text-gray-600">Cook Time</p>
          <p class="font-bold text-gray-900">{{ recipe.cookTime }}min</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <UsersIcon class="w-6 h-6 mx-auto mb-2 text-blue-600" />
          <p class="text-sm text-gray-600">Servings</p>
          <p class="font-bold text-gray-900">{{ recipe.servings }}</p>
        </div>
        <div class="text-center p-4 bg-gray-50 rounded-lg">
          <ChartBarIcon class="w-6 h-6 mx-auto mb-2 text-purple-600" />
          <p class="text-sm text-gray-600">Difficulty</p>
          <p class="font-bold text-gray-900">{{ recipe.difficulty }}</p>
        </div>
      </div>
      
      <div class="grid md:grid-cols-2 gap-8">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Ingredients</h2>
          <ul class="space-y-3">
            <li 
              v-for="ingredient in recipe.ingredients" 
              :key="ingredient.id"
              class="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div class="w-2 h-2 bg-primary-600 rounded-full mr-3"></div>
              <span class="font-medium text-gray-900">{{ ingredient.amount }} {{ ingredient.unit }}</span>
              <span class="ml-2 text-gray-600">{{ ingredient.name }}</span>
            </li>
          </ul>
        </div>
        
        <div>
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Instructions</h2>
          <ol class="space-y-4">
            <li 
              v-for="(instruction, index) in recipe.instructions" 
              :key="index"
              class="flex"
            >
              <span class="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-sm mr-4">
                {{ index + 1 }}
              </span>
              <p class="text-gray-700 leading-relaxed pt-1">{{ instruction }}</p>
            </li>
          </ol>
        </div>
      </div>
      
      <div class="mt-8 pt-6 border-t border-gray-200">
        <div class="flex flex-wrap gap-2 mb-4">
          <span 
            v-for="tag in recipe.tags" 
            :key="tag"
            class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium"
          >
            #{{ tag }}
          </span>
        </div>
        
        <!-- Additional Info -->
        <div v-if="recipe.area || recipe.source || recipe.youtube" class="space-y-2">
          <p v-if="recipe.area" class="text-sm text-gray-600">
            <span class="font-medium">Cuisine:</span> {{ recipe.area }}
          </p>
            <div v-if="recipe.source || recipe.youtube" class="flex flex-wrap gap-4">
                <a v-if="recipe.source" :href="recipe.source" target="_blank" class="text-primary-600 hover:text-primary-700 text-sm font-medium">
                    View Source
                </a>
                <a v-if="recipe.youtube" :href="recipe.youtube" target="_blank" 
                class="text-red-600 hover:text-red-700 text-sm font-medium">
                Watch Video
                </a>
            </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XMarkIcon, ClockIcon, FireIcon, UsersIcon, ChartBarIcon } from '@heroicons/vue/24/outline';
import type { Recipe } from '../types/recipe';

defineProps<{
  recipe: Recipe;
}>();

defineEmits<{
  close: [];
}>();
</script>
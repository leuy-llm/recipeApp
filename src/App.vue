<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1 class="text-2xl font-bold text-primary-600">RecipeBook</h1>
            </div>
          </div>
          
          <div class="flex items-center space-x-4">
            <button
              @click="loadRandomRecipes"
              class="bg-secondary-600 hover:bg-secondary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <span>🎲</span>
              <span>Random</span>
            </button>
            <!-- <button
              @click="showAddForm = true"
              class="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
            >
              <PlusIcon class="w-5 h-5" />
              <span>Add Recipe</span>
            </button> -->
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Hero Section -->
        <div class="text-center mb-12">
            <h2 class="text-4xl font-bold text-gray-900 mb-4">
                Discover Amazing Recipes
            </h2>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore thousands of delicious recipes from around the world, powered by TheMealDB.
            </p>
        </div>

      <!-- Search and Filters -->
        <SearchFilter :filters="filters" @update-filters="updateFilters" @search="handleSearch"/>
      <!-- Loading State -->
        <div v-if="loading" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>

      <!-- Results Info -->
        <div v-else class="flex items-center justify-between mb-6">
            <p class="text-gray-600">
            Showing {{ filteredRecipes.length }} recipes
            </p>
            <div class="flex items-center space-x-2">
            <button @click="viewMode = 'grid'" :class="viewMode === 'grid' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'"
                class="p-2 rounded-lg transition-colors"
            >
                <Squares2X2Icon class="w-5 h-5" />
            </button>
            <button
                @click="viewMode = 'list'"
                :class="viewMode === 'list' ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'"
                class="p-2 rounded-lg transition-colors"
            >
                <ListBulletIcon class="w-5 h-5" />
            </button>
            </div>
        </div>

      <!-- Recipe Grid/List -->
      <div v-if="!loading" :class="viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4 grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-6'">
        <div v-if="filteredRecipes.length === 0" class="col-span-full text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-600 mb-2">No recipes found</h3>
          <p class="text-gray-500">Try searching for something else or browse random recipes</p>
        </div>
        
        <RecipeCard
            v-for="recipe in filteredRecipes"
            :key="recipe.id"
            :recipe="recipe"
            :viewMode="viewMode"
            @view-recipe="viewRecipe"
            />

      </div>
    </main>

    <!-- Recipe Detail Modal -->
    <div v-if="selectedRecipe"
      class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
      @click.self="selectedRecipe = null"
    >
      <div class="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <RecipeDetail
          :recipe="selectedRecipe"
          @close="selectedRecipe = null"
        />
      </div>
    </div>

  </div>
    <Footer />
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { PlusIcon, Squares2X2Icon, ListBulletIcon } from '@heroicons/vue/24/outline';
import RecipeCard from './components/RecipeCard.vue';
import RecipeDetail from './components/RecipeDetail.vue';
import SearchFilter from './components/SearchFilter.vue';
import Footer from './components/Footer.vue';
import type { Recipe, RecipeFilters } from './types/recipe';
import { MealDBService } from './services/mealdb';

const recipes = ref<Recipe[]>([]);
const userRecipes = ref<Recipe[]>([]);
const selectedRecipe = ref<Recipe | null>(null);
const viewMode = ref<'grid' | 'list'>('grid');
const loading = ref(false);

const filters = ref<RecipeFilters>({
  search: '',
  category: 'All',
  difficulty: 'All',
  maxCookTime: 120
});

const allRecipes = computed(() => [...recipes.value, ...userRecipes.value]);

const filteredRecipes = computed(() => {
  return allRecipes.value.filter(recipe => {
    const matchesSearch = filters.value.search === '' || 
      recipe.title.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      recipe.description.toLowerCase().includes(filters.value.search.toLowerCase()) ||
      recipe.ingredients.some(ingredient => 
        ingredient.name.toLowerCase().includes(filters.value.search.toLowerCase())
      ) ||
      recipe.tags.some(tag => 
        tag.toLowerCase().includes(filters.value.search.toLowerCase())
      );

    const matchesCategory = filters.value.category === 'All' || 
      recipe.category === filters.value.category;

    const matchesDifficulty = filters.value.difficulty === 'All' || 
      recipe.difficulty === filters.value.difficulty;

    const matchesCookTime = filters.value.maxCookTime === 120 || 
      (recipe.cookTime + recipe.prepTime) <= filters.value.maxCookTime;

    return matchesSearch && matchesCategory && matchesDifficulty && matchesCookTime;
  });
});

const viewRecipe = (recipe: Recipe) => {
  selectedRecipe.value = recipe;
};

const updateFilters = (newFilters: RecipeFilters) => {
  filters.value = { ...newFilters };
};

const handleSearch = async (searchTerm: string) => {
  if (searchTerm.trim()) {
    loading.value = true;
    try {
      const searchResults = await MealDBService.searchMeals(searchTerm);
      recipes.value = searchResults;
    } finally {
      loading.value = false;
    }
  }
};

const loadRandomRecipes = async () => {
  loading.value = true;
  try {
    const randomRecipes = await MealDBService.getRandomMeals(12);
    recipes.value = randomRecipes;
    // Clear search when loading random recipes
    filters.value.search = '';
  } finally {
    loading.value = false;
  }
};

const addRecipe = (recipe: Recipe) => {
  userRecipes.value.unshift(recipe);
};

// Load initial random recipes
onMounted(() => {
  loadRandomRecipes();
});
</script>
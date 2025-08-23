export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  cookTime: number;
  prepTime: number;
  servings: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  ingredients: Ingredient[];
  instructions: string[];
  tags: string[];
  createdAt: Date;
  area?: string;
  source?: string;
  youtube?: string;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
}

export interface RecipeFilters {
  search: string;
  category: string;
  difficulty: string;
  maxCookTime: number;
}

// TheMealDB API response types
export interface MealDBMeal {
  idMeal: string;
  strMeal: string;
  strDrinkAlternate?: string;
  strCategory: string;
  strArea: string;
  strInstructions: string;
  strMealThumb: string;
  strTags?: string;
  strYoutube?: string;
  strSource?: string;
  dateModified?: string;
  [key: `strIngredient${number}`]: string;
  [key: `strMeasure${number}`]: string;
}

export interface MealDBResponse {
  meals: MealDBMeal[] | null;
}
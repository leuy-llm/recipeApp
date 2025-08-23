import type { Recipe, MealDBResponse, MealDBMeal, Ingredient } from '../types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export class MealDBService {
  static async searchMeals(query: string = ''): Promise<Recipe[]> {
    try {
      const url = query 
        ? `${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
        : `${BASE_URL}/search.php?s=`;
      
      const response = await fetch(url);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals) {
        return [];
      }
      
      return data.meals.map(meal => this.transformMealToRecipe(meal));
    } catch (error) {
      console.error('Error fetching meals:', error);
      return [];
    }
  }

  static async getMealsByCategory(category: string): Promise<Recipe[]> {
    try {
      const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals) {
        return [];
      }
      
      // Get detailed info for each meal
      const detailedMeals = await Promise.all(
        data.meals.slice(0, 12).map(meal => this.getMealById(meal.idMeal))
      );
      
      return detailedMeals.filter(meal => meal !== null) as Recipe[];
    } catch (error) {
      console.error('Error fetching meals by category:', error);
      return [];
    }
  }

  static async getMealById(id: string): Promise<Recipe | null> {
    try {
      const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
      const data: MealDBResponse = await response.json();
      
      if (!data.meals || data.meals.length === 0) {
        return null;
      }
      
      return this.transformMealToRecipe(data.meals[0]);
    } catch (error) {
      console.error('Error fetching meal by ID:', error);
      return null;
    }
  }

  static async getRandomMeals(count: number = 12): Promise<Recipe[]> {
    try {
      const promises = Array(count).fill(null).map(() => 
        fetch(`${BASE_URL}/random.php`).then(res => res.json())
      );
      
      const results = await Promise.all(promises);
      const meals = results
        .filter(data => data.meals && data.meals.length > 0)
        .map(data => data.meals[0]);
      
      return meals.map(meal => this.transformMealToRecipe(meal));
    } catch (error) {
      console.error('Error fetching random meals:', error);
      return [];
    }
  }

  private static transformMealToRecipe(meal: MealDBMeal): Recipe {
    const ingredients: Ingredient[] = [];
    
    // Extract ingredients and measurements
    for (let i = 1; i <= 20; i++) {
      const ingredient = meal[`strIngredient${i}` as keyof MealDBMeal] as string;
      const measure = meal[`strMeasure${i}` as keyof MealDBMeal] as string;
      
      if (ingredient && ingredient.trim()) {
        const measureParts = measure ? measure.trim().split(' ') : [''];
        const amount = measureParts[0] || '';
        const unit = measureParts.slice(1).join(' ') || '';
        
        ingredients.push({
          id: `${meal.idMeal}-${i}`,
          name: ingredient.trim(),
          amount: amount,
          unit: unit
        });
      }
    }

    // Parse instructions
    const instructions = meal.strInstructions
      .split(/\r?\n/)
      .filter(instruction => instruction.trim())
      .map(instruction => instruction.trim());

    // Parse tags
    const tags = meal.strTags 
      ? meal.strTags.split(',').map(tag => tag.trim().toLowerCase())
      : [];

    // Estimate difficulty based on number of ingredients and instructions
    const difficulty = this.estimateDifficulty(ingredients.length, instructions.length);

    // Estimate prep and cook time
    const { prepTime, cookTime } = this.estimateTimes(instructions);

    return {
      id: meal.idMeal,
      title: meal.strMeal,
      description: `A delicious ${meal.strArea} ${meal.strCategory.toLowerCase()} recipe.`,
      image: meal.strMealThumb,
      cookTime,
      prepTime,
      servings: 4, // Default serving size
      difficulty,
      category: meal.strCategory,
      ingredients,
      instructions,
      tags,
      createdAt: new Date(),
      area: meal.strArea,
      source: meal.strSource || undefined,
      youtube: meal.strYoutube || undefined
    };
  }

  private static estimateDifficulty(ingredientCount: number, instructionCount: number): Recipe['difficulty'] {
    const complexity = ingredientCount + instructionCount;
    if (complexity <= 10) return 'Easy';
    if (complexity <= 20) return 'Medium';
    return 'Hard';
  }

  private static estimateTimes(instructions: string[]): { prepTime: number; cookTime: number } {
    const totalSteps = instructions.length;
    const prepTime = Math.max(10, totalSteps * 3);
    const cookTime = Math.max(15, totalSteps * 5);
    
    return { prepTime, cookTime };
  }
}
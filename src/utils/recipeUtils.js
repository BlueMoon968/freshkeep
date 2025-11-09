const SPOONACULAR_API_KEY = import.meta.env.VITE_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com';

// Get recipes by ingredients
export async function getRecipesByIngredients(ingredients, number = 10) {
  try {
    const ingredientString = ingredients.join(',');
    const response = await fetch(
      `${BASE_URL}/recipes/findByIngredients?ingredients=${encodeURIComponent(ingredientString)}&number=${number}&ranking=2&ignorePantry=true&apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}

// Get recipe details
export async function getRecipeDetails(recipeId) {
  try {
    const response = await fetch(
      `${BASE_URL}/recipes/${recipeId}/information?apiKey=${SPOONACULAR_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('Failed to fetch recipe details');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
}

// Extract ingredient names from products
export function extractIngredientNames(products) {
  return products.map(product => {
    // Clean up product name (remove brand, packaging info, etc.)
    let name = product.name.toLowerCase();
    
    // Remove common words
    const wordsToRemove = ['organic', 'fresh', 'pack', 'bottle', 'can', 'jar', 'box'];
    wordsToRemove.forEach(word => {
      name = name.replace(new RegExp(`\\b${word}\\b`, 'gi'), '');
    });
    
    // Take first few words (usually the actual ingredient)
    const words = name.trim().split(' ').filter(w => w.length > 2);
    return words.slice(0, 2).join(' ').trim();
  }).filter(name => name.length > 0);
}

// Sort products by expiry (closest first)
export function sortProductsByExpiry(products) {
  return [...products].sort((a, b) => 
    new Date(a.expiryDate) - new Date(b.expiryDate)
  );
}
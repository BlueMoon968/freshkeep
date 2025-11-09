import { useState, useEffect } from 'react';
import { ChefHat, Clock, Users, ExternalLink, Loader, AlertCircle, Sparkles } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { getRecipesByIngredients, getRecipeDetails, extractIngredientNames, sortProductsByExpiry } from '../utils/recipeUtils';
import { getDaysUntilExpiry } from '../utils/productUtils';

export default function RecipesView() {
  const { products } = useApp();
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showExpiringOnly, setShowExpiringOnly] = useState(true);

  useEffect(() => {
    if (products.length > 0) {
      fetchRecipes();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, showExpiringOnly]);

  const fetchRecipes = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const productsToUse = showExpiringOnly
        ? sortProductsByExpiry(products).filter(p => getDaysUntilExpiry(p.expiryDate) <= 7)
        : products;

      if (productsToUse.length === 0) {
        setRecipes([]);
        setIsLoading(false);
        return;
      }

      const ingredients = extractIngredientNames(productsToUse);

      if (ingredients.length === 0) {
        setError('Could not extract ingredients from products');
        setIsLoading(false);
        return;
      }

      const recipesData = await getRecipesByIngredients(ingredients, 12);
      setRecipes(recipesData);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRecipeClick = async (recipe) => {
    setIsLoading(true);
    try {
      const details = await getRecipeDetails(recipe.id);
      setSelectedRecipe(details);
    } catch (err) {
      console.error('Error loading recipe details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-20 animate-fade-in">
        <div className="w-24 h-24 mx-auto mb-6 text-gray-300">
          <ChefHat className="w-full h-full" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Products Yet</h2>
        <p className="text-gray-600">Add products to your fridge to get recipe suggestions!</p>
      </div>
    );
  }

  const expiringCount = products.filter(p => getDaysUntilExpiry(p.expiryDate) <= 7).length;

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="card">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <ChefHat className="w-6 h-6 text-indigo-500" />
                Recipe Suggestions
              </h2>
              <p className="text-sm text-gray-600 mt-1">Based on your ingredients</p>
            </div>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>

          {/* Toggle */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="expiringToggle"
              checked={showExpiringOnly}
              onChange={(e) => setShowExpiringOnly(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="expiringToggle" className="text-sm font-medium text-gray-700 cursor-pointer">
              Show recipes for expiring products only
              {expiringCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
                  {expiringCount} expiring
                </span>
              )}
            </label>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && !selectedRecipe && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 text-indigo-500 animate-spin" />
          <span className="ml-3 text-gray-600">Finding delicious recipes...</span>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="card">
          <div className="p-6">
            <div className="flex items-center gap-3 text-red-600">
              <AlertCircle className="w-5 h-5" />
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Recipe Grid */}
      {!isLoading && !error && recipes.length > 0 && !selectedRecipe && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {recipes.map((recipe) => (
            <div
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe)}
              className="card cursor-pointer hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-40">
                <img src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <span className="text-green-600">{recipe.usedIngredientCount}</span>
                  <span className="text-gray-400">/</span>
                  <span className="text-gray-600">
                    {recipe.usedIngredientCount + recipe.missedIngredientCount}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{recipe.title}</h3>
                <div className="flex items-center justify-between text-xs text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="text-green-600 font-medium">✓ {recipe.usedIngredientCount} have</span>
                  </span>
                  {recipe.missedIngredientCount > 0 && (
                    <span className="text-orange-600">+{recipe.missedIngredientCount} needed</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* No Recipes */}
      {!isLoading && !error && recipes.length === 0 && !selectedRecipe && (
        <div className="card">
          <div className="p-12 text-center">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-800 mb-2">No Recipes Found</h3>
            <p className="text-gray-600 text-sm">
              {showExpiringOnly
                ? 'No expiring products found. Try showing all recipes!'
                : 'Could not find recipes with your ingredients.'}
            </p>
          </div>
        </div>
      )}

      {/* Recipe Detail Modal */}
      {selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white z-10 p-4 border-b flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">Recipe Details</h2>
              <button
                onClick={() => setSelectedRecipe(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ExternalLink className="w-5 h-5 text-gray-600 rotate-45" />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedRecipe.image}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-xl mb-6"
              />

              <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedRecipe.title}</h3>

              {/* Info */}
              <div className="flex flex-wrap gap-4 mb-6">
                {selectedRecipe.readyInMinutes && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm">{selectedRecipe.readyInMinutes} min</span>
                  </div>
                )}
                {selectedRecipe.servings && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{selectedRecipe.servings} servings</span>
                  </div>
                )}
              </div>

              {/* Summary */}
              {selectedRecipe.summary && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">About</h4>
                  <div
                    className="text-sm text-gray-600"
                    dangerouslySetInnerHTML={{
                      __html: selectedRecipe.summary.split('.')[0] + '.',
                    }}
                  />
                </div>
              )}

              {/* Ingredients */}
              {selectedRecipe.extendedIngredients && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Ingredients</h4>
                  <ul className="space-y-2">
                    {selectedRecipe.extendedIngredients.map((ing, idx) => (
                      <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                        <span className="text-indigo-500 mt-1">•</span>
                        <span>{ing.original}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Instructions */}
              {selectedRecipe.instructions && (
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
                  <div
                    className="text-sm text-gray-600 space-y-2"
                    dangerouslySetInnerHTML={{ __html: selectedRecipe.instructions }}
                  />
                </div>
              )}

              {/* External Link */}
              {selectedRecipe.sourceUrl && (
                <a
                  href={selectedRecipe.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary w-full"
                >
                  <ExternalLink className="w-5 h-5" />
                  <span>View Full Recipe</span>
                </a>
              )}
            </div> 
          </div>   
        </div>     
      )}
    </div>
  );
}

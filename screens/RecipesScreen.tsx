
import React, { useState } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { generateRecipesWithGemini } from '../services/geminiService';
import { Recipe } from '../types';

const RecipesScreen: React.FC = () => {
    const [ingredients, setIngredients] = useState<string>('');
    const [recipes, setRecipes] = useState<Recipe[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const handleGenerateRecipes = async () => {
        const ingredientList = ingredients.split(',').map(i => i.trim()).filter(i => i);
        if (ingredientList.length === 0) {
            setError('Please enter at least one ingredient.');
            return;
        }

        setIsLoading(true);
        setError('');
        setRecipes([]);
        try {
            const result = await generateRecipesWithGemini(ingredientList);
            setRecipes(result);
        } catch (err) {
            setError('Failed to generate recipes. Please try again.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="text-center">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">AI Recipe Generator</h1>
                <p className="text-emerald-600 dark:text-emerald-200">Enter ingredients you have to get recipe ideas.</p>
            </div>

            <Card>
                <div className="space-y-4">
                    <textarea
                        value={ingredients}
                        onChange={(e) => setIngredients(e.target.value)}
                        placeholder="e.g., chicken breast, tomatoes, rice"
                        className="w-full bg-gray-200/50 dark:bg-gray-900/50 border border-gray-300 dark:border-gray-500 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition text-gray-800 dark:text-white"
                        rows={3}
                    />
                    <button
                        onClick={handleGenerateRecipes}
                        className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Generating...' : 'Generate Recipes'}
                    </button>
                </div>
            </Card>

            {isLoading && <Loader text="Asking the chef..." />}
            {error && <p className="text-red-500 dark:text-red-400 text-center bg-red-200 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}

            <div className="space-y-6">
                {recipes.map((recipe, index) => (
                    <Card key={index}>
                        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-2">{recipe.title}</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">Prep time: {recipe.prepTime}</p>
                        
                        <h3 className="font-semibold mb-2">Ingredients:</h3>
                        <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 mb-4">
                            {recipe.ingredients.map((ing, i) => <li key={i}>{ing}</li>)}
                        </ul>

                        <h3 className="font-semibold mb-2">Instructions:</h3>
                        <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
                            {recipe.instructions.map((step, i) => <li key={i}>{step}</li>)}
                        </ol>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default RecipesScreen;

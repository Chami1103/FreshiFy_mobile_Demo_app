import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Recipe } from '../types';

// FIX: Added helper function to convert file to base64 string
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            if (reader.result) {
                const base64String = (reader.result as string).split(',')[1];
                resolve(base64String);
            } else {
                reject(new Error("FileReader result is null"));
            }
        };
        reader.onerror = error => reject(error);
    });
};

export const generateRecipesWithGemini = async (ingredients: string[]): Promise<Recipe[]> => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    
    const prompt = `You are a creative chef for the FreshiFy app. 
    Given the following ingredients, generate 3 simple and delicious recipes.
    Ingredients: ${ingredients.join(', ')}.
    Please ensure the output is a valid JSON array.`;

    try {
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING },
                            ingredients: { type: Type.ARRAY, items: { type: Type.STRING } },
                            instructions: { type: Type.ARRAY, items: { type: Type.STRING } },
                            prepTime: { type: Type.STRING, description: "e.g., '25 minutes'" }
                        },
                        required: ["title", "ingredients", "instructions", "prepTime"]
                    },
                },
            },
        });
        
        const jsonStr = response.text.trim();
        return JSON.parse(jsonStr) as Recipe[];

    } catch (error) {
        console.error("Error generating recipes with Gemini:", error);
        return [
            {
                title: "Error Generating Recipe",
                ingredients: ["Could not connect to Gemini."],
                instructions: ["Please check your API key and network connection and try again."],
                prepTime: "N/A"
            }
        ];
    }
};

// FIX: Added generateVideoWithVeo function to fix missing export error.
export const generateVideoWithVeo = async (imageFile: File, prompt: string, aspectRatio: '16:9' | '9:16'): Promise<string> => {
    // A new instance is created here to ensure the latest API key is used.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

    const imageBytes = await fileToBase64(imageFile);

    let operation = await ai.models.generateVideos({
        model: 'veo-3.1-fast-generate-preview',
        prompt: prompt,
        image: {
            imageBytes: imageBytes,
            mimeType: imageFile.type,
        },
        config: {
            numberOfVideos: 1,
            resolution: '720p', // Sticking with 720p for faster generation
            aspectRatio: aspectRatio,
        }
    });

    while (!operation.done) {
        // Poll every 10 seconds
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error("Video generation succeeded but no download link was provided.");
    }

    // Fetch the video data and create a blob URL
    // The API key is required to download the video
    const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!response.ok) {
        const errorBody = await response.text();
        console.error("Failed to fetch video data. Status:", response.status, "Body:", errorBody);
        // Check for specific API key error from VeoScreen
        if (errorBody.includes("Requested entity was not found")) {
            throw new Error("Requested entity was not found.");
        }
        throw new Error(`Failed to fetch video data: ${response.statusText}`);
    }
    const videoBlob = await response.blob();
    return URL.createObjectURL(videoBlob);
};

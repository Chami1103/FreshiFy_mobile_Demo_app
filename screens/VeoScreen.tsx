
import React, { useState, useEffect, useRef, useCallback } from 'react';
import Card from '../components/Card';
import Loader from '../components/Loader';
import { generateVideoWithVeo } from '../services/geminiService';
import { UploadCloudIcon, KeyRoundIcon } from '../components/icons/Icons';

// The type for window.aistudio is expected to be provided by the execution environment.

const loadingMessages = [
    "Warming up the video generators...",
    "This can take a few minutes...",
    "Composing shots and scenes...",
    "Applying cinematic magic...",
    "Almost there, rendering final frames..."
];

const VeoScreen: React.FC = () => {
  const [apiKeySelected, setApiKeySelected] = useState<boolean | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState(loadingMessages[0]);
  const [error, setError] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageIntervalRef = useRef<number | null>(null);

  const checkApiKey = useCallback(async () => {
    if (window.aistudio) {
      try {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setApiKeySelected(hasKey);
      } catch (e) {
        console.error("Error checking for API key", e);
        setApiKeySelected(false);
      }
    } else {
      console.warn("aistudio object not found. Running in dev mode.");
      setApiKeySelected(true); // Default to true for local dev
    }
  }, []);

  useEffect(() => {
    checkApiKey();
  }, [checkApiKey]);

  useEffect(() => {
    if (isLoading) {
      let messageIndex = 0;
      messageIntervalRef.current = window.setInterval(() => {
        messageIndex = (messageIndex + 1) % loadingMessages.length;
        setLoadingMessage(loadingMessages[messageIndex]);
      }, 5000);
    } else {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    }
    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
    };
  }, [isLoading]);

  const handleSelectKey = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Assume key selection is successful to avoid race conditions.
      setApiKeySelected(true);
    }
  };
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setGeneratedVideoUrl(null);
      setError('');
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!imageFile || !prompt) {
      setError("Please upload an image and enter a prompt.");
      return;
    }
    setIsLoading(true);
    setError('');
    setGeneratedVideoUrl(null);
    setLoadingMessage(loadingMessages[0]);

    try {
      const videoUrl = await generateVideoWithVeo(imageFile, prompt, aspectRatio);
      setGeneratedVideoUrl(videoUrl);
    } catch (err: any) {
      let errorMessage = "Video generation failed. Please try again.";
      if (err.message && err.message.includes("Requested entity was not found")) {
          errorMessage = "API Key not found or invalid. Please select your API key again.";
          setApiKeySelected(false);
      }
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };
  
  if (apiKeySelected === null) {
      return <div className="flex justify-center items-center h-64"><Loader text="Checking API Key..." /></div>;
  }
  
  if (!apiKeySelected) {
    return (
      <div className="space-y-6 animate-fade-in text-center">
        <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Veo Video Generation</h1>
        <Card>
          <KeyRoundIcon className="w-16 h-16 mx-auto text-yellow-500 dark:text-yellow-400 mb-4" />
          <h2 className="text-xl font-semibold mb-2">API Key Required</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">To use Veo video generation, you need to select an API key. This feature may incur costs.</p>
           <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">For more information, see the <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="underline text-emerald-500 dark:text-emerald-400">billing documentation</a>.</p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors"
          >
            Select API Key
          </button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">Veo Video Generation</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">1. Upload Image</h2>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="w-full border-2 border-dashed border-gray-400 dark:border-gray-600 rounded-lg p-8 flex flex-col items-center justify-center text-gray-500 dark:text-gray-400 hover:border-emerald-500 dark:hover:border-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            <UploadCloudIcon className="w-12 h-12 mb-2" />
            <span>{imagePreview ? 'Change Starting Image' : 'Click to Upload'}</span>
          </button>
          {imagePreview && (
            <div className="mt-4">
              <img src={imagePreview} alt="Upload preview" className="rounded-lg max-h-48 w-auto mx-auto" />
            </div>
          )}
        </Card>

        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">2. Describe the Video</h2>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A time-lapse of this apple ripening..."
            className="w-full bg-gray-200/50 dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition"
            rows={3}
          />
        </Card>
        
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">3. Select Aspect Ratio</h2>
          <div className="flex gap-4">
              <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${aspectRatio === '16:9' ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-900/50' : 'border-gray-300 dark:border-gray-700'}`}>
                  <input type="radio" name="aspectRatio" value="16:9" checked={aspectRatio === '16:9'} onChange={() => setAspectRatio('16:9')} className="sr-only"/>
                  <div className="text-center">Landscape (16:9)</div>
              </label>
              <label className={`flex-1 p-4 border-2 rounded-lg cursor-pointer transition ${aspectRatio === '9:16' ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-900/50' : 'border-gray-300 dark:border-gray-700'}`}>
                  <input type="radio" name="aspectRatio" value="9:16" checked={aspectRatio === '9:16'} onChange={() => setAspectRatio('9:16')} className="sr-only"/>
                  <div className="text-center">Portrait (9:16)</div>
              </label>
          </div>
        </Card>

        <button 
          type="submit" 
          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading || !imageFile || !prompt}
        >
          {isLoading ? 'Generating...' : 'Generate Video'}
        </button>
      </form>
      
      {isLoading && <Loader text={loadingMessage} />}
      
      {error && <p className="text-red-500 dark:text-red-400 text-center bg-red-200 dark:bg-red-900/50 p-3 rounded-lg">{error}</p>}

      {generatedVideoUrl && (
        <Card>
          <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-400 mb-4">Generated Video</h2>
          <video controls src={generatedVideoUrl} className="w-full rounded-lg" />
        </Card>
      )}
    </div>
  );
};

export default VeoScreen;
import React, { useState, useRef } from 'react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import { UploadCloudIcon, CameraIcon, ArrowLeftIcon, XIcon } from '../../components/icons/Icons';
import { analyzeImages } from '../../services/apiService';
import { AnalyzedImage, PredictionCardData } from '../../types';
import { useNotifications } from '../../contexts/NotificationContext';
import StatusBadge from '../../components/StatusBadge';

const BackButton = ({ onClick }: { onClick: () => void }) => (
    <button onClick={onClick} className="flex items-center gap-2 text-emerald-600 dark:text-emerald-300 hover:text-emerald-500 dark:hover:text-emerald-200 mb-4 transition-colors" aria-label="Go back">
      <ArrowLeftIcon className="w-5 h-5" /> Back
    </button>
);

const CameraScanView: React.FC<{ goBack: () => void }> = ({ goBack }) => {
  const { addNotification } = useNotifications();
  const [analyzedImages, setAnalyzedImages] = useState<AnalyzedImage[]>([]);
  const [predictions, setPredictions] = useState<PredictionCardData[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analysisError, setAnalysisError] = useState<string>('');

  const multiUploadInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFilesSelected = (files: FileList | null) => {
    if (!files) return;
    const newImages: AnalyzedImage[] = Array.from(files)
      .slice(0, 4 - analyzedImages.length)
      .map(file => ({
        id: `${file.name}-${file.lastModified}-${Math.random()}`,
        file,
        preview: URL.createObjectURL(file),
      }));
    setAnalyzedImages(prev => [...prev, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setAnalyzedImages(prev => {
        const imageToRemove = prev.find(img => img.id === id);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
        return prev.filter(img => img.id !== id);
    });
  };
  
  const handleAnalyze = async () => {
    if (analyzedImages.length === 0) {
      setAnalysisError("Please select images to analyze.");
      return;
    }
    setIsAnalyzing(true);
    setAnalysisError('');
    setPredictions([]);
    
    try {
      const files = analyzedImages.map(img => img.file);
      const results = await analyzeImages(files);
      
      const newPredictions: PredictionCardData[] = analyzedImages.map((analyzedImg, index) => {
          const result = results[index] || { id: analyzedImg.id, foodName: 'Unknown', status: 'Spoiled' };
          if(result.status === 'Spoiled') {
             addNotification({ type: 'alert', title: 'Spoiled Item Detected', message: `${result.foodName} has been identified as spoiled.` });
          }
          return {
            ...result,
            imagePreview: analyzedImg.preview,
            timestamp: new Date().toLocaleString(),
          }
      });
      
      setPredictions(newPredictions);
      setAnalyzedImages([]); // Clear previews after analysis
    } catch (err) {
      setAnalysisError("Failed to analyze images. Please try again.");
      addNotification({ type: 'error', title: 'Analysis Failed', message: 'The image analysis could not be completed.' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <BackButton onClick={goBack} />

      <Card>
        <h2 className="text-xl font-semibold text-yellow-600 dark:text-yellow-300 mb-4">Batch Image Analysis</h2>
        <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={(e) => {handleFilesSelected(e.target.files); e.target.value = '';}} className="hidden" />
        <input type="file" accept="image/*" multiple ref={multiUploadInputRef} onChange={(e) => {handleFilesSelected(e.target.files); e.target.value = '';}} className="hidden" />

        <div className="flex gap-4 mb-4">
          <button
            onClick={() => cameraInputRef.current?.click()}
            disabled={analyzedImages.length >= 4}
            className="flex-1 flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <CameraIcon className="w-5 h-5" />
            Scan Photo
          </button>
          <button
            onClick={() => multiUploadInputRef.current?.click()}
            disabled={analyzedImages.length >= 4}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadCloudIcon className="w-5 h-5" />
            Upload Images
          </button>
        </div>

        {analyzedImages.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {analyzedImages.map(img => (
              <div key={img.id} className="relative aspect-square">
                <img src={img.preview} alt="Preview" className="w-full h-full object-cover rounded-md" />
                <button onClick={() => handleRemoveImage(img.id)} className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/80 transition-opacity" aria-label="Remove image">
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
        {analyzedImages.length > 0 && (
           <button
              onClick={handleAnalyze}
              disabled={isAnalyzing}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
           >
              {isAnalyzing ? 'Analyzing...' : `Analyze ${analyzedImages.length} Image(s)`}
          </button>
        )}
      </Card>
      
      {isAnalyzing && <div className="flex justify-center"><Loader text="Analyzing images..." /></div>}
      {analysisError && <p className="text-red-500 dark:text-red-400 text-center bg-red-200 dark:bg-red-900/50 p-3 rounded-lg">{analysisError}</p>}
      
      {predictions.length > 0 && (
        <div className="space-y-4">
           <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Analysis Results</h2>
           {predictions.map(pred => (
            <Card key={pred.id}>
              <div className="flex gap-4 items-center">
                <img src={pred.imagePreview} alt={pred.foodName} className="w-24 h-24 object-cover rounded-md flex-shrink-0"/>
                <div className="flex-grow">
                  <h3 className="font-bold text-xl mb-2">{pred.foodName}</h3>
                  <StatusBadge status={pred.status} />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">{pred.timestamp}</p>
                </div>
              </div>
            </Card>
           ))}
        </div>
      )}
    </div>
  );
};

export default CameraScanView;

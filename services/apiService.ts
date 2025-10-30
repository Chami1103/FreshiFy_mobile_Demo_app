import { mainAPI, sensorAPI, imageAPI } from './api';
import { API_CONFIG } from '../config';
import { StatsData, HistoryData, LastSensorData, LastImageData, PredictionHistoryItem, ImagePredictionResult, BlogPost, Notification } from '../types';

export const getStats = async (): Promise<StatsData> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.STATS);
    return response.data;
};

export const getHistory = async (): Promise<HistoryData[]> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.HISTORY);
    return response.data;
};

export const getLastSensorScan = async (): Promise<LastSensorData> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.LAST_SENSOR);
    return response.data;
};

export const getLastImageScan = async (): Promise<LastImageData> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.LAST_IMAGE);
    return response.data;
};

export const getPredictionHistory = async (): Promise<PredictionHistoryItem[]> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.PREDICTION_HISTORY);
    return response.data;
};

export const startSensorScan = async (): Promise<LastSensorData> => {
    const response = await sensorAPI.post(API_CONFIG.ENDPOINTS.SENSOR_SCAN);
    return response.data;
};

export const analyzeImages = async (images: File[]): Promise<ImagePredictionResult[]> => {
    const formData = new FormData();
    images.forEach(imageFile => {
        formData.append('images', imageFile);
    });
    
    const response = await imageAPI.post(API_CONFIG.ENDPOINTS.ANALYZE_IMAGES, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};

export const getBlogPosts = async (): Promise<BlogPost[]> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.BLOG_POSTS);
    return response.data;
}

export const getNotifications = async (): Promise<Notification[]> => {
    const response = await mainAPI.get(API_CONFIG.ENDPOINTS.NOTIFICATIONS);
    return response.data;
}

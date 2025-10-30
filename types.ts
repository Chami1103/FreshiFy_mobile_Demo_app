import React from 'react';

// Navigation
export type Screen = 'home' | 'detection' | 'recipes' | 'notifications' | 'blog' | 'profile';

export interface NavItem {
  name: Screen;
  label: string;
  icon: React.FC<{ className?: string }>;
}

// User Profile
export interface UserProfile {
  name: string;
  age: string;
  preferences: string;
  allergies: string;
  healthStatus: string;
  familyMember: string;
}

// API Data
export interface StatsData {
  totalScans: number;
  fresh: number;
  spoiled: number;
  freshnessPercentage: number;
}

export interface HistoryData {
  date: string;
  nh3_avg: number;
  fresh: number;
  spoiled: number;
  sensorScans: number;
  cameraScans: number;
}

export interface BlogPost {
  id: string;
  title: string;
  preview: string;
  imageUrl: string;
  author: string;
  date: string;
}

export interface Notification {
  id: string;
  icon: 'alert' | 'info' | 'food';
  title: string;
  timestamp: string;
}

export interface AppNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'alert';
  title: string;
  message: string;
}

// Gemini
export interface Recipe {
    title: string;
    ingredients: string[];
    instructions: string[];
    prepTime: string;
}

export interface LastSensorData {
  foodName: string;
  status: 'Fresh' | 'Spoiled';
  nh3: number;
  humidity: number;
  temperature: number;
  timestamp: string;
}

export interface LastImageData {
  foodName: string;
  imageUrl: string;
  status: 'Fresh' | 'Spoiled';
  timestamp: string;
}

export interface CostItem {
  id: string;
  name: string;
  amount: number;
}

// Multi-image Analysis Types
export interface AnalyzedImage {
  id: string;
  file: File;
  preview: string;
}

export interface ImagePredictionResult {
  id: string;
  foodName: string;
  status: 'Fresh' | 'Spoiled';
}

export interface PredictionCardData extends ImagePredictionResult {
  imagePreview: string;
  timestamp: string;
}

// History Type
export type ScanType = 'sensor' | 'camera';

export interface PredictionHistoryItem {
    id: string;
    type: ScanType;
    foodName: string;
    status: 'Fresh' | 'Spoiled';
    timestamp: string;
    imageUrl?: string; // Optional for camera scans
    nh3?: number; // Optional for sensor scans
}
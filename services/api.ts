
import axios from 'axios';
import { API_CONFIG } from '../config';

export const sensorAPI = axios.create({ baseURL: API_CONFIG.SENSOR_BASE_URL });
export const imageAPI = axios.create({ baseURL: API_CONFIG.IMAGE_BASE_URL });
export const mainAPI = axios.create({ baseURL: API_CONFIG.MAIN_BASE_URL });

const apis = [sensorAPI, imageAPI, mainAPI];

apis.forEach(api => {
  api.interceptors.response.use(
    res => res,
    async err => {
      const config = err.config;
      // Implement a simple retry mechanism for network errors
      if (config && !config._retry && err.code !== 'ECONNABORTED') {
        config._retry = true;
        console.log(`Retrying request to ${config.url}`);
        return api(config);
      }
      // Log the error and let the caller handle the undefined response.
      console.error(`API call to ${err.config.baseURL}${err.config.url} failed: ${err.message}`);
      return Promise.reject(err);
    }
  );
});

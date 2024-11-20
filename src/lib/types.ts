export interface WaterLevelData {
  level: number;
  timestamp: string;
  status: 'safe' | 'warning' | 'danger';
}

export interface WeatherInfo {
  temperature: number;
  condition: string;
  rainfall: number;
}

export interface HistoricalData {
  timestamp: string;
  level: number;
}
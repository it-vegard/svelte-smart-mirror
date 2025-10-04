import type { WeatherSymbolKeyT } from "./utils/weather-utils";

type NowCastDataT = {
    properties: {
      meta: {
        radar_coverage: string;
      };
      timeseries: {
        time: string;
        data: {
		  next_1_hours: {
            details: {
              precipitation_amount: number;
            };
            summary: {
              symbol_code: WeatherSymbolKeyT;
            };
          };
          instant: {
            details: {
              air_temperature: number;
              weather_symbol: WeatherSymbolKeyT;
            };
          };
        };
      }[];
    };
  };

  type LocationForecastDataT = {
    properties: {
      timeseries: {
        time: string;
        data: {
          instant: {
            details: {
              air_temperature: number;
            };
          };
          next_1_hours?: {
            summary: {
              symbol_code: WeatherSymbolKeyT;
            };
            details: {
              precipitation_amount: number;
            };
          };
        };
      }[];
    };
  };

const homeLat = 59.88309870407893;
const homeLon = 10.808853854138906;

const getYrUrl = (typeOfForecast: string) => `https://api.met.no/weatherapi/${typeOfForecast}/2.0/complete.json`;

const fetchForecast = async <T>(typeOfForecast: string): Promise<T> => {
    const response = await fetch(`${getYrUrl(typeOfForecast)}?lat=${homeLat}&lon=${homeLon}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
};

const fetchNowCast = async (): Promise<NowCastDataT> => fetchForecast<NowCastDataT>('nowcast');
const fetchLocationForecast = async (): Promise<LocationForecastDataT> => fetchForecast<LocationForecastDataT>('locationforecast');

export { fetchForecast, fetchNowCast, fetchLocationForecast };
export type { NowCastDataT, LocationForecastDataT };
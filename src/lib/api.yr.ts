const homeLat = 59.88309870407893;
const homeLon = 10.808853854138906;

const getYrUrl = (typeOfForecast: string) => `https://api.met.no/weatherapi/${typeOfForecast}/2.0/complete.json`;

const fetchForecast = async (typeOfForecast: string) => {
    const response = await fetch(`${getYrUrl(typeOfForecast)}?lat=${homeLat}&lon=${homeLon}`);
    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }
    return await response.json();
};

const fetchNowCast = async () => fetchForecast('nowcast');
const fetchForecastData = async () => fetchForecast('locationforecast');

export { fetchForecast, fetchNowCast, fetchForecastData };
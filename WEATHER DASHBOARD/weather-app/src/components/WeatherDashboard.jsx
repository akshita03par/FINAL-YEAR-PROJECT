import React, { useEffect, useMemo, useState } from 'react';

const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

const getIconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${icon}@2x.png`;

const formatDate = (date) =>
  date.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

const formatTime = (date) =>
  date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

const formatCityTime = (timestamp, timezoneOffset = 0) => {
  const cityDate = new Date((timestamp + timezoneOffset) * 1000);

  return cityDate.toLocaleTimeString('en-IN', {
    timeZone: 'UTC',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};

const getLocationLabel = (location) => {
  if (!location) return 'Search City';

  return [location.name, location.state, location.country]
    .filter(Boolean)
    .join(', ');
};

const getDailyForecast = (forecastList = []) => {
  const grouped = {};

  forecastList.forEach((item) => {
    const date = item.dt_txt.split(' ')[0];

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(item);
  });

  return Object.entries(grouped)
    .slice(0, 5)
    .map(([date, items]) => {
      const maxTemp = Math.max(...items.map((item) => item.main.temp_max));
      const noonItem =
        items.find((item) => item.dt_txt.includes('12:00:00')) || items[0];

      return {
        day: new Date(date).toLocaleDateString('en-IN', {
          weekday: 'short',
        }),
        temp: maxTemp,
        icon: noonItem.weather[0].icon,
      };
    });
};

const ForecastItem = ({ label, temp, icon }) => (
  <div className="flex min-w-[48px] flex-col items-center">
    <span className="mb-2 text-sm font-medium opacity-80">{label}</span>
    <img
      src={getIconUrl(icon)}
      alt=""
      className="mb-1 h-8 w-8 object-contain"
    />
    <span className="text-base font-semibold">{Math.round(temp)}°</span>
  </div>
);

const StatRow = ({ label, value }) => (
  <div className="flex items-center justify-between border-b border-white/10 pb-3">
    <span className="font-light opacity-80">{label}</span>
    <span className="font-semibold">{value}</span>
  </div>
);

const WeatherDashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchCity, setSearchCity] = useState('');
  const [location, setLocation] = useState(null);
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchWeather = async (city) => {
    if (!API_KEY) {
      setError('OpenWeatherMap API key is missing');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(
        city
      )}&limit=5&appid=${API_KEY}`;

      const geoResponse = await fetch(geoUrl);
      const geoData = await geoResponse.json();

      if (!geoResponse.ok || !geoData.length) {
        throw new Error('City not found');
      }

      const place = geoData[0];

      const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${place.lat}&lon=${place.lon}&units=metric&appid=${API_KEY}`;

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${place.lat}&lon=${place.lon}&units=metric&appid=${API_KEY}`;

      const [currentResponse, forecastResponse] = await Promise.all([
        fetch(currentUrl),
        fetch(forecastUrl),
      ]);

      const currentData = await currentResponse.json();
      const forecast = await forecastResponse.json();

      if (!currentResponse.ok) {
        throw new Error(currentData.message || 'Unable to fetch weather');
      }

      if (!forecastResponse.ok) {
        throw new Error(forecast.message || 'Unable to fetch forecast');
      }

      setLocation(place);
      setSearchCity(place.name);
      setCurrentWeather(currentData);
      setForecastData(forecast);
    } catch (err) {
      setError(err.message || 'Unable to fetch weather data');
      setCurrentWeather(null);
      setForecastData(null);
      setLocation(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();

    const city = searchCity.trim();

    if (city) {
      fetchWeather(city);
    }
  };

  const dailyForecast = useMemo(() => {
    return getDailyForecast(forecastData?.list);
  }, [forecastData]);

  const hourlyForecast = useMemo(() => {
    if (!currentWeather || !forecastData?.list) return [];

    const timezoneOffset = forecastData.city?.timezone || 0;

    const upcomingForecast = forecastData.list.slice(0, 4).map((item) => ({
      time: formatCityTime(item.dt, timezoneOffset),
      temp: item.main.temp,
      icon: item.weather[0].icon,
    }));

    return [
      {
        time: 'Now',
        temp: currentWeather.main.temp,
        icon: currentWeather.weather[0].icon,
      },
      ...upcomingForecast,
    ];
  }, [currentWeather, forecastData]);

  const stats = currentWeather
    ? [
        ['Wind', `${Math.round(currentWeather.wind.speed * 3.6)} km/h`],
        ['Humidity', `${currentWeather.main.humidity}%`],
        ['Feels Like', `${Math.round(currentWeather.main.feels_like)}°`],
        ['Atm Pressure', `${currentWeather.main.pressure} hPa`],
        [
          'Visibility',
          `${Math.round((currentWeather.visibility || 0) / 1000)} km`,
        ],
        [
          'Sunrise',
          formatCityTime(currentWeather.sys.sunrise, currentWeather.timezone),
        ],
        [
          'Sunset',
          formatCityTime(currentWeather.sys.sunset, currentWeather.timezone),
        ],
      ]
    : [];

  return (
    <main className="h-screen overflow-hidden bg-slate-900 p-4 font-sans text-white md:p-6">
      <div className="mx-auto mb-4 max-w-4xl text-center">
        <h1 className="text-2xl font-bold md:text-3xl">Weather Dashboard</h1>
        <p className="mt-1 text-sm text-slate-300">
          Search any city and view live weather updates
        </p>
      </div>

      <section className="mx-auto grid h-[calc(100vh-96px)] w-full max-w-4xl grid-cols-1 overflow-hidden rounded-[2rem] text-white shadow-2xl md:grid-cols-2">
        <div className="flex min-h-0 flex-col justify-between bg-gradient-to-b from-[#0f2027] via-[#203a43] to-[#1a5b56] p-7 sm:p-8">
          <header className="text-center md:text-left">
            <p className="text-base font-light tracking-wide opacity-90">
              {formatDate(currentTime)}
            </p>

            <h2 className="mt-1 text-xl font-semibold md:text-2xl">
              {getLocationLabel(location)}
            </h2>

            <p className="mt-1 text-sm font-light text-teal-200">
              Current Time: {formatTime(currentTime)}
            </p>
          </header>

          <form onSubmit={handleSearch} className="mt-5 flex gap-3">
            <input
              type="text"
              value={searchCity}
              onChange={(event) => setSearchCity(event.target.value)}
              placeholder="Enter city name"
              className="min-w-0 flex-1 rounded-full bg-white/10 px-5 py-3 text-white placeholder-white/50 outline-none ring-1 ring-white/20 focus:ring-white/50"
            />

            <button
              type="submit"
              disabled={loading}
              className="rounded-full bg-white px-5 py-3 font-semibold text-slate-900 transition hover:bg-teal-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? 'Wait' : 'Search'}
            </button>
          </form>

          <div className="my-6 flex flex-col items-center text-center">
            {loading && <p className="text-lg opacity-80">Loading weather...</p>}

            {!loading && error && <p className="text-lg text-red-200">{error}</p>}

            {!loading && !error && !currentWeather && (
              <p className="text-lg opacity-80">
                Search a city to see weather data
              </p>
            )}

            {!loading && !error && currentWeather && (
              <>
                <img
                  src={getIconUrl(currentWeather.weather[0].icon)}
                  alt={currentWeather.weather[0].description}
                  className="mb-3 h-28 w-28 object-contain drop-shadow-2xl"
                />

                <p className="mb-1 text-lg font-light uppercase tracking-widest opacity-90">
                  {currentWeather.weather[0].description}
                </p>

                <p className="text-7xl font-extrabold tracking-tighter">
                  {Math.round(currentWeather.main.temp)}
                  <span className="align-top text-4xl font-light">°</span>
                </p>

                {/* <p className="mt-2 text-xs text-teal-100/70">
                  Source: OpenWeatherMap • Updated:{' '}
                  {formatCityTime(currentWeather.dt, currentWeather.timezone)}
                </p> */}
              </>
            )}
          </div>

          <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {dailyForecast.map((item) => (
              <ForecastItem
                key={item.day}
                label={item.day}
                temp={item.temp}
                icon={item.icon}
              />
            ))}
          </div>
        </div>

        <div className="flex min-h-0 flex-col justify-between border-t border-white/5 bg-gradient-to-b from-[#13262f] via-[#1b3d41] to-[#14504a] p-7 sm:p-8 md:border-l md:border-t-0">
          <div className="mx-auto flex w-full max-w-sm flex-col gap-5 md:mx-0">
            {loading && (
              <p className="text-center opacity-80">Loading details...</p>
            )}

            {!loading && !error && !currentWeather && (
              <p className="text-center opacity-80">
                Weather details will appear here
              </p>
            )}

            {!loading &&
              !error &&
              stats.map(([label, value]) => (
                <StatRow key={label} label={label} value={value} />
              ))}
          </div>

          <div className="mt-6">
            <div className="flex items-center justify-between gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {hourlyForecast.map((item) => (
                <ForecastItem
                  key={item.time}
                  label={item.time}
                  temp={item.temp}
                  icon={item.icon}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default WeatherDashboard;

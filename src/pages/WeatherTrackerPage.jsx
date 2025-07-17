import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  Zap,
  Eye,
  Wind,
  Droplets,
  Thermometer,
  MapPin,
  Search,
  RefreshCw,
  X,
  AlertTriangle
} from 'lucide-react';
import AnimatedRoute from '../components/common/AnimatedRoute';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useToast } from '../components/ui/Toast';
import { designSystem, getPersonTheme } from '../styles/designSystem';

const WeatherTrackerPage = () => {
  const { toast } = useToast();

  const [weatherData, setWeatherData] = useState({
    giaminh: null,
    baongoc: null
  });
  const [locations, setLocations] = useState({
    giaminh: 'Quận 1, TP.HCM',
    baongoc: 'Quận 3, TP.HCM'
  });
  const [loading, setLoading] = useState({
    giaminh: false,
    baongoc: false
  });
  const [searchQuery, setSearchQuery] = useState({
    giaminh: '',
    baongoc: ''
  });
  const [showSearch, setShowSearch] = useState({
    giaminh: false,
    baongoc: false
  });
  // Always use Celsius - removed toggle
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [weatherAlerts, setWeatherAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState({
    giaminh: [],
    baongoc: []
  });
  const [trackingMode, setTrackingMode] = useState({
    giaminh: 'district', // 'district' or 'ip'
    baongoc: 'district'
  });
  const [ipLocations, setIpLocations] = useState({
    giaminh: null,
    baongoc: null
  });
  const [lastFetchTime, setLastFetchTime] = useState({
    giaminh: 0,
    baongoc: 0
  });

  // Tomorrow.io API configuration
  const TOMORROW_API_KEY = '1vVA2pKpVgCCm4Lp02wsmwnAjrEuGvHs';
  const TOMORROW_BASE_URL = 'https://api.tomorrow.io/v4';
  const IP_GEOLOCATION_API = 'http://ip-api.com/json';

  // Fallback to free weather API
  const FALLBACK_API_BASE = 'https://wttr.in';

  // Ho Chi Minh City districts list
  const hcmDistricts = [
    // Quận nội thành
    'Quận 1, TP.HCM', 'Quận 2, TP.HCM', 'Quận 3, TP.HCM', 'Quận 4, TP.HCM',
    'Quận 5, TP.HCM', 'Quận 6, TP.HCM', 'Quận 7, TP.HCM', 'Quận 8, TP.HCM',
    'Quận 9, TP.HCM', 'Quận 10, TP.HCM', 'Quận 11, TP.HCM', 'Quận 12, TP.HCM',

    // Quận mới
    'Quận Thủ Đức, TP.HCM', 'Quận Gò Vấp, TP.HCM', 'Quận Phú Nhuận, TP.HCM',
    'Quận Tân Bình, TP.HCM', 'Quận Tân Phú, TP.HCM', 'Quận Bình Thạnh, TP.HCM',

    // Huyện ngoại thành
    'Huyện Bình Chánh, TP.HCM', 'Huyện Hóc Môn, TP.HCM', 'Huyện Củ Chi, TP.HCM',
    'Huyện Nhà Bè, TP.HCM', 'Huyện Cần Giờ, TP.HCM',

    // Khu vực đặc biệt
    'Khu Công nghệ cao, TP.HCM', 'Phú Mỹ Hưng, TP.HCM', 'Landmark 81, TP.HCM',
    'Sân bay Tân Sơn Nhất, TP.HCM', 'Chợ Bến Thành, TP.HCM', 'Nhà Thờ Đức Bà, TP.HCM',
    'Bitexco, TP.HCM', 'Vinhomes Central Park, TP.HCM', 'Crescent Mall, TP.HCM'
  ];

  const persons = [
    {
      id: 'giaminh',
      ...getPersonTheme('giaminh')
    },
    {
      id: 'baongoc',
      ...getPersonTheme('baongoc')
    }
  ];

  // Get coordinates from location name using geocoding
  const getCoordinatesFromLocation = async (location) => {
    try {
      // For HCM districts, use "Ho Chi Minh City" coordinates
      if (location.includes('TP.HCM')) {
        return { lat: 10.8231, lon: 106.6297 }; // Ho Chi Minh City coordinates
      }

      // Use a simple geocoding service for other locations
      const response = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(location)}&limit=1&appid=8c8e1aa8685f943eedb6d048c6182adc`
      );

      if (!response.ok) throw new Error('Geocoding failed');

      const data = await response.json();
      if (data.length === 0) throw new Error('Location not found');

      return { lat: data[0].lat, lon: data[0].lon };
    } catch (error) {
      throw new Error('Không thể tìm thấy tọa độ cho địa điểm này');
    }
  };

  // Get coordinates from IP address
  const getCoordinatesFromIP = async (ipAddress) => {
    try {
      const response = await fetch(`${IP_GEOLOCATION_API}/${ipAddress}`);

      if (!response.ok) throw new Error('IP geolocation failed');

      const data = await response.json();

      if (data.status === 'fail') {
        throw new Error(data.message || 'Invalid IP address');
      }

      return {
        lat: data.lat,
        lon: data.lon,
        locationName: `${data.city}, ${data.country}`
      };
    } catch (error) {
      throw new Error('Không thể lấy vị trí từ IP address');
    }
  };

  // Fetch weather by location with rate limiting
  const fetchWeatherByLocation = async (location, personId) => {
    // Rate limiting: minimum 30 seconds between requests
    const now = Date.now();
    const timeSinceLastFetch = now - lastFetchTime[personId];
    const minInterval = 30000; // 30 seconds

    if (timeSinceLastFetch < minInterval) {
      console.log(`Rate limited: waiting ${Math.ceil((minInterval - timeSinceLastFetch) / 1000)}s`);
      return;
    }

    setLoading(prev => ({ ...prev, [personId]: true }));
    setError(null);
    setLastFetchTime(prev => ({ ...prev, [personId]: now }));

    try {
      const { lat, lon } = await getCoordinatesFromLocation(location);
      await fetchWeatherByCoordinates(lat, lon, location, personId);
    } catch (error) {
      console.error('Error fetching weather by location:', error);
      setError(error.message);
      toast.error('Không thể lấy dữ liệu thời tiết', {
        title: 'Lỗi kết nối'
      });
      setLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  // Fetch weather by IP using Tomorrow.io API
  const fetchWeatherByIP = async (ipAddress, personId) => {
    setLoading(prev => ({ ...prev, [personId]: true }));
    setError(null);

    try {
      const { lat, lon, locationName } = await getCoordinatesFromIP(ipAddress);
      await fetchWeatherByCoordinates(lat, lon, locationName, personId);
    } catch (error) {
      console.error('Error fetching weather by IP:', error);
      setError(error.message);
      setLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  // Main weather fetch function with fallback system
  const fetchWeatherByCoordinates = async (lat, lon, locationName, personId) => {
    try {
      // Try Tomorrow.io API first
      await fetchFromTomorrowAPI(lat, lon, locationName, personId);
    } catch (error) {
      console.warn('Tomorrow.io API failed, falling back to free API:', error);

      // Fallback to free weather API
      try {
        await fetchFromFallbackAPI(locationName, personId);
      } catch (fallbackError) {
        console.error('All weather APIs failed:', fallbackError);
        throw new Error('Không thể lấy dữ liệu thời tiết. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  // Tomorrow.io API implementation
  const fetchFromTomorrowAPI = async (lat, lon, locationName, personId) => {
    // Get current weather
    const currentResponse = await fetch(
      `${TOMORROW_BASE_URL}/weather/realtime?location=${lat},${lon}&apikey=${TOMORROW_API_KEY}`
    );

    // Get forecast data
    const forecastResponse = await fetch(
      `${TOMORROW_BASE_URL}/weather/forecast?location=${lat},${lon}&timesteps=1h,1d&apikey=${TOMORROW_API_KEY}`
    );

    if (!currentResponse.ok) {
      if (currentResponse.status === 429) {
        throw new Error('API rate limit exceeded');
      }
      throw new Error(`Tomorrow.io API error: ${currentResponse.status}`);
    }

    if (!forecastResponse.ok) {
      if (forecastResponse.status === 429) {
        throw new Error('API rate limit exceeded');
      }
      throw new Error(`Tomorrow.io forecast API error: ${forecastResponse.status}`);
    }

    const currentData = await currentResponse.json();
    const forecastData = await forecastResponse.json();

    // Process Tomorrow.io data
    const processedData = {
      location: locationName,
      current: {
        temp: Math.round(currentData.data.values.temperature),
        feelsLike: Math.round(currentData.data.values.temperatureApparent),
        condition: mapTomorrowCondition(currentData.data.values.weatherCode),
        humidity: Math.round(currentData.data.values.humidity),
        windSpeed: Math.round(currentData.data.values.windSpeed * 3.6),
        visibility: Math.round(currentData.data.values.visibility),
        uvIndex: Math.round(currentData.data.values.uvIndex || 0),
        description: getTomorrowDescription(currentData.data.values.weatherCode),
        isRaining: isTomorrowRaining(currentData.data.values.weatherCode)
      },
      hourly: forecastData.timelines.hourly.slice(0, 8).map(hour => ({
        time: new Date(hour.time).getHours(),
        temp: Math.round(hour.values.temperature),
        condition: mapTomorrowCondition(hour.values.weatherCode)
      })),
      daily: forecastData.timelines.daily.slice(0, 5).map((day, index) => {
        const date = new Date(day.time);
        return {
          day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
          high: Math.round(day.values.temperatureMax),
          low: Math.round(day.values.temperatureMin),
          condition: mapTomorrowCondition(day.values.weatherCodeMax)
        };
      })
    };

    setWeatherData(prev => ({
      ...prev,
      [personId]: processedData
    }));

    checkRainAlerts(processedData, personId);
    setLastUpdate(new Date());
  };

  // Fallback API implementation (wttr.in)
  const fetchFromFallbackAPI = async (locationName, personId) => {
    const apiLocation = locationName.includes('TP.HCM') ? 'Ho Chi Minh City' : locationName;

    const response = await fetch(
      `${FALLBACK_API_BASE}/${encodeURIComponent(apiLocation)}?format=j1&lang=vi`,
      {
        headers: {
          'User-Agent': 'WeatherTracker/1.0'
        }
      }
    );

    if (!response.ok) {
      throw new Error('Fallback weather API failed');
    }

    const data = await response.json();

    if (!data.current_condition || !data.current_condition[0]) {
      throw new Error('Invalid fallback weather data');
    }

    const current = data.current_condition[0];

    // Process fallback data
    const processedData = {
      location: locationName,
      current: {
        temp: parseInt(current.temp_C),
        feelsLike: parseInt(current.FeelsLikeC),
        condition: mapWttrCondition(current.weatherCode),
        humidity: parseInt(current.humidity),
        windSpeed: Math.round(parseFloat(current.windspeedKmph)),
        visibility: Math.round(parseFloat(current.visibility)),
        uvIndex: parseInt(current.uvIndex || 0),
        description: current.weatherDesc[0].value,
        isRaining: isWttrRaining(current.weatherCode)
      },
      hourly: data.weather[0].hourly.slice(0, 8).map((hour, index) => ({
        time: parseInt(hour.time) / 100,
        temp: parseInt(hour.tempC),
        condition: mapWttrCondition(hour.weatherCode)
      })),
      daily: data.weather.slice(0, 5).map((day, index) => {
        const date = new Date();
        date.setDate(date.getDate() + index);
        return {
          day: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'][date.getDay()],
          high: parseInt(day.maxtempC),
          low: parseInt(day.mintempC),
          condition: mapWttrCondition(day.hourly[4].weatherCode)
        };
      })
    };

    setWeatherData(prev => ({
      ...prev,
      [personId]: processedData
    }));

    checkRainAlerts(processedData, personId);
    setLastUpdate(new Date());
  };

  // Map Tomorrow.io weather codes to our internal conditions
  const mapTomorrowCondition = (weatherCode) => {
    const code = parseInt(weatherCode);

    // Clear/Sunny
    if ([1000].includes(code)) return 'sunny';

    // Partly cloudy
    if ([1100, 1101, 1102].includes(code)) return 'partly-cloudy';

    // Cloudy/Overcast
    if ([1001, 1103].includes(code)) return 'cloudy';

    // Rain
    if ([4000, 4001, 4200, 4201].includes(code)) return 'rainy';

    // Snow
    if ([5000, 5001, 5100, 5101].includes(code)) return 'snowy';

    // Thunderstorm
    if ([8000].includes(code)) return 'stormy';

    // Default to partly cloudy
    return 'partly-cloudy';
  };

  // Get weather description from Tomorrow.io code
  const getTomorrowDescription = (weatherCode) => {
    const descriptions = {
      1000: 'Trời quang',
      1100: 'Ít mây',
      1101: 'Có mây',
      1102: 'Nhiều mây',
      1001: 'Nhiều mây',
      1103: 'U ám',
      4000: 'Mưa nhỏ',
      4001: 'Mưa',
      4200: 'Mưa nhẹ',
      4201: 'Mưa to',
      5000: 'Tuyết',
      5001: 'Tuyết rơi',
      5100: 'Tuyết nhẹ',
      5101: 'Tuyết to',
      8000: 'Dông'
    };
    return descriptions[weatherCode] || 'Không rõ';
  };

  // Check if Tomorrow.io weather code indicates rain
  const isTomorrowRaining = (weatherCode) => {
    const code = parseInt(weatherCode);
    const rainCodes = [4000, 4001, 4200, 4201, 8000]; // Include thunderstorm
    return rainCodes.includes(code);
  };

  // Fallback: Map wttr.in weather codes to our internal conditions
  const mapWttrCondition = (weatherCode) => {
    const code = parseInt(weatherCode);

    if (code === 113) return 'sunny';
    if ([116, 119, 122].includes(code)) return 'partly-cloudy';
    if ([119, 122, 143, 248, 260].includes(code)) return 'cloudy';
    if ([176, 179, 182, 185, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 323, 326, 356, 359, 386, 389, 392, 395].includes(code)) return 'rainy';
    if ([179, 182, 227, 230, 323, 326, 329, 332, 335, 338, 350, 353, 362, 365, 368, 371, 374, 377, 392, 395].includes(code)) return 'snowy';
    if ([386, 389, 392, 395].includes(code)) return 'stormy';

    return 'partly-cloudy';
  };

  // Check if wttr.in weather code indicates rain
  const isWttrRaining = (weatherCode) => {
    const code = parseInt(weatherCode);
    const rainCodes = [176, 179, 182, 185, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 323, 326, 356, 359, 386, 389, 392, 395];
    return rainCodes.includes(code);
  };

  // Filter HCM districts based on search query
  const filterDistricts = (query) => {
    if (!query.trim()) return [];

    return hcmDistricts.filter(district =>
      district.toLowerCase().includes(query.toLowerCase()) ||
      removeVietnameseAccents(district).toLowerCase().includes(removeVietnameseAccents(query).toLowerCase()) ||
      // Support searching by number only (e.g., "1" for "Quận 1")
      (query.match(/^\d+$/) && district.includes(`Quận ${query}`)) ||
      // Support searching without "Quận" (e.g., "tan binh" for "Quận Tân Bình")
      removeVietnameseAccents(district.replace('Quận ', '').replace(', TP.HCM', '')).toLowerCase().includes(removeVietnameseAccents(query).toLowerCase())
    ).slice(0, 6); // Limit to 6 suggestions
  };

  // Remove Vietnamese accents for better search
  const removeVietnameseAccents = (str) => {
    return str
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D');
  };

  // Handle search input change
  const handleSearchChange = (personId, value) => {
    setSearchQuery(prev => ({ ...prev, [personId]: value }));

    if (value.trim()) {
      const suggestions = filterDistricts(value);
      setSearchSuggestions(prev => ({ ...prev, [personId]: suggestions }));
    } else {
      setSearchSuggestions(prev => ({ ...prev, [personId]: [] }));
    }
  };

  // Handle city selection
  const selectCity = (personId, city) => {
    handleLocationChange(personId, city);
    setSearchSuggestions(prev => ({ ...prev, [personId]: [] }));
  };

  // Handle tracking mode change
  const handleModeChange = async (personId, mode) => {
    const newModes = { ...trackingMode, [personId]: mode };
    setTrackingMode(newModes);
    localStorage.setItem('weather-tracking-modes', JSON.stringify(newModes));

    // Fetch weather based on new mode
    if (mode === 'ip') {
      await enableIpTracking(personId);
    } else if (mode === 'district') {
      fetchWeatherByLocation(locations[personId], personId);
    }
  };

  // Enable IP tracking - auto-detect and save location
  const enableIpTracking = async (personId) => {
    setLoading(prev => ({ ...prev, [personId]: true }));
    setError(null);

    try {
      // Get current user IP
      const ipResponse = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipResponse.json();

      // Get location from IP
      const { lat, lon, locationName } = await getCoordinatesFromIP(ipData.ip);

      // Save IP location data
      const ipLocationData = {
        ip: ipData.ip,
        lat,
        lon,
        locationName,
        timestamp: new Date().toISOString()
      };

      const newIpLocations = { ...ipLocations, [personId]: ipLocationData };
      setIpLocations(newIpLocations);
      localStorage.setItem('weather-ip-locations', JSON.stringify(newIpLocations));

      // Fetch weather for this location
      await fetchWeatherByCoordinates(lat, lon, locationName, personId);

    } catch (error) {
      console.error('Error enabling IP tracking:', error);
      setError('Không thể kích hoạt IP tracking. Vui lòng thử lại.');

      // Fallback to district mode
      const newModes = { ...trackingMode, [personId]: 'district' };
      setTrackingMode(newModes);
      localStorage.setItem('weather-tracking-modes', JSON.stringify(newModes));
    } finally {
      setLoading(prev => ({ ...prev, [personId]: false }));
    }
  };

  // Check for rain alerts
  const checkRainAlerts = (weatherData, personId) => {
    const person = persons.find(p => p.id === personId);

    if (weatherData.current.isRaining) {
      const alertId = `rain-${personId}-${Date.now()}`;
      const newAlert = {
        id: alertId,
        type: 'rain',
        person: person.name,
        emoji: person.emoji,
        message: `🌧️ Đang có mưa tại ${weatherData.location}`,
        timestamp: new Date()
      };

      setWeatherAlerts(prev => {
        // Remove old rain alerts for this person
        const filtered = prev.filter(alert => !(alert.type === 'rain' && alert.person === person.name));
        return [...filtered, newAlert];
      });

      // Auto remove alert after 10 seconds
      setTimeout(() => {
        setWeatherAlerts(prev => prev.filter(alert => alert.id !== alertId));
      }, 10000);
    } else {
      // Remove rain alerts for this person if no longer raining
      setWeatherAlerts(prev => prev.filter(alert => !(alert.type === 'rain' && alert.person === person.name)));
    }
  };

  // Load saved data and fetch weather
  useEffect(() => {
    // Load saved locations
    const savedLocations = localStorage.getItem('weather-locations');
    if (savedLocations) {
      const parsed = JSON.parse(savedLocations);
      setLocations(parsed);
    }

    // Load saved IP locations
    const savedIpData = localStorage.getItem('weather-ip-locations');
    if (savedIpData) {
      const parsed = JSON.parse(savedIpData);
      setIpLocations(parsed);
    }

    // Load tracking modes
    const savedModes = localStorage.getItem('weather-tracking-modes');
    if (savedModes) {
      const parsed = JSON.parse(savedModes);
      setTrackingMode(parsed);
    }

    // Fetch initial weather data
    persons.forEach(person => {
      if (trackingMode[person.id] === 'ip' && ipLocations[person.id]) {
        fetchWeatherByCoordinates(
          ipLocations[person.id].lat,
          ipLocations[person.id].lon,
          ipLocations[person.id].locationName,
          person.id
        );
      } else {
        fetchWeatherByLocation(locations[person.id], person.id);
      }
    });
  }, []);

  // Auto-refresh every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refreshWeather();
    }, 600000); // 10 minutes

    return () => clearInterval(interval);
  }, [trackingMode, ipLocations, locations]);

  const handleLocationChange = (personId, newLocation) => {
    const newLocations = { ...locations, [personId]: newLocation };
    setLocations(newLocations);
    localStorage.setItem('weather-locations', JSON.stringify(newLocations));
    fetchWeatherByLocation(newLocation, personId);
    setShowSearch(prev => ({ ...prev, [personId]: false }));
    setSearchQuery(prev => ({ ...prev, [personId]: '' }));
    setSearchSuggestions(prev => ({ ...prev, [personId]: [] }));
  };

  const getWeatherIcon = (condition) => {
    const iconProps = { size: 32, className: "text-white" };
    switch (condition) {
      case 'sunny': return <Sun {...iconProps} />;
      case 'cloudy': return <Cloud {...iconProps} />;
      case 'rainy': return <CloudRain {...iconProps} />;
      case 'snowy': return <CloudSnow {...iconProps} />;
      case 'stormy': return <Zap {...iconProps} />;
      case 'partly-cloudy': return <Cloud {...iconProps} />;
      default: return <Sun {...iconProps} />;
    }
  };

  // Always return Celsius temperature
  const convertTemp = (temp) => temp;

  const getConditionText = (condition) => {
    const conditions = {
      'sunny': 'Nắng',
      'cloudy': 'Nhiều mây',
      'rainy': 'Mưa',
      'snowy': 'Tuyết',
      'stormy': 'Bão',
      'partly-cloudy': 'Ít mây'
    };
    return conditions[condition] || 'Không rõ';
  };

  const refreshWeather = () => {
    persons.forEach(person => {
      if (trackingMode[person.id] === 'ip' && ipLocations[person.id]) {
        fetchWeatherByCoordinates(
          ipLocations[person.id].lat,
          ipLocations[person.id].lon,
          ipLocations[person.id].locationName,
          person.id
        );
      } else {
        fetchWeatherByLocation(locations[person.id], person.id);
      }
    });
  };

  const getTemperatureDifference = () => {
    if (!weatherData.giaminh || !weatherData.baongoc) return null;

    const diff = weatherData.giaminh.current.temp - weatherData.baongoc.current.temp;
    return {
      difference: Math.abs(diff),
      warmer: diff > 0 ? 'giaminh' : 'baongoc',
      isEqual: Math.abs(diff) < 1
    };
  };

  const tempDiff = getTemperatureDifference();

  return (
    <AnimatedRoute>
      <div className="container pt-8 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 relative"
        >
          {/* Magical background glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-200/8 via-purple-200/8 to-pink-200/8 rounded-3xl blur-xl"></div>

          <div className="relative z-10">
            <h1 className="text-4xl font-display font-bold mb-4 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent flex items-center justify-center">
              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Cloud className="mr-4 text-blue-300 drop-shadow-sm" size={36} />
              </motion.div>
              Weather Tracker
              <motion.div
                animate={{
                  rotate: [0, -10, 10, 0],
                  scale: [1, 1.1, 1]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.5
                }}
              >
                <Cloud className="ml-4 text-pink-300 drop-shadow-sm" size={36} />
              </motion.div>
            </h1>
            <motion.p
              className="text-[#1a1033] opacity-80 max-w-lg mx-auto text-lg font-medium"
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              Theo dõi thời tiết nơi chúng mình đang ở 🌤️✨
            </motion.p>
          </div>
        </motion.div>

        {/* Weather Alerts */}
        <AnimatePresence>
          {weatherAlerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, y: -50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.9 }}
              className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 max-w-sm w-full mx-4"
            >
              <div className="glassmorphism-card p-4 border-l-4 border-blue-500 shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <AlertTriangle className="text-orange-500" size={20} />
                    </div>
                    <div>
                      <p className="text-[#1a1033] font-medium">
                        <span className="mr-1">{alert.emoji}</span>
                        {alert.person}
                      </p>
                      <p className="text-[#1a1033] opacity-80 text-sm">
                        {alert.message}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => setWeatherAlerts(prev => prev.filter(a => a.id !== alert.id))}
                    className="flex-shrink-0 p-1 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X className="text-[#1a1033] opacity-60" size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* API Status Notice */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glassmorphism-card p-3 mb-6 max-w-2xl mx-auto text-center"
        >
          <p className="text-sm text-[#1a1033] opacity-70">
            ⚡ Sử dụng Tomorrow.io API với fallback tự động khi cần thiết
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center items-center space-x-4 mb-8"
        >


          {/* Refresh Button */}
          <Button
            onClick={refreshWeather}
            variant="glass"
            size="md"
            disabled={loading.giaminh || loading.baongoc}
            loading={loading.giaminh || loading.baongoc}
          >
            <RefreshCw size={20} />
            Cập nhật
          </Button>

          {/* Last Update */}
          <motion.div
            className="px-6 py-3 rounded-2xl backdrop-blur-xl bg-gradient-to-r from-purple-200/15 to-pink-200/15 border border-white/20 shadow-sm"
            animate={{ opacity: [0.8, 1, 0.8] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-[#1a1033] font-medium text-sm">
              🕐 {lastUpdate.toLocaleTimeString('vi-VN')}
            </span>
          </motion.div>
        </motion.div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glassmorphism-card p-4 mb-8 max-w-md mx-auto text-center border-l-4 border-red-500"
          >
            <div className="flex items-center justify-center space-x-2 mb-2">
              <AlertTriangle className="text-red-500" size={20} />
              <span className="text-red-600 font-medium">Lỗi</span>
            </div>
            <p className="text-[#1a1033] opacity-80 text-sm">{error}</p>
            <motion.button
              onClick={() => setError(null)}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Đóng
            </motion.button>
          </motion.div>
        )}

        {/* Temperature Comparison */}
        {tempDiff && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glassmorphism-card p-4 mb-8 max-w-md mx-auto text-center"
          >
            {tempDiff.isEqual ? (
              <p className="text-[#1a1033] font-medium">
                🌡️ Cả hai nơi có nhiệt độ gần bằng nhau!
              </p>
            ) : (
              <p className="text-[#1a1033] font-medium">
                🌡️ {persons.find(p => p.id === tempDiff.warmer)?.name} ấm hơn {tempDiff.difference}°{isCelsius ? 'C' : 'F'}
              </p>
            )}
          </motion.div>
        )}

        {/* Weather Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {persons.map((person, index) => {
            const data = weatherData[person.id];
            const isLoading = loading[person.id];

            return (
              <GlassCard
                key={person.id}
                variant="heavy"
                shadow="2xl"
                glowColor={person.id === 'giaminh' ? 'blue' : 'pink'}
                className="relative overflow-hidden"
                motionProps={{
                  initial: { opacity: 0, x: index === 0 ? -20 : 20 },
                  animate: { opacity: 1, x: 0 },
                  transition: { delay: 0.4 + index * 0.1 }
                }}
              >
                {/* Liquid Background Gradient */}
                <div
                  className="absolute inset-0 opacity-40"
                  style={{ background: person.gradient.soft }}
                />

                {/* Animated liquid blobs */}
                <motion.div
                  className="absolute -top-10 -left-10 w-32 h-32 rounded-full blur-xl opacity-20"
                  style={{ background: person.gradient.glow }}
                  animate={{
                    x: [0, 20, -20, 0],
                    y: [0, -20, 20, 0],
                    scale: [1, 1.2, 0.8, 1]
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div
                  className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-xl opacity-15"
                  style={{ background: person.gradient.primary }}
                  animate={{
                    x: [0, -30, 30, 0],
                    y: [0, 30, -30, 0],
                    scale: [1, 0.8, 1.3, 1]
                  }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />

                {/* Glass overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent" />

                {/* Content wrapper */}
                <div className="relative z-10 p-6">

                  {/* Header */}
                  <div className="relative z-10 flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{person.emoji}</span>
                      <h3 className="text-xl font-bold text-[#1a1033]">{person.name}</h3>
                    </div>

                    <motion.button
                      onClick={() => setShowSearch(prev => ({ ...prev, [person.id]: !prev[person.id] }))}
                      className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Search className="text-[#1a1033] opacity-60" size={16} />
                    </motion.button>
                  </div>

                  {/* Mode Toggle */}
                  <div className="relative z-10 mb-6">
                    <div className="relative p-1 rounded-2xl bg-gradient-to-r from-white/20 via-white/10 to-white/20 backdrop-blur-sm border border-white/30">
                      {/* Sliding background indicator */}
                      <motion.div
                        className={`absolute top-1 bottom-1 w-1/2 bg-gradient-to-r ${person.gradient} rounded-xl shadow-lg opacity-90`}
                        animate={{
                          x: trackingMode[person.id] === 'district' ? 0 : '100%'
                        }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />

                      <div className="relative flex">
                        <motion.button
                          onClick={() => handleModeChange(person.id, 'district')}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative z-10 ${trackingMode[person.id] === 'district'
                            ? 'text-white shadow-lg'
                            : 'text-[#1a1033] opacity-70 hover:opacity-100'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading[person.id]}
                        >
                          <MapPin size={16} className="inline mr-2" />
                          Địa Điểm
                        </motion.button>
                        <motion.button
                          onClick={() => handleModeChange(person.id, 'ip')}
                          className={`flex-1 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative z-10 ${trackingMode[person.id] === 'ip'
                            ? 'text-white shadow-lg'
                            : 'text-[#1a1033] opacity-70 hover:opacity-100'
                            }`}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          disabled={loading[person.id]}
                        >
                          <Eye size={16} className="inline mr-2" />
                          IP Tracking
                        </motion.button>
                      </div>
                    </div>
                  </div>

                  {/* Location Search */}
                  <AnimatePresence>
                    {showSearch[person.id] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative z-20 mb-4"
                      >
                        <div className="relative">
                          <input
                            type="text"
                            value={searchQuery[person.id]}
                            onChange={(e) => handleSearchChange(person.id, e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && searchQuery[person.id].trim()) {
                                const suggestions = filterDistricts(searchQuery[person.id]);
                                if (suggestions.length > 0) {
                                  selectCity(person.id, suggestions[0]);
                                }
                              }
                            }}
                            placeholder="Tìm quận/huyện TP.HCM..."
                            className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 text-[#1a1033] placeholder-[#1a1033] placeholder-opacity-50 focus:outline-none focus:ring-2 focus:ring-[#1a1033] focus:ring-opacity-30"
                            autoComplete="off"
                          />

                          {/* Search Suggestions */}
                          {searchSuggestions[person.id].length > 0 && (
                            <motion.div
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="absolute top-full left-0 right-0 mt-1 bg-white bg-opacity-95 backdrop-blur-md rounded-lg shadow-xl border border-white border-opacity-30 overflow-hidden z-30"
                            >
                              {searchSuggestions[person.id].map((city, index) => (
                                <motion.button
                                  key={city}
                                  onClick={() => selectCity(person.id, city)}
                                  className="w-full px-4 py-3 text-left hover:bg-[#1a1033] hover:bg-opacity-10 transition-all duration-200 border-b border-white border-opacity-20 last:border-b-0"
                                  whileHover={{ x: 5 }}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                >
                                  <div className="flex items-center space-x-3">
                                    <MapPin className="text-[#1a1033] opacity-60" size={14} />
                                    <span className="text-[#1a1033] font-medium">{city}</span>
                                  </div>
                                </motion.button>
                              ))}
                            </motion.div>
                          )}
                        </div>

                        {/* Quick suggestions */}
                        <div className="mt-3">
                          <p className="text-xs text-[#1a1033] opacity-60 mb-2">Quận phổ biến:</p>
                          <div className="flex flex-wrap gap-2">
                            {['Quận 1, TP.HCM', 'Quận 3, TP.HCM', 'Quận 7, TP.HCM', 'Quận Tân Bình, TP.HCM', 'Quận Bình Thạnh, TP.HCM'].map(district => (
                              <motion.button
                                key={district}
                                onClick={() => selectCity(person.id, district)}
                                className="px-3 py-1 text-xs rounded-full bg-white bg-opacity-20 text-[#1a1033] hover:bg-opacity-30 transition-all"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                {district.replace(', TP.HCM', '')}
                              </motion.button>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* IP Tracking Status */}
                  {trackingMode[person.id] === 'ip' && ipLocations[person.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="relative z-10 mb-4"
                    >
                      <div className="bg-gradient-to-r from-green-50 to-blue-50 bg-opacity-50 backdrop-blur-sm rounded-xl p-4 border border-white border-opacity-30">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <div>
                              <p className="text-sm font-medium text-[#1a1033]">IP Tracking Active</p>
                              <p className="text-xs text-[#1a1033] opacity-70">
                                {ipLocations[person.id].locationName}
                              </p>
                            </div>
                          </div>
                          <motion.button
                            onClick={() => enableIpTracking(person.id)}
                            className="px-3 py-2 bg-blue-500 text-white rounded-lg text-xs font-medium hover:bg-blue-600 transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            disabled={loading[person.id]}
                          >
                            {loading[person.id] ? (
                              <RefreshCw size={12} className="animate-spin" />
                            ) : (
                              <>
                                <RefreshCw size={12} className="inline mr-1" />
                                Refresh
                              </>
                            )}
                          </motion.button>
                        </div>

                        <div className="mt-3 pt-3 border-t border-white border-opacity-20">
                          <div className="flex items-center justify-between text-xs text-[#1a1033] opacity-60">
                            <span>IP: {ipLocations[person.id].ip}</span>
                            <span>
                              {new Date(ipLocations[person.id].timestamp).toLocaleTimeString('vi-VN')}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* Current Location */}
                  {trackingMode[person.id] === 'district' && (
                    <div className="relative z-10 flex items-center space-x-2 mb-6">
                      <MapPin className="text-[#1a1033] opacity-60" size={16} />
                      <span className="text-[#1a1033] opacity-80 text-sm font-medium">
                        {locations[person.id]}
                      </span>
                    </div>
                  )}

                  {isLoading ? (
                    <div className="relative z-10 text-center py-8">
                      <RefreshCw className="animate-spin text-[#1a1033] opacity-60 mx-auto mb-2" size={32} />
                      <p className="text-[#1a1033] opacity-60">Đang tải...</p>
                    </div>
                  ) : data ? (
                    <div className="relative z-10">
                      {/* Current Weather */}
                      <div className="text-center mb-6">
                        <motion.div
                          className={`inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${person.gradient} mb-4 shadow-xl relative overflow-hidden`}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                          animate={{
                            boxShadow: [
                              "0 10px 30px rgba(0,0,0,0.2)",
                              "0 15px 40px rgba(0,0,0,0.3)",
                              "0 10px 30px rgba(0,0,0,0.2)"
                            ]
                          }}
                          transition={{
                            boxShadow: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                          }}
                        >
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            animate={{ x: [-100, 100] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                          />
                          <div className="relative z-10">
                            {getWeatherIcon(data.current.condition)}
                          </div>
                        </motion.div>
                        <motion.div
                          className={`text-5xl font-bold mb-3 bg-gradient-to-r ${person.gradient} bg-clip-text text-transparent`}
                          animate={{ scale: [1, 1.05, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        >
                          {convertTemp(data.current.temp)}°C
                        </motion.div>
                        <div className="text-[#1a1033]/80 mb-2 font-medium backdrop-blur-sm bg-white/15 rounded-full px-4 py-1 inline-block">
                          Cảm giác như {convertTemp(data.current.feelsLike)}°C
                        </div>
                        <div className="text-[#1a1033] font-semibold text-lg backdrop-blur-sm bg-white/15 rounded-full px-4 py-1 inline-block">
                          {getConditionText(data.current.condition)}
                        </div>
                      </div>

                      {/* Weather Details */}
                      <div className="grid grid-cols-3 gap-3 mb-6">
                        <motion.div
                          className="text-center p-4 rounded-2xl backdrop-blur-sm bg-white/15 border border-white/20"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Droplets className="text-blue-400 mx-auto mb-2 drop-shadow-sm" size={20} />
                          <div className="text-xs text-[#1a1033]/70 mb-1">Độ ẩm</div>
                          <div className="font-bold text-[#1a1033] text-lg">{data.current.humidity}%</div>
                        </motion.div>
                        <motion.div
                          className="text-center p-4 rounded-2xl backdrop-blur-sm bg-white/15 border border-white/20"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Wind className="text-emerald-400 mx-auto mb-2 drop-shadow-sm" size={20} />
                          <div className="text-xs text-[#1a1033]/70 mb-1">Gió</div>
                          <div className="font-bold text-[#1a1033] text-lg">{data.current.windSpeed} km/h</div>
                        </motion.div>
                        <motion.div
                          className="text-center p-4 rounded-2xl backdrop-blur-sm bg-white/15 border border-white/20"
                          whileHover={{ scale: 1.05, y: -2 }}
                          transition={{ type: "spring", stiffness: 300 }}
                        >
                          <Eye className="text-purple-400 mx-auto mb-2 drop-shadow-sm" size={20} />
                          <div className="text-xs text-[#1a1033]/70 mb-1">Tầm nhìn</div>
                          <div className="font-bold text-[#1a1033] text-lg">{data.current.visibility} km</div>
                        </motion.div>
                      </div>

                      {/* Hourly Forecast */}
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-[#1a1033] opacity-80 mb-3">24 giờ tới</h4>
                        <div className="flex space-x-3 overflow-x-auto pb-2">
                          {data.hourly.slice(0, 8).map((hour, i) => (
                            <div key={i} className="flex-shrink-0 text-center">
                              <div className="text-xs text-[#1a1033] opacity-60 mb-1">
                                {hour.time}h
                              </div>
                              <div className="w-8 h-8 flex items-center justify-center mb-1">
                                {getWeatherIcon(hour.condition)}
                              </div>
                              <div className="text-sm font-medium text-[#1a1033]">
                                {convertTemp(hour.temp)}°
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Daily Forecast */}
                      <div>
                        <h4 className="text-sm font-semibold text-[#1a1033] opacity-80 mb-3">7 ngày tới</h4>
                        <div className="space-y-2">
                          {data.daily.slice(0, 5).map((day, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <span className="text-sm text-[#1a1033] opacity-60 w-6">{day.day}</span>
                                <div className="w-6 h-6 flex items-center justify-center">
                                  {getWeatherIcon(day.condition)}
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-medium text-[#1a1033]">
                                  {convertTemp(day.high)}°
                                </span>
                                <span className="text-sm text-[#1a1033] opacity-60">
                                  {convertTemp(day.low)}°
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="relative z-10 text-center py-8">
                      <Cloud className="text-[#1a1033] opacity-30 mx-auto mb-2" size={32} />
                      <p className="text-[#1a1033] opacity-60">Không thể tải dữ liệu thời tiết</p>
                    </div>
                  )}
                </div>
              </GlassCard>
            );
          })}
        </div>
      </div>
    </AnimatedRoute>
  );
};

export default WeatherTrackerPage;

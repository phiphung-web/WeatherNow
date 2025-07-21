/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  useColorScheme,
  View,
  TextInput,
  Button,
  Text,
} from 'react-native';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const fetchWeather = async () => {
    if (!city) {
      return;
    }
    setLoading(true);
    setWeather(null);
    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city,
        )}&count=1`,
      );
      const geoJson = await geoRes.json();
      if (geoJson.results && geoJson.results.length > 0) {
        const { latitude, longitude } = geoJson.results[0];
        const weatherRes = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`,
        );
        const weatherJson = await weatherRes.json();
        setWeather(weatherJson.current_weather);
      }
    } catch (e) {
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Enter city"
          value={city}
          onChangeText={setCity}
        />
        <Button title="Get Weather" onPress={fetchWeather} />
        {loading && <Text style={styles.info}>Loading...</Text>}
        {weather && (
          <Text style={styles.info}>
            Temperature: {weather.temperature}°C{'\n'}Wind Speed:{' '}
            {weather.windspeed}
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  content: {
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    width: '100%',
    marginBottom: 8,
    padding: 8,
    borderRadius: 4,
  },
  info: {
    marginTop: 16,
    textAlign: 'center',
  },
});

export default App;

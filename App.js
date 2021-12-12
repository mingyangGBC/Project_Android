import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, Text, View } from 'react-native';
import Weather from './Weather';
import * as Location from 'expo-location';

export default function App() {
  const API_KEY = '5a9f3d77f65a849f70e24fd83bd9d3b0'
  const [weeklyWeather, setWeeklyWeather] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setErrorMsg("Permission to access location was denied.");
      return;
    }

    const location = await Location.getCurrentPositionAsync();
    // const location = await Location.getLastKnownPositionAsync();

    let asyncWatchPos = await Location.watchPositionAsync(
      {accuracy:Location.Accuracy.High, timeInterval: 10000, distanceInterval: 20000},
      (l) => {updateLoc(l)}
    );

    const api = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=${API_KEY}`)
    const response = await api.json()
        .catch(err => { setErrorMsg("There was an issue accessing the API, try again later."); });
    setWeeklyWeather(response)
  }

  async function updateLoc(updatedLoc) {
    const api = await fetch(`https://pro.openweathermap.org/data/2.5/forecast/climate?lat=${updatedLoc.coords.latitude}&lon=${updatedLoc.coords.longitude}&appid=${API_KEY}`)
    const response = await api.json()
        .catch(err => { setErrorMsg("Update location failed, please try again later."); });
    setWeeklyWeather(response)
    console.log(updatedLoc);
  }

  if (weeklyWeather && errorMsg === null) {
    let props = {
      weeklyWeather,
      // location     <- keeping this here for later, will likely remove if we don't have issues with updateLoc 
    }
    return (
      <ScrollView style={styles.container}>
        <Weather {...props}/>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.errorContainer}>
        <Text>{errorMsg}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  errorContainer: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: 'center',
    alignItems: 'center',
  },
});
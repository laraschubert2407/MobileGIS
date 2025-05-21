import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View, ActivityIndicator, Text, Platform, PermissionsAndroid } from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      
      // Standort holen
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Zugriff auf den Standort wurde verweigert.');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });
    })();
  }, []);

  // Fehler anzeigen, falls vorhanden
  if (errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{errorMsg}</Text>
      </View>
    );
  }

  // Ladeanzeige, solange Standort noch nicht verfügbar ist
  if (!location) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Standort wird geladen…</Text>
      </View>
    );
  }

  // Sobald Standort vorhanden ist → Karte mit Marker anzeigen
  return (
    <SafeAreaView style={styles.SafeArea}>
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
           latitude: location.latitude,
           longitude: location.longitude,
           latitudeDelta: 0.01,
           longitudeDelta: 0.01,
         }}
        > 
          <UrlTile
            urlTemplate="https://c.tile.openstreetmap.org/{z}/{x}/{y}.png" // OpenStreetMap-URL
            maximumZ={19} // maximale Zoomstufe
            minimumZ={0} // minimale Zoomstufe
            flipY={false} // legt fest, ob die Kacheln umgekehrt werden (Standard: false)
          /> 
         <Marker coordinate={location} title="Mein Standort" /> 
        </MapView>
        <Text style= {styles.overlayheader} >Hello GIK Group 5</Text> 
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({ // Styles für die App
  SafeArea: {
    flex: 1,
    backgroundColor: 'white',	
  },
  overlayheader: {
    position: 'absolute',
    top: 0,
    alignSelf: 'center',
    fontSize: 24,
    fontWeight: 'normal',
    backgroundColor: 'transparent',
    color: 'red',
    zIndex: 999,
  },
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

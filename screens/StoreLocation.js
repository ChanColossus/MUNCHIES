import React, { useState, useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View,ScrollView,SafeAreaView,Platform } from "react-native";
import MapView, { Marker } from "react-native-maps";

let locationOfInterest = [
  {
    title: "Munchies & Bevvies",
    location: {
      latitude: 17.5408,
      longitude: 120.7197,
    },
  },
];

export default function StoreLocation() {
    const onRegionChange = (region) => {
      console.log(region);
    };

    const showlocationOfInterest = () => {
      return locationOfInterest.map((item, index) => {
        return (
          <Marker key={index} coordinate={item.location} title={item.title} />
        );
      });
    };
  return (
    <SafeAreaView
    style={{
      alignSelf: "stretch",
      paddingTop: Platform.OS === "android" ? 40 : 0,
      flex: 1,
      backgroundColor: "#FFE4B5",
    }}
  >
    <ScrollView contentContainerStyle={{ paddingHorizontal: 0 }}>
          <View style={styles.container}>
              <MapView
                style={styles.map}
                onRegionChange={onRegionChange}
                initialRegion={{
                  latitude: 17.540216940582905,
                  latitudeDelta: 0.015168860656025629,
                  longitude: 120.71858027949929,
                  longitudeDelta: 0.008948855102048014,
                }}
              >
                {showlocationOfInterest()}
              </MapView>
              <StatusBar style="auto" />
            </View>
            </ScrollView>
            </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
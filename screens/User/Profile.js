import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, Button, Image, StyleSheet, Pressable } from 'react-native';
import { Container } from "native-base"
import AsyncStorage from '@react-native-async-storage/async-storage'
import axios from "axios"
import { useFocusEffect, useNavigation } from '@react-navigation/native';

const Profile = () => {
  const navigation = useNavigation()
  const [userProfile, setUserProfile] = useState(null);
  
  useFocusEffect(
    useCallback(() => {
      const getProfile = async () => {
        try {
          const token = await AsyncStorage.getItem("authToken");
          console.log(token)
          if (token) {
            const config = {
              headers: {
                Authorization: `${token}`,
              },
            };

            const response = await axios.get("http://192.168.1.12:8000/profile", config);
            console.log(response.data.user);
            setUserProfile(response.data.user);
          } else {
            console.log("Authentication token not found");
          }
        } catch (error) {
          console.log("Error fetching profile:", error);
        }
      };

      getProfile();
    }, [])
  );

  return (
    <Container style={styles.container}>
      <ScrollView contentContainerStyle={styles.subContainer}>
        <Text style={styles.title}>
          {userProfile ? userProfile.name : ""}
        </Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Email: {userProfile ? userProfile.email : ""}
          </Text>
          <Text style={styles.infoText}>
            Phone: {userProfile ? userProfile.phone : ""}
          </Text>
        </View>
        <View style={styles.buttonContainer}>
          <Button title={"Sign Out"} onPress={() => [
            AsyncStorage.removeItem("authToken"),
            navigation.navigate("Login")
          ]} />
        </View>
      </ScrollView>
    </Container>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  subContainer: {
    alignItems: "center",
    paddingVertical: 60,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 40,
  },
  infoText: {
    fontSize: 18,
    marginVertical: 5,
  },
  buttonContainer: {
    marginTop: 20,
  },
});
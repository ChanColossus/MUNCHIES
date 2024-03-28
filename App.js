import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import RouteNavigator from "./navigation/RouteNavigator";
import { PaperProvider } from "react-native-paper";
import { NativeBaseProvider } from "native-base";
export default function App() {
  return (
    <>
      <NativeBaseProvider>
        <PaperProvider>
          <RouteNavigator />
        </PaperProvider>
      </NativeBaseProvider>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFE4B5",
    alignItems: "center",
    justifyContent: "center",
  },
});

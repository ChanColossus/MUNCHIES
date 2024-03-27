import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import RouteNavigator from './navigation/RouteNavigator';

export default function App() {
  return (
   <>
     <RouteNavigator />
   </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4B5',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

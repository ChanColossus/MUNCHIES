import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const CustomDrawer = ({ navigation }) => {
  // State to track whether the drawer is open or closed
  const [isOpen, setIsOpen] = useState(false);

  // Function to toggle the drawer open/close state
  const toggleDrawer = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      {/* Content area */}
      <View style={styles.content}>
        <Text style={styles.heading}>App Content</Text>
        <TouchableOpacity onPress={toggleDrawer} style={styles.toggleButton}>
          <Text>{isOpen ? 'Close Drawer' : 'Open Drawer'}</Text>
        </TouchableOpacity>
      </View>
      
      {/* Drawer area */}
      {isOpen && (
        <View style={styles.drawer}>
          <Text style={styles.drawerHeading}>Drawer Content</Text>
          <TouchableOpacity onPress={toggleDrawer} style={styles.drawerItem}>
            <Text>Drawer Item 1</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={toggleDrawer} style={styles.drawerItem}>
            <Text>Drawer Item 2</Text>
          </TouchableOpacity>
          {/* Add more drawer items as needed */}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // Content background color
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
  },
  toggleButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
  },
  drawer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: 200, // Width of the drawer
    backgroundColor: '#f0f0f0', // Drawer background color
    padding: 20,
  },
  drawerHeading: {
    fontSize: 18,
    marginBottom: 10,
  },
  drawerItem: {
    paddingVertical: 10,
  },
});

export default CustomDrawer;

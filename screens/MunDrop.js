import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiUrl } from "../ip";
import { Picker } from '@react-native-picker/picker';

const MunDrop = ({ onValueChange }) => {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState('');
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [userId, setUserId] = useState(null);
  const url = apiUrl;

  const getAllMunchies = async () => {
    try {
      const { data } = await axios.get(`${url}/munchies`);
      setItems(data.munchies);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    getAllMunchies();
  }, []);

  useEffect(() => {
    AsyncStorage.getItem('userId')
      .then((value) => {
        if (value !== null) {
          setUserId(value);
        }
      })
      .catch(error => {
        console.error('Error fetching userId from AsyncStorage:', error);
      });
  }, []);

  useEffect(() => {
    if (userId) {
      axios.get(`${url}/orders/${userId}`)
        .then(response => {
          setOrders(response.data.orders);
        })
        .catch(error => {
          console.error('Error fetching orders:', error);
        });
    }
  }, [userId]);

  const getOrderedItemNames = () => {
    const orderedItemNames = new Set();
    orders.forEach(order => {
      order.products.forEach(product => {
        orderedItemNames.add(product.name.toLowerCase());
      });
    });
    return orderedItemNames;
  };

  const handleDropdownChange = (value) => {
    setSelectedItem(value);
    onValueChange(value);
  };

  return (
    <View style={styles.container}>
      <View style={styles.pickerContainer}>
        {loading ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Picker
            selectedValue={selectedItem}
            style={styles.dropdown}
            onValueChange={(itemValue, itemIndex) => {
              handleDropdownChange(itemValue);
            }}
          >
            {selectedItem ? null : <Picker.Item label="Select an item" value="" />}
            {items.map(item => (
              <Picker.Item 
                key={item._id} 
                label={item.name} 
                value={item._id} 
                enabled={getOrderedItemNames().has(item.name.toLowerCase())}
                style={getOrderedItemNames().has(item.name.toLowerCase()) ? styles.enabledItem : styles.disabledItem}
              />
            ))}
          </Picker>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerContainer: {
    backgroundColor: "#FFE4B5",
    borderRadius: 0,
    borderWidth: 2,
    borderColor: 'black',
    paddingHorizontal: 0,
    width: '90%',
  },
  dropdown: {
    height: 40,
    color: 'black',
    width: '100%',
  },
  enabledItem: {
    color: 'black',
  },
  disabledItem: {
    color: 'gray',
  },
});

export default MunDrop;

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import ItemList from "./ItemList.tsx";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../App.tsx';

interface FormData {
    name: string;
    description: string;
    category: string;
    quantity: string;
}

const DashboardScreen: React.FC = () => {

    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    const handleLogout = async () => {
        try {
            await AsyncStorage.removeItem('token');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        } catch (err) {
            console.error('Logout error:', err);
        }
    };

    const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
    const [formData, setFormData] = useState<FormData>({
        name: '',
        description: '',
        category: '',
        quantity: '0',
    });
    const [message, setMessage] = useState<string>('');

    const handleChange = (name: keyof FormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const calculateStatus = (quantity: number): string => {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 10) return 'Low Stock';
        return 'Available';
    };

    const handleSubmit = async () => {
        const quantityNum = Number(formData.quantity);
        if (isNaN(quantityNum)) {
            setMessage('Quantity must be a number');
            return;
        }
        const newItem = {
            ...formData,
            quantity: quantityNum,
            status: calculateStatus(quantityNum),
        };

        try {
            const res = await fetch('http://10.0.2.2:8001/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newItem),
            });
            if (!res.ok) throw new Error('Product adding failed');

            setFormData({
                name: '',
                description: '',
                category: '',
                quantity: '0',
            });
            setMessage('Product added successfully');
        } catch (err) {
            console.error(err);
            setMessage('Product adding failed');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Chairy</Text>
                <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
                    <Text style={{ color: 'white' }}>Logout</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabBar}>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'list' && styles.activeTab]}
                    onPress={() => setActiveTab('list')}
                >
                    <Text>List</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, activeTab === 'add' && styles.activeTab]}
                    onPress={() => setActiveTab('add')}
                >
                    <Text>Add product</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.tabContent}>
                {activeTab === 'list' && (
                    <ItemList />
                )}

                {activeTab === 'add' && (
                    <View style={styles.formContainer}>
                        <Text style={styles.formTitle}>New product</Text>
                        {!!message && <Text style={{ marginBottom: 10 }}>{message}</Text>}

                        <Text>Name:</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.name}
                            onChangeText={text => handleChange('name', text)}
                            placeholder="Enter product name"
                        />

                        <Text>Description:</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.description}
                            onChangeText={text => handleChange('description', text)}
                            placeholder="Enter description"
                        />

                        <Text>Category:</Text>
                        <View style={styles.pickerWrapper}>
                            <Picker
                                selectedValue={formData.category}
                                onValueChange={itemValue => handleChange('category', itemValue)}
                            >
                                <Picker.Item label="-- Choose --" value="" />
                                <Picker.Item label="Wood" value="Wood" />
                                <Picker.Item label="Plastic" value="Plastic" />
                                <Picker.Item label="Metal" value="Metal" />
                            </Picker>
                        </View>

                        <Text>Quantity:</Text>
                        <TextInput
                            style={styles.input}
                            value={formData.quantity}
                            onChangeText={text => handleChange('quantity', text)}
                            keyboardType="numeric"
                            placeholder="0"
                        />

                        <Button title="Add product" onPress={handleSubmit} />
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 28,
    },
    logoutButton: {
        backgroundColor: 'red',
        padding: 10,
        borderRadius: 6,
    },
    tabBar: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    tab: {
        marginRight: 20,
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
    },
    activeTab: {
        backgroundColor: '#ddd',
    },
    tabContent: {
        flex: 1,
    },
    formContainer: {

    },
    formTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        padding: 8,
        marginBottom: 15,
    },
    pickerWrapper: {
        borderWidth: 1,
        borderColor: '#999',
        borderRadius: 4,
        marginBottom: 15,
    },
});

export default DashboardScreen;

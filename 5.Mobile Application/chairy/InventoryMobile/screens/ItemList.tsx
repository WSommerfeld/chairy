import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';

interface Item {
    id: number;
    name: string;
    description: string;
    category: string;
    quantity: number;
    status: string;
}

const ItemList: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');

    const [sortKey, setSortKey] = useState<keyof Item>('name');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    const [filterCategory, setFilterCategory] = useState<string>('');
    const [filterStatus, setFilterStatus] = useState<string>('');

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch('http://10.0.2.2:8001/items');
                if (!res.ok) throw new Error('Failed to fetch items');
                const data = await res.json();
                setItems(data);
            } catch (err: any) {
                setError(err.message || 'Error fetching items');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const filteredItems = items.filter(item => {
        const categoryMatch = filterCategory
            ? item.category.toLowerCase() === filterCategory.toLowerCase()
            : true;

        const statusMatch = filterStatus
            ? item.status.toLowerCase() === filterStatus.toLowerCase()
            : true;

        return categoryMatch && statusMatch;
    });

    const sortedItems = [...filteredItems].sort((a, b) => {
        const valA = a[sortKey];
        const valB = b[sortKey];

        if (valA == null) return 1;
        if (valB == null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
            return sortOrder === 'asc' ? valA - valB : valB - valA;
        }

        return sortOrder === 'asc'
            ? String(valA).localeCompare(String(valB))
            : String(valB).localeCompare(String(valA));
    });

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" />
                <Text>Loading items...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (sortedItems.length === 0) {
        return (
            <View style={styles.center}>
                <Text>No items found.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Items list</Text>

            {/* Filters */}
            <View style={styles.filterContainer}>
                <View style={styles.pickerWrapper}>
                    <Text>Category:</Text>
                    <Picker
                        selectedValue={filterCategory}
                        onValueChange={setFilterCategory}
                        style={styles.picker}
                    >
                        <Picker.Item label="All" value="" />
                        <Picker.Item label="Metal" value="metal" />
                        <Picker.Item label="Plastic" value="plastic" />
                        <Picker.Item label="Wood" value="wood" />
                    </Picker>
                </View>

                <View style={styles.pickerWrapper}>
                    <Text>Status:</Text>
                    <Picker
                        selectedValue={filterStatus}
                        onValueChange={setFilterStatus}
                        style={styles.picker}
                    >
                        <Picker.Item label="All" value="" />
                        <Picker.Item label="Available" value="available" />
                        <Picker.Item label="Low Stock" value="low stock" />
                        <Picker.Item label="Out of Stock" value="out of stock" />
                    </Picker>
                </View>
            </View>

            {/* Sorting */}
            <View style={styles.sortContainer}>
                {(['name', 'category', 'quantity', 'status'] as (keyof Item)[]).map(key => (
                    <TouchableOpacity
                        key={key}
                        style={[styles.sortButton, sortKey === key && styles.sortButtonActive]}
                        onPress={() => {
                            if (sortKey === key) {
                                setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                            } else {
                                setSortKey(key);
                                setSortOrder('asc');
                            }
                        }}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.sortText, sortKey === key && styles.sortTextActive]}>
                            {key.charAt(0).toUpperCase() + key.slice(1)} {sortKey === key ? (sortOrder === 'asc' ? '⬆' : '⬇') : '⬍'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* List */}
            <FlatList
                data={sortedItems}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.itemContainer}>
                        <Text style={styles.itemName}>{item.name} ({item.category})</Text>
                        <Text>{item.description}</Text>
                        <Text>Quantity: {item.quantity} — Status: {item.status}</Text>
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 10,
        paddingHorizontal: 10,
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        marginBottom: 15,
        fontWeight: 'bold',
    },
    errorText: {
        color: 'red',
    },
    itemContainer: {
        padding: 12,
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
    itemName: {
        fontWeight: 'bold',
    },
    filterContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-start',
        marginBottom: 10,
        overflow: 'visible',
    },
    pickerWrapper: {
        width: '45%',
        marginHorizontal: 5,
        marginBottom: 10,
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 5,
    },
    sortContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginBottom: 10,

    },
    sortButton: {
        width: '45%',
        paddingVertical: 8,
        marginVertical: 5,
        backgroundColor: '#e0e0ff',
        borderRadius: 6,
        alignItems: 'center',
    },
    sortButtonActive: {
        backgroundColor: '#a0a0ff',
    },
    sortText: {
        color: 'blue',
        fontWeight: 'normal',
        fontSize: 16,
    },
    sortTextActive: {
        fontWeight: 'bold',
        color: '#000080',
    },
});

export default ItemList;

import { StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';

export default function ShowMessage({ message }) {
    const [load, setLoad] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setLoad(false)
        }, 2000);
    }, [])
    
    return load ? (
        <View style={styles.container}>
            <Text>{message}</Text>
        </View>
    ) : null;
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: "20%",
        zIndex: 1,
        backgroundColor: '#e5e5e5',
        borderRadius: 5,
        padding: 10,
        alignSelf: 'center',
    }
});
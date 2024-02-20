import { Text, View, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import Loader from './Loader';

export default function ButtonC({ title, func, fg, bg, submitLoading }) {
    const { width } = Dimensions.get('window');

    return (
        <TouchableOpacity onPress={func}>
            <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: bg,
                padding: 10,
                width: width * 0.8,
                minHeight: 40,
                borderRadius: 5,
                marginTop: 10
            }}>
                {
                    submitLoading ? (
                        <Loader show={submitLoading}/>
                    ) : (
                        <Text style={{ fontFamily: 'Montserrat-Medium', color: fg, textAlign: 'center' }}>
                            {title}
                        </Text>
                    )
                }
            </View>
        </TouchableOpacity>
    )
}


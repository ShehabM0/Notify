import { View, ActivityIndicator, StyleSheet } from "react-native";

const Loader = ({ show }) => {
    return show ? (
        <View style={style.loader}>
            <ActivityIndicator size="small" color="white" />
        </View>
    ) : null;
};

const style = StyleSheet.create({
  loader: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default Loader;
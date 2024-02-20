import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Linking, StatusBar, Dimensions, TouchableWithoutFeedback, Keyboard, Text, View, Platform, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Feather } from 'react-native-vector-icons';
import * as Notifications from 'expo-notifications';
import SendNotification from './SendNotification';
import * as Clipboard from 'expo-clipboard';
import ShowMessage from './ShowMessage';
import * as Device from 'expo-device';
import * as Font from 'expo-font';
import ButtonC from './ButtonC';
import Loader from './Loader';

const { height } = Dimensions.get('window');
const viewHeight = height * ((100 / 3) - (parseInt(100 / 3)));

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync({ projectId: 'c66f3eba-ac38-4bcc-a987-f21e107735e8' })).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export default function App() {
  const [notification, setNotification] = useState(false);
  const [expoPushToken, setExpoPushToken] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  const [showCopied, setShowCopied] = useState(false);
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const [expoTokenLoad, setExpoTokenLoad] = useState(true);
  const [fontLoaded, setFontLoaded] = useState(false);
  const [submitLoad, setSubmitLoad] = useState(false);
  const [copyLoad, setCopyLoad] = useState(false);

  useEffect(() => {
    if (showCopied) {
      setTimeout(() => setCopyLoad(false), 2000);
      setTimeout(() => setShowCopied(false), 2000);
    }
  }, [showCopied]);

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoTokenLoad(false);
      setExpoPushToken(token);
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'iosevka-regular': require('./assets/fonts/iosevka-regular.ttf'),
        'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
        'Montserrat-SemiBold': require('./assets/fonts/Montserrat-SemiBold.ttf'),
      });
      setFontLoaded(true);
    };
    loadFonts();
  }, []);
  if (!fontLoaded) {
    return null;
  }

  function copyPressed() {
    if (showCopied) return;
    Clipboard.setStringAsync(expoPushToken);
    setShowCopied(true);
    setCopyLoad(true);
  }

  function reDirect() {
    Linking.openURL('https://expo.dev/notifications');
  }

  function sendNotification() {
    setSubmitLoad(true);
    SendNotification(expoPushToken, title, body, setSubmitLoad);
  }

  return (
    <KeyboardAwareScrollView keyboardShouldPersistTaps='handled'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{ flex: 1 }}>

            <View style={styles.contianer}>
              <View style={styles.titleContainer}>
                <Text style={styles.textInput}>Your expo push token:</Text>
              </View>

              <View style={{ alignItems: 'center' }}>
                <View style={styles.snippet}>
                  <TouchableOpacity onPress={copyPressed}>
                    <View style={{ alignItems: 'flex-end' }}>
                      {
                        copyLoad ?
                          (<Feather name="check" size={20} color="white" />)
                          :
                          (<Feather name="clipboard" size={20} color="white" />)
                      }
                    </View>
                  </TouchableOpacity>
                  {
                    expoTokenLoad ?
                      (<Loader show={expoTokenLoad} />)
                      :
                      (<Text style={{ color: '#e4e4ef', fontFamily: 'iosevka-regular' }}>{expoPushToken}</Text>)
                  }
                </View>
              </View>
            </View>

            <View style={styles.contianer}>
              <View style={styles.titleContainer}>
                <Text style={styles.textInput}>Notification content (Optional):</Text>
              </View>

              <View style={styles.center}>
                <TextInput
                  style={styles.input}
                  placeholder='Enter Notification Title'
                  onChangeText={(val) => setTitle(val)}
                >
                </TextInput>

                <TextInput
                  style={styles.input}
                  placeholder='Enter Notification Body'
                  onChangeText={(val) => setBody(val)}
                >
                </TextInput>
              </View>
            </View>

            {showCopied && <ShowMessage message="Copied to clipboard!" />}

            <View style={[styles.contianer, { alignItems: 'center' }]}>
              <ButtonC
                title="Send a notification"
                func={sendNotification}
                fg='white'
                bg='black'
                submitLoading={submitLoad}
              />
              <ButtonC
                title="Send a notification through expo tool"
                func={reDirect}
                fg='black'
                bg='#e5e5e5'
              />
            </View>
            
            <StatusBar backgroundColor="black" />
          </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  contianer: {
    height: viewHeight,
    justifyContent: 'center'
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  titleContainer: {
    paddingLeft: 15,
    paddingBottom: 15
  },
  snippet: {
    width: '90%',
    minHeight: 60,
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#282828'
  },
  input: {
    width: "85%",
    padding: 5,
    borderRadius: 5,
    marginBottom: 10,
    borderColor: 'black',
    color: 'black',
    borderBottomWidth: 1
  },
  textInput: {
    fontFamily: 'Montserrat-SemiBold',
    color: 'black'
  }
});


import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  Switch,
  ActivityIndicator,
  StyleSheet,
  Animated,
  Easing,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { getDatabase, ref, set, onValue } from 'firebase/database';
import { FIREBASE_APP } from './firebaseConfig';
import ImageButton from './ImageButton';

const ToggleButton = () => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [dloading, setdLoading] = useState(true);
  const vibrateAnimation = useRef(new Animated.Value(0)).current;
  const [vibrationOn, setVibrationOn] = useState(false);
  const [isImage1, setIsImage1] = useState(true);
  const [isPumpImage1, setIsPumpImage1] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const animationValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const toggleValueRef = ref(getDatabase(FIREBASE_APP), 'toggleValue');
    const handleDataChange = (snapshot) => {
      const value = snapshot.val();
      setIsAnimating(value);
      setIsImage1(value);
      setLoading(false);
    };

    const listenervalue = onValue(toggleValueRef, handleDataChange);

    const vibrationRef = ref(getDatabase(FIREBASE_APP), 'togglePump');
    const handlePumpChange = (snapshot) => {
      const isVibrationOn = snapshot.val();
      setVibrationOn(isVibrationOn);
      if (isVibrationOn) {
        startVibration();
      } else {
        stopVibration();
      }
    };

    const listener = onValue(vibrationRef, handlePumpChange);

    const fetchData = async () => {
      try {
        const db = getDatabase(FIREBASE_APP);
        const userRef = ref(getDatabase(FIREBASE_APP), 'Smart_Irrigation');

        const fetchUserData = () => {
          onValue(userRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
              setUserData(data);
            } else {
              setUserData(null);
            }
            setdLoading(false);
          });
        };

        fetchUserData();

        const intervalId = setInterval(fetchUserData, 10000);

        return () => clearInterval(intervalId);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchData();

    if (isAnimating) {
      const loopAnimation = () => {
        Animated.timing(animationValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.linear,
          useNativeDriver: true,
        }).start(({ finished }) => {
          if (finished) {
            animationValue.setValue(0);
            loopAnimation();
          }
        });
      };

      loopAnimation();
    } else {
      animationValue.stopAnimation();
    }

    return () => {
      listener();
      listenervalue();
    };
  }, [isAnimating]);

  const imageSource = isImage1
    ? require('./assets/off.png')
    : require('./assets/on.png');

  const imageSourcePump = isPumpImage1
    ? require('./assets/off.png')
    : require('./assets/on.png');

  const startVibration = () => {
    const duration = 100;
    const iterations = 10;

    const animations = Array.from({ length: iterations }, (_, index) => (
      Animated.timing(vibrateAnimation, {
        toValue: index % 2 === 0 ? 10 : -10,
        duration,
        useNativeDriver: true,
      })
    ));

    Animated.loop(Animated.sequence(animations)).start();

    setIsPumpImage1(true);
    setVibrationOn(true);
  };

  const stopVibration = () => {
    vibrateAnimation.stopAnimation();
    setIsPumpImage1(false);
    setVibrationOn(false);
  };

  const toggleMotor = async () => {
    try {
      setIsImage1((previousState) => !previousState);
      await set(ref(getDatabase(FIREBASE_APP), 'toggleValue'), !isImage1);
    } catch (error) {
      console.error('Error updating value in Firebase:', error);
    }
  };

  const toggleVibration = async () => {
    try {
      setIsPumpImage1((previousState) => !previousState);
      if (vibrationOn) {
        stopVibration();
      } else {
        startVibration();
      }
      await set(ref(getDatabase(FIREBASE_APP), 'togglePump'), !isPumpImage1);
    } catch (error) {
      console.error('Error updating value in Firebase:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2ecc71" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.headerlabel}>SMART IRRIGATION</Text>

      <View style={styles.header}>
        <Text style={styles.label}>Motor Status</Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.fancontainer}>
          <Animated.Image
            source={require('./assets/fan.png')}
            style={[
              styles.image,
              {
                transform: [
                  {
                    rotate: animationValue.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '360deg'],
                    }),
                  },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.imageContainer}>
          <ImageButton onPress={toggleMotor} imageSource={imageSource} />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.label}>Pump Status</Text>
      </View>
      <View style={styles.rowContainer}>
        <View style={styles.fancontainer}>
          <Animated.Image
            source={require('./assets/pump.png')}
            style={[
              styles.image,
              {
                transform: [
                  { translateX: vibrateAnimation },
                  { translateY: vibrateAnimation },
                ],
              },
            ]}
          />
        </View>
        <View style={styles.imageContainer}>
          <ImageButton onPress={toggleVibration} imageSource={imageSourcePump} />
        </View>
      </View>

      <View style={styles.userDataContainer}>
        {dloading ? (
          <ActivityIndicator size="large" color="#2ecc71" />
        ) : userData ? (
          <View style={styles.userData}>
            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Flame:</Text>
                <Text style={styles.value}>{userData.Flame}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Flame_Detection:</Text>
                <Text style={styles.value}>{userData.Flame_Detection}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Gas:</Text>
                <Text style={styles.value}>{userData.Gas}</Text>
              </View>
              <View style={styles.column}>
                <Text style={styles.label}>Gas_Status:</Text>
                <Text style={styles.value}>{userData.Gas_Status}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Humidity:</Text>
                <Text style={styles.value}>{userData.Humidity}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Rain_Level:</Text>
                <Text style={styles.value}>{userData.Rain_Level}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Rain_Status:</Text>
                <Text style={styles.value}>{userData.Rain_Status}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Soil_Moist_Level:</Text>
                <Text style={styles.value}>{userData.Soil_Moisture_Level}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Soil_Moist_Status:</Text>
                <Text style={styles.value}>{userData.Soil_Moisture_Status}</Text>
              </View>

              <View style={styles.column}>
                <Text style={styles.label}>Temperature:</Text>
                <Text style={styles.value}>{userData.Temperature}</Text>
              </View>
            </View>

            <View style={styles.row}>
              <View style={styles.column}>
                <Text style={styles.label}>Temp_Status:</Text>
                <Text style={styles.value}>{userData.Temperature_Status}</Text>
              </View>
            </View>
          </View>
        ) : (
          <Text style={styles.error}>No user data available</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#34495e', // Dark blue background color
  },
  userDataContainer: {
    flex: 1,
    padding: 10,
    width: '100%',
  },
  userData: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#2c3e50', // Dark gray background color for user data
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  column: {
    flex: 1,
    marginLeft: 10,
  },
  label: {
    marginRight: 5,
    fontWeight: 'bold',
    color: '#3498db', // Blue color for labels
  },
  value: {
    marginRight: 10,
    color: '#ecf0f1', // Light gray color for values
  },
  header: {
    paddingTop: 10,
    alignItems: 'center',
  },
  fancontainer: {
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  headerlabel: {
    fontSize: 24,
    color: '#3498db',
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  error: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default ToggleButton;

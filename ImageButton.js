import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';

const ImageButton = ({ onPress, imageSource }) => (
  <TouchableOpacity onPress={onPress} style={styles.button}>
    <Image source={imageSource} style={styles.image} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  button: {
    // Style for the button container, if needed
  },
  image: {
    width: 100, // Adjust width and height as needed
    height: 75,
    resizeMode: 'contain', // Adjust the resize mode as per your image aspect ratio
  },
});

export default ImageButton;

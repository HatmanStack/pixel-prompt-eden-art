import * as React from "react";
import { StyleSheet, View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { primaryColor, secondaryColor, tertiaryColor, blankColor } from "./colors";

export default function SliderComponent({ setSteps, setGuidance, setFace }) {
  const [samplingValue, setSamplingValue] = React.useState(40);
  const [guidanceValue, setGuidanceValue] = React.useState(8);
  const [faceValue, setFaceValue] = React.useState(1);

  // Handle sampling steps change
  const handleStepChange = (x) => {
    setSamplingValue(x);
    setSteps(x);
  };

  // Handle guidance change
  const handleGuidanceChange = (x) => {
    setGuidanceValue(parseFloat(x.toFixed(2)));
    setGuidance(parseFloat(x.toFixed(2)));
  };

  const handleFaceChange = (x) => {
    setFaceValue(parseFloat(x.toFixed(2)));
    setFace(parseFloat(x.toFixed(2)));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.captionText}>Face Guidance</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1.2}
        step={0.1}
        value={faceValue}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={primaryColor}
        thumbTintColor={tertiaryColor}
        onValueChange={handleFaceChange}
      />
      <Text style={styles.sliderValue}>{faceValue}</Text>
      <Text style={styles.captionText}>Sampling Steps</Text>
      <Slider
        style={styles.slider}
        minimumValue={3}
        maximumValue={50}
        step={1}
        value={samplingValue}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={primaryColor}
        thumbTintColor={tertiaryColor}
        onValueChange={handleStepChange}
      />
      <Text style={styles.sliderValue}>{samplingValue}</Text>
      <Text style={styles.captionText}>Guidance</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={10}
        step={0.1}
        value={guidanceValue}
        minimumTrackTintColor={secondaryColor}
        maximumTrackTintColor={primaryColor}
        thumbTintColor={tertiaryColor}
        onValueChange={handleGuidanceChange}
      />
      <Text style={styles.sliderValue}>{guidanceValue}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 50,
  },
  slider: {
    width: 350,
    height: 40,
  },
  captionText: {
    color: blankColor,
    fontSize: 20,
    textAlign: "center",
    letterSpacing: 3,
    width: 350,
    fontFamily: "Sigmar",
  },
  sliderValue: {
    color: blankColor,
    fontSize: 18,
    letterSpacing: 3,
    textAlign: "center",
    paddingBottom: 30,
    width: 350,
    fontFamily: "Sigmar",
  },
});

// Buttons.js
import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  ActivityIndicator,
  Switch,
  Image,
} from "react-native";

import {
  primaryColor,
  secondaryColor,
  tertiaryColor,
  analogusColor,
  backgroundColor,
  blankColor
} from "./colors";

const Buttons = ({
  setPlaySound,
  setInferrenceButton,
  activity,
  longPrompt,
  setTextInference,
  switchPromptFunction,
  promptLengthValue,
  setParametersWrapper,
}) => {
  const [comboButtonPressed, setComboButtonPressed] = useState(false);

  const setThePromptValue = () => {
    setComboButtonPressed(false);
    switchPromptFunction();
  };

  return (
    <>
      {activity ? (
        <ActivityIndicator
          size="large"
          color={primaryColor}
          style={{ margin: 25 }}
        />
      ) : (
        <>
          {longPrompt ? (
            <>
              <View style={[styles.rowContainer]}>
                <Pressable
                  onPress={() => {
                    setTextInference(true);
                    setPlaySound("click");
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: pressed ? secondaryColor : primaryColor,
                      width: 40,
                      height: 40,
                      borderRadius: 20,
                      margin: 10,
                    },
                  ]}
                ></Pressable>
                <View style={styles.columnContainer}>
                  <View style={[styles.rowContainer]}>
                    <Text
                      style={[
                        {
                          color: promptLengthValue ? blankColor : analogusColor,
                          marginRight: 15,
                        },
                        styles.sliderText,
                      ]}
                    >
                      Short
                    </Text>
                    <Text
                      style={[
                        {
                          color: promptLengthValue ? analogusColor : blankColor,
                          marginRight: 15,
                        },
                        styles.sliderText,
                      ]}
                    >
                      Long
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.rowContainer,
                      { paddingBottom: 10, justifyContent: "space-between" },
                    ]}
                  >
                    <Switch
                      style={{ marginRight: 40 }}
                      trackColor={{ false: "#767577", true: "#767577" }}
                      thumbColor={tertiaryColor}
                      activeThumbColor={tertiaryColor}
                      ios_backgroundColor={tertiaryColor}
                      onValueChange={setThePromptValue}
                      value={promptLengthValue}
                    />
                  </View>
                </View>
              </View>
            </>
          ) : (
            <Pressable
              onPress={() => {
                setTextInference(true);
                setPlaySound("click");
              }}
              style={({ pressed }) => [
                { backgroundColor: pressed ? secondaryColor : primaryColor },
                styles.button,
              ]}
            >
              {({ pressed }) => (
                <Text style={styles.promptText}>
                  {pressed ? "PROMPTED!" : "Prompt"}
                </Text>
              )}
            </Pressable>
          )}
          <Pressable
            onPress={() => {
              setInferrenceButton(true);
              setParametersWrapper();
              setPlaySound("click");
            }}
            style={({ pressed }) => [
              {
                backgroundColor: pressed ? primaryColor : secondaryColor,
                marginBottom: 20,
              },
              styles.button,
            ]}
          >
            {({ pressed }) => (
              <Text style={styles.promptText}>
                {pressed ? "INFERRED!" : "Inference"}
              </Text>
            )}
          </Pressable>
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: backgroundColor,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    overflow: "visible",
  },
  columnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  button: {
    margin: 10,
    borderRadius: 4,
    paddingHorizontal: 32,
    elevation: 3,
    fontFamily: "Sigmar",
  },
  activityIndicator: {
    marginLeft: 50,
  },
  promptText: {
    color: blankColor,
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 30,
    fontFamily: "Sigmar",
  },
  sliderText: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    letterSpacing: 2,
    lineHeight: 30,
    fontFamily: "Sigmar",
  },
  changeButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center", // change as needed
    elevation: 3, // for Android shadow
    shadowColor: "#000", // for iOS shadow
    shadowOffset: { width: 0, height: 2 }, // for iOS shadow
    shadowOpacity: 0.25, // for iOS shadow
    shadowRadius: 3.84, // for iOS shadow
  },
});

export default Buttons;

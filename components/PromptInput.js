import React, { useEffect } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  useWindowDimensions,
  Image,
  View,
} from "react-native";

import { tertiaryColor, neutralColor, blankColor, textColor } from "./colors";

export default function PromptInputComponent({
  setPlaySound,
  setPrompt,
  inferredPrompt,
}) {
  const [text, setText] = React.useState("");
  const { width } = useWindowDimensions();

  const textInputStyle = {
    ...styles.input,
    width: width > 500 ? 500 : width - 80,
  };

  useEffect(() => {
    if (inferredPrompt) {
      setText(inferredPrompt);
      setPrompt(inferredPrompt);
    }
  }, [inferredPrompt]);

  const handleTextChange = (x) => {
    setText(x);
    setPrompt(x);
  };

  return (
    <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
      <TextInput
        style={textInputStyle}
        placeholder=""
        multiline
        textAlign="center"
        onChangeText={handleTextChange}
        value={text}
        maxLength={20000}
      />
      <Pressable
        style={({ pressed }) => [
          {
            height: 30,
            width: 30,
            backgroundColor: pressed ? tertiaryColor : neutralColor,
            borderRadius: 6,
            padding: 10,
            marginTop: 10,
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
          },
        ]}
        onPress={() => {
          setText("");
          setPrompt("");
          setPlaySound("click");
        }}
      >
        <Image
          source={require("../assets/close.png")}
          style={{
            width: "100%",
            height: "100%",
            resizeMode: "contain",
          }}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: blankColor,
    borderColor: tertiaryColor,
    borderBottomLeftRadius: 4,
    borderWidth: 4,
    borderBottomRightRadius: 4,
    borderStartWidth: 10,
    borderEndWidth: 10,
    borderRadius: 6,
    height: 200,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: 20,
    color: textColor,
    fontFamily: "Sigmar",
    marginRight: 10,
  },
});

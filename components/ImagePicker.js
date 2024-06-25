import React, { useEffect, useState } from "react";
import {
  Pressable,
  Image,
  View,
  StyleSheet,
  Text,
  FlatList,
} from "react-native";
import { neutralColor, blankColor } from "./colors";

const MyImagePicker = ({
  columnCount,
  selectedImageIndex,
  setSelectedImageIndex,
  initialReturnedPrompt,
  setReturnedPrompt,
  promptList,
  window,
  setPlaySound,
  imageSource,
}) => {
  const [textHeight, setTextHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(160);

  useEffect(() => {
    if (window.width < 1000) {
      if (selectedImageIndex !== null) {
        setContainerHeight(440 + textHeight);
      } else {
        setContainerHeight(160);
      }
    }
  }, [selectedImageIndex, textHeight]);

  useEffect(() => {
    if (selectedImageIndex !== null) {
      setReturnedPrompt(promptList[selectedImageIndex]);
    } else {
      setReturnedPrompt(initialReturnedPrompt);
    }
  }, [selectedImageIndex]);

  function isStartOrEndOfRow(index) {
    const isLastInRow = (selectedImageIndex + 1) % columnCount === 0 || selectedImageIndex === imageSource.length - 1;
    const isFirstInRow = selectedImageIndex % columnCount === 0;
    
    return selectedImageIndex === index + (isFirstInRow ? -1 : 1) || selectedImageIndex === index + (isFirstInRow ? -2 : isLastInRow ? 2 : -1);
  }
  
  return (
      <View style={[styles.flatListContainer]}>
        <FlatList
          showsVerticalScrollIndicator={false}
          data={imageSource}
          key={columnCount} 
          numColumns={columnCount}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: source, index }) => (
            <View
              style={[
                styles.imageColumnContainer,
                {
                  
                  width:
                    isStartOrEndOfRow(index)
                      ? 0
                      : selectedImageIndex === index
                        ? 330
                        : 105,
                  height:
                    window.width < 1000 && selectedImageIndex == index
                      ? containerHeight
                      : selectedImageIndex === index
                        ? 440
                        : 105,
                  margin: 0,
                  marginTop: selectedImageIndex === index ? 20 : 0,
                  overflow: "visible"
                },
              ]}
            >
              <View style={[styles.columnContainer]}>
                <Pressable
                  onPress={() => {
                    setPlaySound("click");
                    if (selectedImageIndex === index) {
                      setSelectedImageIndex(null);
                      return;
                    }
                    setSelectedImageIndex(index);
                  }}
                  style={[
                    styles.imageCard,
                    {
                      alignItems: "flex-start",
                      justifyContent: "flex-start",
                      width:
                      isStartOrEndOfRow(index)
                          ? 0
                          : selectedImageIndex === index
                            ? 320
                            : 100,
                      height:
                      isStartOrEndOfRow(index)
                          ? 0
                          : selectedImageIndex === index
                            ? 400
                            : 100,
                      borderRadius: selectedImageIndex === index ? 30 : 0,
                    },
                  ]}
                >
                  <Image
                    source={
                      typeof source === "number" ? source : { uri: source }
                    }
                    style={[
                      {
                        width:
                        isStartOrEndOfRow(index)
                            ? 0
                            : selectedImageIndex === index
                              ? 320
                              : 100,
                        height:
                        isStartOrEndOfRow(index)
                            ? 0
                            : selectedImageIndex === index
                              ? 400
                              : 110,
                        borderRadius: selectedImageIndex === index ? 30 : 0,
                      },
                    ]}
                  />
                </Pressable>
              </View>

              {window.width < 1000 && selectedImageIndex === index && (
                <Text
                  style={[styles.promptText, { flexShrink: 1 }]}
                  numberOfLines={1000}
                  onLayout={(event) => {
                    const { height } = event.nativeEvent.layout;
                    setTextHeight(height);
                  }}
                >
                  {promptList[index]}
                </Text>
              )}
            </View>
          )}
        />
      </View>
    
  );
};


const styles = StyleSheet.create({
  flatListContainer: {
    width: "auto",
    height: "auto",
    showsVerticalScrollIndicator: false,
  },
  imageColumnContainer: {
    alignItems: "center",
    flexDirection: "column",
  },
  columnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
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
  imageCard: {
    backgroundColor: neutralColor,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    showsVerticalScrollIndicator: false,
  },
  changeButton: {
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default MyImagePicker;

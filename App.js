import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  Pressable,
  useWindowDimensions,
  Image,
  Dimensions,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { registerRootComponent } from "expo";
import base64 from "react-native-base64";
import SliderComponent from "./components/Slider";
import PromptInputComponent from "./components/PromptInput";
import BreathingComponent from "./components/Breathing";
import DropDownComponent from "./components/DropDown";
import MyImagePicker from "./components/ImagePicker";
import Buttons from "./components/Buttons";
import Expand from "./components/Expand";
import PromptInference from "./components/Prompt";
import Inference from "./components/Inference";
import SoundPlayer from "./components/Sounds";
import Constants from "expo-constants";


import AWS from "aws-sdk";
import {
  backgroundColor,
  neutralColor,
  blankColor,
} from "./components/colors";


AWS.config.update({
  accessKeyId: Constants.expoConfig.extra.AWS_ACCESS_VAR,
  secretAccessKey: Constants.expoConfig.extra.AWS_SECRET_VAR,
  region: "us-west-1",
});

const s3 = new AWS.S3();
const BUCKET_NAME = "davidlee.fun";
const FOLDER_NAME = "pictures";

const assetImage = require("./assets/dave.jpeg");
const circleImage = require("./assets/circle.png");
const addImage = require("./assets/add_image.png");
const rotatedCircle = require("./assets/rotated_circle.png");

const App = () => {
  useFonts({ Sigmar: require("./assets/Sigmar/Sigmar-Regular.ttf") });
  const [inferredImage, setInferredImage] = useState(assetImage);
  const [steps, setSteps] = useState(40);
  const [guidance, setGuidance] = useState(8);
  const [face, setFace] = useState(1);
  const [modelID, setModelID] = useState(
    "stabilityai/stable-diffusion-xl-base-1.0"
  );
  const [prompt, setPrompt] = useState("Dave");
  const [inferredPrompt, setInferredPrompt] = useState(null);
  const [parameters, setParameters] = useState(null);
  const [activity, setActivity] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [returnedPrompt, setReturnedPrompt] = useState("Dave");
  const [initialReturnedPrompt, setInitialReturnedPrompt] = useState("Dave");
  const [textInference, setTextInference] = useState(false);
  const [shortPrompt, setShortPrompt] = useState("");
  const [longPrompt, setLongPrompt] = useState(null);
  const [promptLengthValue, setPromptLengthValue] = useState(false);
  const [modelMessage, setModelMessage] = useState("");
  const [inferrenceButton, setInferrenceButton] = useState(null);
  const [isImagePickerVisible, setImagePickerVisible] = useState(false);
  const [imageSource, setImageSource] = useState([]);
  const [soundIncrement, setSoundIncrement] = useState(null);
  const [makeSound, setMakeSound] = useState([null, 0]);
  const [promptList, setPromptList] = useState([]);
  const [swapImage, setSwapImage] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [columnCount, setColumnCount] = useState(3);

  const window = useWindowDimensions();

  const uploadFile = (fileName, fileContent) => {
    const uploadedContent = fileContent.replace(/^data:image\/\w+;base64,/, "");
    const byteCharacters = base64.decode(uploadedContent);
    const byteArray = new Uint8Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i);
    }
    const params = {
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: byteArray,
    };

    s3.upload(params, function (err, data) {
      if (err) {
        throw err;
      }
    });
  };

  useEffect(() => {
    s3.listObjectsV2({ Bucket: BUCKET_NAME }, (err, data) => {
      if (err) {
        console.error("Error listing objects:", err);
        return;
      }
      const folderObjects = data.Contents.filter((object) =>
        object.Key.startsWith(FOLDER_NAME)
      );
      console.log("Folder objects:", folderObjects);
      folderObjects.forEach((object) => {
        const params = {
          Bucket: BUCKET_NAME,
          Key: object.Key,
        };

        s3.getObject(params, (err, data) => {
          if (err) {
            console.error("Error downloading file:", err);
            return;
          }
          if (object.Key === "pictures/") {
            console.log('Skipping object with key "pictures/"');
            return;
          }

          const base64Data = base64.encodeFromByteArray(data.Body);
          const keyWithoutFolderAndExtension = object.Key.replace(
            new RegExp(`^${FOLDER_NAME}/`, "g"),
            ""
          );
          setPromptList((prevPromptList) => [
            ...prevPromptList,
            keyWithoutFolderAndExtension,
          ]);
          setImageSource((prevImageSource) => [
            ...prevImageSource,
            "data:image/jpeg;base64," + base64Data,
          ]);
        });
      });
    });
  }, []);

  const passModelIDWrapper = (x) => {
    setModelError(false);
    setModelID(x);
  };

  const setPlaySound = (sound) => {
    setSoundIncrement((prevSoundIncrement) => prevSoundIncrement + 1);
    setMakeSound([sound, soundIncrement]);
  };

  useEffect(() => {
    if (swapImage) {
      console.log(assetImage);
      console.log(inferredImage);
      if (inferredImage !== addImage) {
        if (inferredImage !== assetImage) {
          uploadFile("pictures/" + initialReturnedPrompt, inferredImage);
          setPromptList((prevPromptList) => [
            initialReturnedPrompt,
            ...prevPromptList,
          ]);
          setImageSource((prevImageSource) => [
            inferredImage,
            ...prevImageSource,
          ]);
          setInferredImage(addImage);
          setInitialReturnedPrompt("");
          setReturnedPrompt("");
        }
      }
      setSwapImage(false);
    }
  }),
    [swapImage];

  const switchPromptFunction = () => {
    setPromptLengthValue(!promptLengthValue);
    if (promptLengthValue) {
      setInferredPrompt(shortPrompt);
      setPlaySound("switch");
    } else {
      setInferredPrompt(longPrompt);
      setPlaySound("switch");
    }
  };

  const updateColumnCount = (width) => {
    if (width < 600) setColumnCount(3);
    else if (width >= 600 && width < 1000) setColumnCount(4);
    else if (width >= 1000 && width < 1400) setColumnCount(5);
    else if (width >= 1400 && width < 1700) setColumnCount(6);
    else setColumnCount(7);
  };

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = Dimensions.get('window').width;
      updateColumnCount(screenWidth);
    };
    handleResize();
    Dimensions.addEventListener('change', handleResize);
    return () => Dimensions.removeEventListener('change', handleResize);
  }, []);


  const setParametersWrapper = () => {
    setParameters(`${prompt}-${steps}-${guidance}-${modelID}`);
  };
  
  return (
    // Main container
    <View style={styles.titlecontainer}>
      <SoundPlayer makeSound={makeSound} />
      <PromptInference
        prompt={prompt}
        textInference={textInference}
        setTextInference={setTextInference}
        setLongPrompt={setLongPrompt}
        setShortPrompt={setShortPrompt}
        setInferredPrompt={setInferredPrompt}
        promptLengthValue={promptLengthValue}
        setActivity={setActivity}
        setModelError={setModelError}
      />
      <Inference
        setInferrenceButton={setInferrenceButton}
        inferrenceButton={inferrenceButton}
        setModelMessage={setModelMessage}
        prompt={prompt}
        guidance={guidance}
        steps={steps}
        face={face}
        setActivity={setActivity}
        setModelError={setModelError}
        setReturnedPrompt={setReturnedPrompt}
        setInitialReturnedPrompt={setInitialReturnedPrompt}
        setInferredImage={setInferredImage}
      />
      <BreathingComponent />
      <ScrollView
        scrollY={true}
        style={styles.ScrollView}
        showsVerticalScrollIndicator={false}
      >
        {window.width > 1000 ? (
          <View style={styles.rowContainer}>
            {/* Left column */}
            
              <Pressable
                onPress={() => {
                  setSwapImage(true);
                  setPlaySound("swoosh");
                }}
                style={({ pressed }) => [
                  styles.swapButton,
                  {
                    top: pressed
                      ? window.height / 2 - 13
                      : window.height / 2 - 15,
                    left: pressed
                      ? window.width / 2 - 13
                      : window.width / 2 - 15,
                    width: pressed ? 52 : 60,
                    height: pressed ? 52 : 60,
                  },
                ]}
              >
                {({ pressed }) => (
                  <Image
                    source={pressed ? rotatedCircle : circleImage}
                    style={[
                      styles.changeButton,
                      pressed
                        ? { width: 52, height: 52 }
                        : { width: 60, height: 60 },
                    ]}
                  />
                )}
              </Pressable>
            

            <View style={styles.leftColumnContainer}>
              <View>
                <PromptInputComponent
                  setPlaySound={setPlaySound}
                  setPrompt={setPrompt}
                  inferredPrompt={inferredPrompt}
                />
              </View>
              <View style={[styles.rowContainer, { padding: 0 }]}>
                <DropDownComponent
                  setPlaySound={setPlaySound}
                  passModelID={passModelIDWrapper}
                />
                <View style={styles.columnContainer}>
                  <Buttons
                    setPlaySound={setPlaySound}
                    setInferrenceButton={setInferrenceButton}
                    activity={activity}
                    longPrompt={longPrompt}
                    setTextInference={setTextInference}
                    switchPromptFunction={switchPromptFunction}
                    promptLengthValue={promptLengthValue}
                    setParametersWrapper={setParametersWrapper}
                  />
                  {modelError ? (
                    <Text style={styles.promptText}>{modelMessage}</Text>
                  ) : (
                    <></>
                  )}
                </View>
              </View>

              <Expand
                setPlaySound={setPlaySound}
                isImagePickerVisible={isImagePickerVisible}
                setImagePickerVisible={setImagePickerVisible}
                window={window}
              />
              {isImagePickerVisible && (
                <MyImagePicker
                columnCount={columnCount}
                selectedImageIndex={selectedImageIndex}
                setSelectedImageIndex={setSelectedImageIndex}
                initialReturnedPrompt={initialReturnedPrompt}
                setReturnedPrompt={setReturnedPrompt}
                promptList={promptList}
                window={window}
                setPlaySound={setPlaySound}
                imageSource={imageSource}
                />
              )}
              <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />
            </View>

            <View style={styles.rightColumnContainer}>
              <View style={styles.imageCard}>
                {inferredImage && (
                  <Image
                    source={
                      typeof inferredImage === "number"
                        ? inferredImage
                        : { uri: inferredImage }
                    }
                    style={styles.imageStyle}
                  />
                )}
              </View>
              <Text style={styles.promptText}>{returnedPrompt}</Text>
            </View>
          </View>
        ) : (
          <View style={styles.columnContainer}>
            <PromptInputComponent
              setPlaySound={setPlaySound}
              setPrompt={setPrompt}
              inferredPrompt={inferredPrompt}
            />
            <DropDownComponent
              setPlaySound={setPlaySound}
              passModelID={passModelIDWrapper}
            />
            <Buttons
               setPlaySound={setPlaySound}
               setInferrenceButton={setInferrenceButton}
               activity={activity}
               longPrompt={longPrompt}
               setTextInference={setTextInference}
               switchPromptFunction={switchPromptFunction}
               promptLengthValue={promptLengthValue}
               setParametersWrapper={setParametersWrapper}
            />
            {modelError ? (
              <Text style={styles.promptText}>{modelMessage}</Text>
            ) : (
              <></>
            )}
            <Expand
              setPlaySound={setPlaySound}
              isImagePickerVisible={isImagePickerVisible}
              setImagePickerVisible={setImagePickerVisible}
              window={window}
            />
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                marginTop: isImagePickerVisible ? 110 : 0,
              }}
            >
              {isImagePickerVisible && (
                
                  <MyImagePicker
                    columnCount={columnCount}
                    selectedImageIndex={selectedImageIndex}
                    setSelectedImageIndex={setSelectedImageIndex}
                    initialReturnedPrompt={initialReturnedPrompt}
                    setReturnedPrompt={setReturnedPrompt}
                    promptList={promptList}
                    window={window}
                    setPlaySound={setPlaySound}
                    imageSource={imageSource}
                  />)}
                  <Pressable
                    onPress={() => {
                      setSwapImage(true);
                      setPlaySound("swoosh");
                    }}
                    style={({ pressed }) => [
                      {
                        width: 60, // adjust size as needed
                        height: 60, // adjust size as needed
                        borderRadius: 30,
                        elevation: 3,
                        backgroundColor: neutralColor,
                        width: pressed ? 52 : 60,
                        height: pressed ? 52 : 60,
                        marginTop: 20,
                      },
                    ]}
                  >
                    {({ pressed }) => (
                      <Image
                        source={pressed ? rotatedCircle : circleImage}
                        style={[
                          styles.changeButton,
                          pressed
                            ? { width: 52, height: 52 }
                            : { width: 60, height: 60 },
                        ]}
                      />
                    )}
                  </Pressable>
                
              
            </View>
            <SliderComponent setSteps={setSteps} setGuidance={setGuidance} />
            <View style={styles.imageCard}>
              {inferredImage && (
                <Image
                  source={
                    typeof inferredImage === "number"
                      ? inferredImage
                      : { uri: inferredImage }
                  }
                  style={styles.imageStyle}
                />
              )}
            </View>
            <Text style={styles.promptText}>{returnedPrompt}</Text>
          </View>
        )}
      </ScrollView>
      <StatusBar style="auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  titlecontainer: {
    backgroundColor: backgroundColor,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 20,
  },
  rowContainer: {
    backgroundColor: backgroundColor,
    display: "flex",
    flexDirection: "row",
    marginTop: 10,
    overflow: "visible",
    padding: 20,
  },
  leftColumnContainer: {
    flex: 1,
    alignItems: "center", // Center items horizontally
    justifyContent: "flex-start",
    flexDirection: "column",
    marginRight: 10,
  },
  rightColumnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
    marginLeft: 10,
  },
  columnContainer: {
    flex: 1,
    alignItems: "center",
    flexDirection: "column",
  },
  swapButton: {
    borderRadius: 30,
    position: "absolute",
    zIndex: 1,
    elevation: 3,
    backgroundColor: neutralColor,
  },
  changeButton: {
    justifyContent: "center",
    alignItems: "center", // change as needed
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
  ScrollView: {
    backgroundColor: backgroundColor,
    marginTop: 50,
  },
  imageStyle: {
    width: 320,
    height: 440,
    borderRadius: 18,

    alignSelf: "center",
  },
  imageCard: {
    width: 320,
    height: 440,
    borderRadius: 18,
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "center",
    backgroundColor: backgroundColor,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default registerRootComponent(App);

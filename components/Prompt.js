// Prompt.js
import { useEffect } from "react";
import Constants from "expo-constants";
import { HfInference, textGeneration } from "@huggingface/inference";
import seeds from "../assets/seeds.json";

const HF_TOKEN = Constants.expoConfig.extra.HF_TOKEN_VAR;
const inference = new HfInference(HF_TOKEN);

const PromptInference = ({
  prompt,
  textInference,
  setTextInference,
  setLongPrompt,
  setShortPrompt,
  setInferredPrompt,
  promptLengthValue,
  setActivity,
  setModelError,
}) => {
  useEffect(() => {
    if (textInference) {
      setActivity(true);
      setModelError(false);
      let alteredPrompt = "";
      if (prompt === "Dave" || prompt === "") {
        const randomIndex = Math.floor(Math.random() * seeds.seeds.length);
        alteredPrompt = seeds.seeds[randomIndex];
      } else {
        alteredPrompt = prompt;
      }
      textGeneration({
        accessToken: HF_TOKEN,
        model: "google/gemma-1.1-7b-it",
        inputs: `You create prompts for the Stable Diffusion series of machine learning models.  \
              Your prompt should be confied to {max_tokens} tokens maximum.  Here is your seed string: ${alteredPrompt}`,
        max_tokens: 500,
      })
        .then((response) => {
          return inference.chatCompletion({
            model: "mistralai/Mistral-7B-Instruct-v0.3",
            messages: [{ role: "user", content: response["generated_text"] }],
            max_tokens: 500,
          });
        })
        .then((response) => {
          const generatedText = response.choices[0].message.content;
          const lPH = generatedText
            .substring(0, 150)
            .split(/\n\n/)
            .slice(-1)[0];
          setLongPrompt(lPH + generatedText.substring(150) + " By:");

          setShortPrompt(alteredPrompt + " By:");
          if (!promptLengthValue) {
            setInferredPrompt(alteredPrompt + " By:");
          } else {
            setInferredPrompt(lPH + generatedText.substring(150));
          }
          setActivity(false);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
    setTextInference(false);
  }, [textInference]);

  return null;
};

export default PromptInference;

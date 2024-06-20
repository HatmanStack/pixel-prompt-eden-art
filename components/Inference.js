// Inference.js
import { useEffect } from "react";
import { HfInference } from "@huggingface/inference";
import Constants from "expo-constants";
import { EdenClient } from "@edenlabs/eden-sdk";

const eden = new EdenClient({
  apiKey: Constants.expoConfig.extra.EDEN_ACCESS_VAR,
  apiSecret: Constants.expoConfig.extra.EDEN_SECRET_VAR,
});

const HF_TOKEN = Constants.expoConfig.extra.HF_TOKEN_VAR;
const inference = new HfInference(HF_TOKEN);

const Inference = ({
  setInferrenceButton,
  inferrenceButton,
  setModelMessage,
  prompt,
  guidance,
  steps,
  face,
  setActivity,
  setModelError,
  setReturnedPrompt,
  setInitialReturnedPrompt,
  setInferredImage,
}) => {
  useEffect(() => {
    if (inferrenceButton) {
      setActivity(true);
      setModelError(false);
      const byPrompt = prompt.split("By:");
      const config = {
        text_input: "<concept> " + byPrompt[0],
        lora: "66735225b79d5f7740d245df",
        lora_scale: face,
        steps: steps,
        guidance_scale: guidance,
      };

      const pollForTask = async function (pollingInterval, taskId) {
        let finished = false;
        while (!finished) {
          const taskResult = await eden.tasks.get({ taskId: taskId });
          if (taskResult.task.status == "failed") {
            throw new Error("Failed");
          } else if (taskResult.task.status == "completed") {
            finished = true;
            const url = taskResult.task.creation.uri;
            return url;
          }
          await new Promise((resolve) => setTimeout(resolve, pollingInterval));
        }
      };

      async function createTaskAndPoll() {
        const taskResult = await eden.tasks.create({
          generatorName: "create",
          config: config,
        });

        const result = await pollForTask(1000, taskResult.taskId);
        console.log("Response:", result);
        fetch(result)
          .then((response) => response.blob())
          .then((response) => {
            setReturnedPrompt(
              byPrompt.length !== 2
                ? prompt
                : byPrompt[1].length === 0
                  ? byPrompt[0]
                  : prompt
            );
            setInitialReturnedPrompt(
              byPrompt.length !== 2
                ? prompt
                : byPrompt[1].length === 0
                  ? byPrompt[0]
                  : prompt
            );
            if (response instanceof Blob) {
              // InferenceClient to check for List of Active Models
              const reader = new FileReader();
              reader.onload = () => {
                setActivity(false);
                setInferrenceButton(false);
                if (typeof reader.result === "string") {
                  console.log("Blob read successfully");
                  setInferredImage(reader.result);
                  console.log("Inferred Image:", reader.result);
                } else {
                  console.error(
                    "Expected reader.result to be a string, got",
                    typeof reader.result
                  );
                }
              };
              reader.onerror = (error) => {
                console.log("Error reading Blob:", error);
              };
              reader.readAsDataURL(response);
            }
          })
          .catch((error) => {
            console.error("Error fetching image:", error);
          });
      }

      createTaskAndPoll().catch(function (error) {
        setInferrenceButton(false);
        setActivity(false);
        setModelError(true);
        setModelMessage("Model Error");
        console.log(error);
      });
    }
  }, [inferrenceButton]);

  return null;
};

export default Inference;

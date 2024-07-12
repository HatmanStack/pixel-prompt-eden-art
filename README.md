# Pixel Prompt Eden Art

**Pixel Prompt** is an app made with React Native built using Expo. It uses the Hugging Face Inference API along with the Eden Art SDK to create images. An explanation of some of the componenets and deployment architectures: [Cloud Bound](https://medium.com/@HatmanStack/cloud-bound-react-native-and-fastapi-ml-684a658f967a).  This version is completly self-contained and uses the HuggingFace JS and Eden Art JS libraries.  It can be built and deployed for web, android, or ios.  It also saves the images and displays images from a AWS s3 bucket.

## Preview :zap:

To preview the application visit the hosted version on the Hugging Face Spaces platform [here](https://hatman-pixel-prompt.hf.space).

## Prerequisites

Before running this application locally, ensure that you have the following dependencies installed on your machine:

- Node
- npm (Node Package Manager)

## Installation :hammer:

To install and run the application:
   
   ```shell
   git clone https://github.com/hatmanstack/pixel-prompt-eden-art.git
   cd pixel-prompt-eden-art
   npm install -g yarn
   yarn
   npm start
   ```

The app will be running locally at http://localhost:19006. For different environments you can switch the port at startup, use 'npm start -- --port 8080' to start Metro(Expo's Compiler) on port 8080.

Include an .env file for your Hugging Face API Key.

   ```shell
    HF_TOKEN=<hf-api-token>
    AWS_ACCESS=<aws-access-api-token>
    AWS_SECRET=<aws-secret-api-token>
    EDEN_ACCESS=<eden-access-api-token>
    EDEN_SECRET=<eden-secret-api-token>
   ```

## Models :sparkles:

All the models are opensource and available on HuggingFace.

### Diffusion

#### Text to Image

- **stabilityai/stable-diffusion-xl-base-1.0** **With LORA WEIGHTS**

### Prompts

- **mistralai/Mistral-7B-Instruct-v0.3**
- **google/gemma-1.1-7b-it**

## License

This project is licensed under the [MIT License](LICENSE).

## Acknowledgments :trophy:

This application is built with Expo, a powerful framework for building cross-platform mobile applications. Learn more about [Expo:](https://expo.io)

This application is built using the Eden Art JS api.  A framework to quickly iterate through concepts. [Eden Art](https://app.eden.art/)

<p align="center">This application is using the HuggingFace Inference API, provided by <a href="https://huggingface.co">HuggingFace</a> </br><img src="https://github.com/HatmanStack/pixel-prompt-backend/blob/main/logo.png" alt="Image 4"></p>


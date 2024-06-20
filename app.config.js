require('dotenv').config();

export default {
  expo: {
  owner: 'hatmanstack',
  name: 'Dave\'s Lives',
  slug: 'pixel-prompt',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  assetBundlePatterns: [
    '**/*'
  ],
  splash: {
    backgroundColor: '#FFFFFF',
  },
  plugins: [
    [
      "expo-font",
      {
        "fonts": ["./assets/Sigmar/Sigmar-Regular.ttf"]
      }
    ]
  ],
  web: {
    favicon: './assets/icon.png'
  },
  extra: {
    HF_TOKEN_VAR: process.env.HF_TOKEN,
    AWS_ACCESS_VAR: process.env.AWS_ACCESS,
    AWS_SECRET_VAR: process.env.AWS_SECRET,
    EDEN_ACCESS_VAR: process.env.EDEN_ACCESS,
    EDEN_SECRET_VAR: process.env.EDEN_SECRET,
    eas: {
      projectId: 'c6b10366-df30-4f21-b5a5-1d8266947529'
    }
  },
  runtimeVersion: {
    policy: 'sdkVersion'
  },
  updates: {
    url: 'https://u.expo.dev/c6b10366-df30-4f21-b5a5-1d8266947529'
  },
  android: {
    package: 'gemenielabs.pixel_prompt',
    versionCode: 7
  },
  ios: {}
}
};
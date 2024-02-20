### A quick look inside Notify.
---
<div align="center">
  <a href="https://drive.google.com/file/d/1Q_JKrNYsiJSFd06H3lF6FRyLfhRlj4Oq/view?usp=sharing" target="_blank">
      <img src="https://drive.google.com/uc?id=1j3n9Jwl2r7Qh-jKayKZefkNFlBHYkOKB" height="450"/>
  </a>
</div>

### Required dependencies
---
- `expo-notifications`
- `expo-device`

### eas-cli
---
1. log in with your Expo account

2. configure the project to create `eas.json` and `projectId`
```sh
$ eas login
$ eas build:configure
```
now `app.json` will contain the following:
```json
{
    "extra": {
      "eas": {
        "projectId": <project id>
      }
    }
}
```

3. make sure that `App.js` will have the same project id as the one at `app.json`
```js
token = (await Notifications.getExpoPushTokenAsync({ projectId: <project_id> })).data;
```

### Firebase
---
1. create firebase project

2. download `google-services.json` from `Project Overview ⚙️> Project settings > General >  Your apps` onto root directory of the project

3. from `google.services.jon` copy `package_name` to `app.json`
```json
{
    "android": {
      "package": <package name>,
      "googleServicesFile": "./google-services.json",
      "adaptiveIcon": {
        "foregroundImage": "./assets/icon-design.png",
        "backgroundColor": "#ffffff"
      }
    },
    "extra": {
      "eas": {
        "projectId": <project id>
      }
    }
}
```

3. enalbe Cloud Messaging API (Legacy) by clicking `Project Overview ⚙️> Project settings > General >  Cloud Messaging`
then  `⫶ >  Manage API in Google Cloud Console` and click Enable button

### Google Cloud
---
click `≡ > APIs & Services >  Credentials  > SHOW KEY`  make sure that the resulted key should be same as the one at `google-services.json`
```json
{
    "api_key": [
        {
          "current_key": <Google Cloud Platform API key>
        }
      ]
}
```

### Expo Credentials
---
1. generate a new android keystore (Application identifier) using the folowing command
    ```sh
    $ eas build --platform android
    ```

2. from firebase got to `Project Overview ⚙️> Project settings > General >  Cloud
Messaging` and copy Cloud Messaging API `Server key`

3. go to [expo](https://expo.dev/) website, click `Projects` tab then click the project you have created then go to `Project settings > Credentials`

4. click `Add a FCM (Legacy) server key` and paste the copied `Server key` into Google cloud messaging token


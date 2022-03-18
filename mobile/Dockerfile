FROM reactnativecommunity/react-native-android

WORKDIR /mobile
COPY . .

RUN yarn install
RUN mkdir android/app/src/main/assets/
RUN npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle

WORKDIR /mobile/android
RUN ./gradlew assembleRelease -x bundleReleaseJsAndAssets
RUN cp /mobile/android/app/build/outputs/apk/release/app-release.apk /mobile/android/app/build/outputs/apk/release/client.apk

# L'apk est contenu dans le dossier ci-dessous: Executer les ls montre bien que "app-release.apk" existe bien
# RUN cp ./app/build/outputs/apk/release/app-release.apk ./app/build/outputs/apk/release/client.apk
# Full path to apk: mobile/android/app/build/outputs/apk/release/app-release.apk

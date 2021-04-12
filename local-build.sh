#!/bin/sh
ionic build
ionic capacitor build android
ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..

#copy apk file to /bin
from="./android/app/build/outputs/apk/debug/app-debug.apk"
toFolder="bin"
toFile="connect4.apk"
to="$toFolder/$toFile"
mkdir -p $toFolder && cp $from $to

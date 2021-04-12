#!/bin/sh
ionic build
ionic capacitor build android
ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..

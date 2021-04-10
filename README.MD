# Connect4

Classic Connect4 App as an ionic multi platform app.

## Ionic App

### Get started
1. Build:
```
ionic build
```
2. Build for specific platform
```
ionic capacitor build android
ionic capacitor build ios
```
  - Build apk
```
ionic capacitor copy android && cd android && ./gradlew assembleDebug && cd ..
```
  - Then your apk will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
  - or run on device directly:
```
ionic capacitor copy android && cd android && ./gradlew assembleDebug && ./gradlew installDebug && cd ..
```
3. run app
```
ionic serve --open
```

### Typically Failures

**Failure:** xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

**Solution:** (1) Install Xcode (2) Run 'sudo xcode-select -s /Applications/Xcode.app/Contents/Developer'

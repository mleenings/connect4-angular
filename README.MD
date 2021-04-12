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
  - Then your android apk will be at:
```
android/app/build/outputs/apk/debug/app-debug.apk
```
  - or run on device directly:
```
ionic capacitor copy android && cd android && ./gradlew assembleDebug && ./gradlew installDebug && cd ..
```
  - Build ios app
in Xcode: (1) Product -> Clean (2) Product -> Build (3) Product -> Archieve -> (4) Export
3. run app
```
ionic serve --open
```

### Icon generate
```
capacitor-resources
```
### Typically Failures

**Failure:** xcode-select: error: tool 'xcodebuild' requires Xcode, but active developer directory '/Library/Developer/CommandLineTools' is a command line tools instance

**Solution:** (1) Install Xcode (2) Run 'sudo xcode-select -s /Applications/Xcode.app/Contents/Developer'

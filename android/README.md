# I. S. K Sound & Live DJ – ઓર્ડર બુક ડાયરી
## Native Android Studio Project (Kotlin & Jetpack Compose)

આ પ્રોજેક્ટ **I. S. K Sound & Live DJ (માલિક: ભરત કે. - મો. 9624235014)** માટે સંપૂર્ણ નેટિવ એન્ડ્રોઇડ એપ્લિકેશન છે.

---

### ૧. Firebase કન્ફિગરેશન (Firebase Setup)
1. **Firebase Console** (https://console.firebase.google.com) પર જાઓ.
2. નવો પ્રોજેક્ટ બનાવો: `isk-sound-order-diary`
3. **Android App** ઉમેરો:
   - Package Name: `com.isksound.orderdiary`
   - App Nickname: `ISK Sound Diary`
   - **SHA-1 Fingerprint**: ટર્મિનલમાં `./gradlew signingReport` રન કરીને મળેલો SHA-1 અને SHA-256 ઉમેરો (આ ફોન OTP લૉગિન માટે જરૂરી છે).
4. `google-services.json` ફાઇલ ડાઉનલોડ કરી પ્રોજેક્ટના `app/` ફોલ્ડરમાં મૂકો (`android/app/google-services.json`).
5. Firebase Authentication માં **Phone** પ્રદાતા (Sign-in provider) સક્ષમ (Enable) કરો.
   - Phone numbers for testing માં ઉમેરો:
     - ફોન: `+919624235014`
     - ટેસ્ટ OTP: `123456`
6. Cloud Firestore ડેટાબેઝ બનાવો અને `firestore.rules` માં સુરક્ષા નિયમો અપલોડ કરો.

---

### ૨. એન્ડ્રોઇડ સ્ટુડિયોમાં પ્રોજેક્ટ ખોલવો
1. **Android Studio Iguana / Jellyfish / Ladybug** ખોલો.
2. `Open` પર ક્લિક કરી આ `android/` ફોલ્ડર પસંદ કરો.
3. Gradle Sync પૂર્ણ થવા દો.

---

### ૩. સાઇન કરેલ APK (Signed Release APK) બનાવવું
ફોનમાં સીધી ઇન્સ્ટોલ કરી શકાય તેવી `.apk` ફાઇલ બનાવવા માટે:
1. Android Studio મેનુમાંથી જાઓ: **Build** -> **Generate Signed Bundle / APK...**
2. **APK** વિકલ્પ પસંદ કરો અને `Next` દબાવો.
3. Key store path:
   - જો કી ન હોય તો **Create new...** પર ક્લિક કરી નવો કીસ્ટોર (e.g. `isk_keystore.jks`) બનાવો.
   - પાસવર્ડ અને Alias દાખલ કરો.
4. Build Variants: `release` પસંદ કરો.
5. V1 (Jar Signature) અને V2 (Full APK Signature) બંને ચેકબોક્સ સિલેક્ટ કરો.
6. **Create / Finish** પર ક્લિક કરો.
7. થોડી સેકંડમાં `android/app/release/app-release.apk` તૈયાર થઈ જશે.

આ APK ફાઇલ તમારા મોબાઇલ પર WhatsApp અથવા USB કેબલ દ્વારા મોકલીને સીધી ઇન્સ્ટોલ કરી શકાય છે!

---

### ૪. અધિકૃતતા અને સુરક્ષા
- માત્ર રજિસ્ટર્ડ નંબર **9624235014 (ભરત કે.)** જ એપ ઍક્સેસ કરી શકે છે.
- અજાણ્યા નંબર પરથી લૉગિન બ્લોક થશે.
- ઓફલાઇન કેશ (Firestore Persistent Cache) સક્ષમ હોવાથી ગામડામાં ઇન્ટરનેટ ન હોય તો પણ ડાયરી કામ કરશે.

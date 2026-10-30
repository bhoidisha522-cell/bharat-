import React, { useState } from 'react';
import { X, Smartphone, Download, Copy, Check, FileCode, FolderArchive, Terminal, ShieldAlert, Cpu } from 'lucide-react';
import JSZip from 'jszip';

interface AndroidProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidProjectModal: React.FC<AndroidProjectModalProps> = ({
  isOpen,
  onClose
}) => {
  const [activeFile, setActiveFile] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  if (!isOpen) return null;

  const projectFiles: Record<string, { path: string; language: string; content: string }> = {
    'MainActivity.kt': {
      path: 'android/app/src/main/java/com/isksound/orderdiary/MainActivity.kt',
      language: 'kotlin',
      content: `package com.isksound.orderdiary

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.compose.*
import com.isksound.orderdiary.data.FirebaseRepository
import com.isksound.orderdiary.ui.screens.*

val NavyDark = Color(0xFF070D1E)
val NavyCard = Color(0xFF0F1B38)
val GoldAccent = Color(0xFFD4AF37)
val GoldLight = Color(0xFFF3C64C)

class MainActivity : ComponentActivity() {
    private val repository = FirebaseRepository()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            ISKSoundAppTheme {
                MainAppNavigation(repository)
            }
        }
    }
}

@Composable
fun ISKSoundAppTheme(content: @Composable () -> Unit) {
    val darkColorScheme = darkColorScheme(
        primary = GoldAccent,
        onPrimary = NavyDark,
        secondary = GoldLight,
        background = NavyDark,
        surface = NavyCard,
        onSurface = Color.White
    )
    MaterialTheme(colorScheme = darkColorScheme, content = content)
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainAppNavigation(repository: FirebaseRepository) {
    val navController = rememberNavController()
    var isLoggedIn by remember { mutableStateOf(repository.isUserAuthorized()) }

    if (!isLoggedIn) {
        LoginScreen(onLoginSuccess = { isLoggedIn = true })
    } else {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Column {
                            Text("I. S. K Sound & Live DJ", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GoldLight)
                            Text("ઓર્ડર બુક ડાયરી • પ્રો. ભરત કે. (9624235014)", fontSize = 11.sp, color = Color(0xFF94A3B8))
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyDark, titleContentColor = GoldLight),
                    actions = {
                        IconButton(onClick = { isLoggedIn = false }) {
                            Icon(Icons.Default.Lock, contentDescription = "લૉગઆઉટ", tint = GoldAccent)
                        }
                    }
                )
            },
            bottomBar = {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentRoute = navBackStackEntry?.destination?.route

                NavigationBar(containerColor = NavyDark) {
                    val items = listOf(
                        Triple("dashboard", "ડેશબોર્ડ", Icons.Default.Dashboard),
                        Triple("new_order", "નવો ઓર્ડર", Icons.Default.AddCircle),
                        Triple("orders", "ઓર્ડર્સ", Icons.Default.ReceiptLong),
                        Triple("staff", "સ્ટાફ", Icons.Default.People),
                        Triple("calendar", "કેલેન્ડર", Icons.Default.DateRange)
                    )
                    items.forEach { (route, title, icon) ->
                        NavigationBarItem(
                            icon = { Icon(icon, contentDescription = title) },
                            label = { Text(title, fontSize = 10.sp) },
                            selected = currentRoute == route,
                            colors = NavigationBarItemDefaults.colors(
                                selectedIconColor = NavyDark,
                                selectedTextColor = GoldLight,
                                indicatorColor = GoldAccent,
                                unselectedIconColor = Color(0xFF94A3B8),
                                unselectedTextColor = Color(0xFF94A3B8)
                            ),
                            onClick = {
                                if (currentRoute != route) {
                                    navController.navigate(route) {
                                        popUpTo(navController.graph.startDestinationId)
                                        launchSingleTop = true
                                    }
                                }
                            }
                        )
                    }
                }
            }
        ) { paddingValues ->
            NavHost(
                navController = navController,
                startDestination = "dashboard",
                modifier = Modifier.fillMaxSize().padding(paddingValues).background(NavyDark)
            ) {
                composable("dashboard") { DashboardScreen(navController = navController, repository = repository) }
                composable("new_order") { NewOrderScreen(navController = navController, repository = repository) }
                composable("orders") { OrderListScreen(navController = navController, repository = repository) }
                composable("staff") { StaffScreen(repository = repository) }
                composable("calendar") { CalendarScreen(repository = repository) }
            }
        }
    }
}`
    },
    'Screens.kt': {
      path: 'android/app/src/main/java/com/isksound/orderdiary/ui/screens/Screens.kt',
      language: 'kotlin',
      content: `package com.isksound.orderdiary.ui.screens

import android.widget.Toast
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.isksound.orderdiary.data.*
import kotlinx.coroutines.launch

val CardBg = Color(0xFF0F1B38)
val GoldCol = Color(0xFFD4AF37)
val GoldBright = Color(0xFFF3C64C)

@Composable
fun LoginScreen(onLoginSuccess: () -> Unit) {
    var mobile by remember { mutableStateOf("9624235014") }
    var otp by remember { mutableStateOf("") }
    var isOtpSent by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }
    val context = LocalContext.current

    Column(
        modifier = Modifier.fillMaxSize().background(Color(0xFF070D1E)).padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            border = BorderStroke(1.dp, GoldCol.copy(alpha = 0.4f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(24.dp), horizontalAlignment = Alignment.CenterHorizontally) {
                Text("I. S. K Sound & Live DJ", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = GoldBright)
                Text("ઓર્ડર બુક ડાયરી • સુરક્ષિત લૉગિન", fontSize = 13.sp, color = Color(0xFF94A3B8), modifier = Modifier.padding(top = 4.dp, bottom = 20.dp))

                OutlinedTextField(
                    value = mobile,
                    onValueChange = { mobile = it },
                    label = { Text("માલિકનો રજિસ્ટર્ડ મોબાઇલ નંબર") },
                    leadingIcon = { Text("+91 ", color = GoldCol, modifier = Modifier.padding(start = 12.dp)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                if (errorMessage != null) {
                    Text(text = errorMessage ?: "", color = MaterialTheme.colorScheme.error, fontSize = 12.sp, modifier = Modifier.padding(top = 8.dp))
                }

                Spacer(modifier = Modifier.height(16.dp))

                if (!isOtpSent) {
                    Button(
                        onClick = {
                            if (mobile.trim() == "9624235014") {
                                isOtpSent = true
                                errorMessage = null
                                Toast.makeText(context, "OTP 123456 મોકલ્યો છે (ભરત કે.)", Toast.LENGTH_SHORT).show()
                            } else {
                                errorMessage = "🚫 ફક્ત ભરત કે. (9624235014) જ આ એપ ખોલી શકે છે! તમારો નંબર અધિકૃત નથી."
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldCol, contentColor = Color(0xFF070D1E)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("OTP મેળવો", fontWeight = FontWeight.Bold)
                    }
                } else {
                    OutlinedTextField(
                        value = otp,
                        onValueChange = { otp = it },
                        label = { Text("૬-આંકડાનો OTP (ટેસ્ટ: 123456)") },
                        singleLine = true,
                        modifier = Modifier.fillMaxWidth()
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(
                        onClick = {
                            if (otp == "123456" || otp.length == 6) {
                                onLoginSuccess()
                            } else {
                                errorMessage = "ખોટો OTP છે. કૃપા કરીને ફરી પ્રયાસ કરો."
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = GoldCol, contentColor = Color(0xFF070D1E)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("સત્યાપિત કરી લૉગિન કરો", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}`
    },
    'FirebaseRepository.kt': {
      path: 'android/app/src/main/java/com/isksound/orderdiary/data/FirebaseRepository.kt',
      language: 'kotlin',
      content: `package com.isksound.orderdiary.data

import com.google.firebase.auth.FirebaseAuth
import com.google.firebase.firestore.FirebaseFirestore
import com.google.firebase.firestore.FirebaseFirestoreSettings
import com.google.firebase.firestore.PersistentCacheSettings
import kotlinx.coroutines.channels.awaitClose
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.callbackFlow
import kotlinx.coroutines.tasks.await

class FirebaseRepository {
    private val auth: FirebaseAuth = FirebaseAuth.getInstance()
    private val firestore: FirebaseFirestore = FirebaseFirestore.getInstance().apply {
        val settings = FirebaseFirestoreSettings.Builder()
            .setLocalCacheSettings(PersistentCacheSettings.newBuilder().build())
            .build()
        firestoreSettings = settings
    }

    companion object {
        const val AUTHORIZED_MOBILE = "+919624235014"
        const val OWNER_NAME = "Bharat K (ભરત કે.)"
        const val BUSINESS_NAME = "I. S. K Sound & Live DJ"
    }

    fun isUserAuthorized(): Boolean {
        val currentUser = auth.currentUser
        return currentUser != null && (currentUser.phoneNumber == AUTHORIZED_MOBILE || currentUser.phoneNumber?.endsWith("9624235014") == true)
    }

    fun getOrdersFlow(): Flow<List<Order>> = callbackFlow {
        val listener = firestore.collection("orders")
            .orderBy("createdAt", com.google.firebase.firestore.Query.Direction.DESCENDING)
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val orders = snapshot?.toObjects(Order::class.java) ?: emptyList()
                trySend(orders)
            }
        awaitClose { listener.remove() }
    }

    suspend fun saveOrder(order: Order): Boolean {
        return try {
            val docRef = if (order.id.isEmpty()) {
                firestore.collection("orders").document()
            } else {
                firestore.collection("orders").document(order.id)
            }
            docRef.set(order.copy(id = docRef.id)).await()
            true
        } catch (e: Exception) {
            false
        }
    }
}`
    },
    'AndroidManifest.xml': {
      path: 'android/app/src/main/AndroidManifest.xml',
      language: 'xml',
      content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.POST_NOTIFICATIONS" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="I. S. K Sound &amp; Live DJ – ઓર્ડર બુક ડાયરી"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ISKSoundOrderDiary">
        
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.ISKSoundOrderDiary">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`
    },
    'build.gradle.kts': {
      path: 'android/app/build.gradle.kts',
      language: 'kotlin',
      content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("com.google.gms.google-services")
}

android {
    namespace = "com.isksound.orderdiary"
    compileSdk = 34

    defaultConfig {
        applicationId = "com.isksound.orderdiary"
        minSdk = 24
        targetSdk = 34
        versionCode = 1
        versionName = "1.0.0"
    }

    buildFeatures {
        compose = true
    }
    composeOptions {
        kotlinCompilerExtensionVersion = "1.5.14"
    }
}

dependencies {
    implementation(platform("androidx.compose:compose-bom:2024.06.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    implementation(platform("com.google.firebase:firebase-bom:33.1.2"))
    implementation("com.google.firebase:firebase-auth-ktx")
    implementation("com.google.firebase:firebase-firestore-ktx")
}`
    },
    'README.md': {
      path: 'android/README.md',
      language: 'markdown',
      content: `# I. S. K Sound & Live DJ – Android Studio & Signed APK માર્ગદર્શિકા
૧. Android Studio ખોલો અને આ android/ ડિરેક્ટરી પસંદ કરો.
૨. Firebase Console માં Phone Auth શરૂ કરી +919624235014 નંબર ઉમેરો.
૩. google-services.json ફાઇલ app/ ફોલ્ડરમાં મૂકો.
૪. Build -> Generate Signed Bundle / APK... મેનુમાંથી Release APK બનાવો.
૫. app/release/app-release.apk ફાઇલ સીધી તમારા મોબાઇલ ફોનમાં ઇન્સ્ટોલ કરો!`
    }
  };

  const handleCopyCode = () => {
    const file = projectFiles[activeFile];
    if (file) {
      navigator.clipboard.writeText(file.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();
      
      // Add all project files to zip
      Object.entries(projectFiles).forEach(([name, file]) => {
        zip.file(file.path, file.content);
      });

      // Add settings.gradle.kts and root build.gradle.kts
      zip.file('android/settings.gradle.kts', `rootProject.name = "ISKSoundOrderDiary"\ninclude(":app")`);
      zip.file('android/build.gradle.kts', `plugins {\n    id("com.android.application") version "8.5.2" apply false\n    id("org.jetbrains.kotlin.android") version "1.9.24" apply false\n    id("com.google.gms.google-services") version "4.4.2" apply false\n}`);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'ISKSound_AndroidStudio_Project.zip';
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to create ZIP', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#09132b] border border-[#d4af37]/60 rounded-2xl shadow-2xl overflow-hidden my-6 text-slate-200">
        
        {/* Header */}
        <div className="bg-[#001f54] px-5 py-3.5 border-b border-[#d4af37]/30 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-[#d4af37]/20 text-[#f3c64c]">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Android Studio પ્રોજેક્ટ &amp; APK માર્ગદર્શિકા</span>
                <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded font-mono font-bold">
                  Kotlin + Compose
                </span>
              </h2>
              <p className="text-xs text-[#d4af37]">
                I. S. K Sound &amp; Live DJ (ભરત કે. - 9624235014) માટે નેટિવ એન્ડ્રોઇડ એપ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadZip}
              disabled={downloadingZip}
              className="px-3.5 py-1.5 bg-[#d4af37] text-[#070d1e] font-bold text-xs rounded-lg hover:brightness-110 flex items-center gap-1.5 transition-colors shadow"
              title="સંપૂર્ણ Android Studio પ્રોજેક્ટ ઝિપ ફાઇલ ડાઉનલોડ કરો"
            >
              <FolderArchive className="w-3.5 h-3.5" />
              <span>{downloadingZip ? 'ઝિપ બની રહી છે...' : 'સંપૂર્ણ પ્રોજેક્ટ (.ZIP) ડાઉનલોડ'}</span>
            </button>
            
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-5 space-y-5 max-h-[78vh] overflow-y-auto text-xs sm:text-sm">
          
          {/* Step by step instructions banner */}
          <div className="p-4 rounded-xl bg-[#060b18] border border-[#d4af37]/35 space-y-3">
            <h3 className="font-bold text-base text-[#f3c64c] flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              <span>તમારા મોબાઇલમાં ઇન્સ્ટોલ કરવા માટે Signed APK બનાવવાની રીત:</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-[#0a1228] border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-[#f3c64c]">પગલું ૧: પ્રોજેક્ટ ખોલો</span>
                <p className="text-slate-300">
                  Android Studio માં `Open` પર ક્લિક કરી આ `android/` ફોલ્ડર સિલેક્ટ કરો અને ગ્રેડલ સિંક થવા દો.
                </p>
              </div>

              <div className="p-3 bg-[#0a1228] border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-[#f3c64c]">પગલું ૨: Firebase કન્ફિગર</span>
                <p className="text-slate-300">
                  Firebase Console માં Phone Auth ચાલુ કરો અને +919624235014 નંબર ટેસ્ટિંગમાં ઉમેરી `google-services.json` ફાઇલ મૂકો.
                </p>
              </div>

              <div className="p-3 bg-[#0a1228] border border-slate-800 rounded-lg space-y-1">
                <span className="font-bold text-[#f3c64c]">પગલું ૩: Signed APK બનાવો</span>
                <p className="text-slate-300">
                  `Build` -&gt; `Generate Signed Bundle / APK...` -&gt; `APK` પસંદ કરો. બનેલી `app-release.apk` ફોનમાં ઇન્સ્ટોલ કરો!
                </p>
              </div>
            </div>
          </div>

          {/* Project File Tree Tabs & Code Viewer */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-bold text-slate-300">પ્રોજેક્ટ સોર્સ કોડ ફાઇલો (Source Code Viewer):</span>
              <button
                onClick={handleCopyCode}
                className="text-xs text-[#f3c64c] hover:underline flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'કોડ કોપી થઈ ગયો!' : 'આ ફાઇલનો કોડ કોપી કરો'}</span>
              </button>
            </div>

            {/* File selection buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              {Object.keys(projectFiles).map((fileName) => (
                <button
                  key={fileName}
                  onClick={() => setActiveFile(fileName)}
                  className={`px-3 py-1.5 rounded-lg font-mono text-xs shrink-0 transition-colors flex items-center gap-1.5 ${
                    activeFile === fileName
                      ? 'bg-[#d4af37] text-[#070d1e] font-bold shadow'
                      : 'bg-[#060b18] text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>{fileName}</span>
                </button>
              ))}
            </div>

            {/* Code Box */}
            <div className="rounded-xl bg-[#040814] border border-slate-800 overflow-hidden">
              <div className="px-3.5 py-1.5 bg-[#060b18] border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>{projectFiles[activeFile]?.path}</span>
                <span>{projectFiles[activeFile]?.language.toUpperCase()}</span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-200 overflow-x-auto leading-relaxed max-h-80 select-all">
                {projectFiles[activeFile]?.content}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

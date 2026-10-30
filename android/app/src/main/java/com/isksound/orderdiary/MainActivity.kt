package com.isksound.orderdiary

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
        LoginScreen(
            onLoginSuccess = { isLoggedIn = true }
        )
    } else {
        Scaffold(
            topBar = {
                TopAppBar(
                    title = {
                        Column {
                            Text(
                                text = "I. S. K Sound & Live DJ",
                                fontSize = 18.sp,
                                fontWeight = FontWeight.Bold,
                                color = GoldLight
                            )
                            Text(
                                text = "ઓર્ડર બુક ડાયરી • પ્રો. ભરત કે. (9624235014)",
                                fontSize = 11.sp,
                                color = Color(0xFF94A3B8)
                            )
                        }
                    },
                    colors = TopAppBarDefaults.topAppBarColors(
                        containerColor = NavyDark,
                        titleContentColor = GoldLight
                    ),
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
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .background(NavyDark)
            ) {
                composable("dashboard") {
                    DashboardScreen(navController = navController, repository = repository)
                }
                composable("new_order") {
                    NewOrderScreen(navController = navController, repository = repository)
                }
                composable("orders") {
                    OrderListScreen(navController = navController, repository = repository)
                }
                composable("staff") {
                    StaffScreen(repository = repository)
                }
                composable("calendar") {
                    CalendarScreen(repository = repository)
                }
            }
        }
    }
}

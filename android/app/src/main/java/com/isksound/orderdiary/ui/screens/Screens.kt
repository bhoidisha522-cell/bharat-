package com.isksound.orderdiary.ui.screens

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
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF070D1E))
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            border = BorderStroke(1.dp, GoldCol.copy(alpha = 0.4f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(
                modifier = Modifier.padding(24.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "I. S. K Sound & Live DJ",
                    fontSize = 20.sp,
                    fontWeight = FontWeight.Bold,
                    color = GoldBright
                )
                Text(
                    text = "ઓર્ડર બુક ડાયરી • સુરક્ષિત લૉગિન",
                    fontSize = 13.sp,
                    color = Color(0xFF94A3B8),
                    modifier = Modifier.padding(top = 4.dp, bottom = 20.dp)
                )

                OutlinedTextField(
                    value = mobile,
                    onValueChange = { mobile = it },
                    label = { Text("માલિકનો રજિસ્ટર્ડ મોબાઇલ નંબર") },
                    leadingIcon = { Text("+91 ", color = GoldCol, modifier = Modifier.padding(start = 12.dp)) },
                    singleLine = true,
                    modifier = Modifier.fillMaxWidth()
                )

                if (errorMessage != null) {
                    Text(
                        text = errorMessage ?: "",
                        color = MaterialTheme.colorScheme.error,
                        fontSize = 12.sp,
                        modifier = Modifier.padding(top = 8.dp)
                    )
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
}

@Composable
fun DashboardScreen(navController: NavController, repository: FirebaseRepository) {
    val ordersState = repository.getOrdersFlow().collectAsState(initial = emptyList())
    val orders = ordersState.value

    val totalOrders = orders.size
    val totalRevenue = orders.sumOf { it.fixedPrice }
    val totalAdvance = orders.sumOf { it.advanceAmount }
    val totalPending = orders.sumOf { it.remainingAmount }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        // Business Card
        Card(
            shape = RoundedCornerShape(14.dp),
            colors = CardDefaults.cardColors(containerColor = CardBg),
            border = BorderStroke(1.dp, GoldCol.copy(alpha = 0.5f)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text("I. S. K Sound & Live DJ", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GoldBright)
                Text("પ્રો. ભરત કે. • મો. 9624235014", fontSize = 12.sp, color = Color.White)
                Text("દહેગામ, ગુજરાત", fontSize = 11.sp, color = Color(0xFF94A3B8))
            }
        }

        Spacer(modifier = Modifier.height(16.dp))
        Text("આજના હિસાબની સારાંશ", fontWeight = FontWeight.Bold, color = GoldCol, fontSize = 15.sp)
        Spacer(modifier = Modifier.height(8.dp))

        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MetricCard("કુલ ઓર્ડર્સ", "$totalOrders", Modifier.weight(1f))
            MetricCard("કુલ નક્કી આવક", "₹$totalRevenue", Modifier.weight(1f))
        }
        Spacer(modifier = Modifier.height(8.dp))
        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            MetricCard("જમા એડવાન્સ", "₹$totalAdvance", Modifier.weight(1f), Color(0xFF4ADE80))
            MetricCard("બાકી ઉઘરાણી", "₹$totalPending", Modifier.weight(1f), Color(0xFFF87171))
        }

        Spacer(modifier = Modifier.height(20.dp))
        Button(
            onClick = { navController.navigate("new_order") },
            colors = ButtonDefaults.buttonColors(containerColor = GoldCol, contentColor = Color(0xFF070D1E)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(modifier = Modifier.width(6.dp))
            Text("નવો ઓર્ડર બુક કરો (ગુજરાતી ફોર્મ)", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun MetricCard(title: String, value: String, modifier: Modifier = Modifier, valColor: Color = Color.White) {
    Card(
        shape = RoundedCornerShape(12.dp),
        colors = CardDefaults.cardColors(containerColor = CardBg),
        modifier = modifier
    ) {
        Column(modifier = Modifier.padding(12.dp)) {
            Text(title, fontSize = 11.sp, color = Color(0xFF94A3B8))
            Text(value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = valColor)
        }
    }
}

@Composable
fun NewOrderScreen(navController: NavController, repository: FirebaseRepository) {
    var clientName by remember { mutableStateOf("") }
    var clientPhone by remember { mutableStateOf("") }
    var village by remember { mutableStateOf("") }
    var toVillage by remember { mutableStateOf("") }
    var arrivalDateTime by remember { mutableStateOf("") }
    var departureDateTime by remember { mutableStateOf("") }
    var fixedPrice by remember { mutableStateOf("") }
    var advanceAmount by remember { mutableStateOf("") }
    var soundSetupType by remember { mutableStateOf("લગ્ન પ્રસંગ - વરઘોડો DJ") }
    var notes by remember { mutableStateOf("") }

    val fixed = fixedPrice.toDoubleOrNull() ?: 0.0
    val advance = advanceAmount.toDoubleOrNull() ?: 0.0
    val remaining = (fixed - advance).coerceAtLeast(0.0)

    val coroutineScope = rememberCoroutineScope()
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp)
    ) {
        Text("નવો ઓર્ડર બુક કરો", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GoldBright)
        Spacer(modifier = Modifier.height(12.dp))

        OutlinedTextField(value = clientName, onValueChange = { clientName = it }, label = { Text("શ્રીમાનનું નામ (ગ્રાહક)") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = clientPhone, onValueChange = { clientPhone = it }, label = { Text("ગ્રાહકનો મોબાઈલ નંબર") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = village, onValueChange = { village = it }, label = { Text("ગામ (સ્થળ)") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = toVillage, onValueChange = { toVillage = it }, label = { Text("ત્યાંથી બીજા ગામ સુધી (જાન/રૂટ)") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = arrivalDateTime, onValueChange = { arrivalDateTime = it }, label = { Text("પહોંચવાનો સમય અને તારીખ") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = departureDateTime, onValueChange = { departureDateTime = it }, label = { Text("છૂટા કરવાનો સમય અને તારીખ") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = fixedPrice, onValueChange = { fixedPrice = it }, label = { Text("નક્કી કિંમત (₹)") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = advanceAmount, onValueChange = { advanceAmount = it }, label = { Text("એડવાન્સ જમા (₹)") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))

        Card(colors = CardDefaults.cardColors(containerColor = CardBg), modifier = Modifier.fillMaxWidth()) {
            Row(modifier = Modifier.padding(12.dp), horizontalArrangement = Arrangement.SpaceBetween) {
                Text("ઓટોમેટિક બાકી રકમ:", color = Color.White)
                Text("₹$remaining", fontWeight = FontWeight.Bold, color = if (remaining > 0) Color(0xFFF87171) else Color(0xFF4ADE80))
            }
        }

        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = soundSetupType, onValueChange = { soundSetupType = it }, label = { Text("સાઉન્ડ સિસ્ટમ / ડીજે પ્રકાર") }, modifier = Modifier.fillMaxWidth())
        Spacer(modifier = Modifier.height(8.dp))
        OutlinedTextField(value = notes, onValueChange = { notes = it }, label = { Text("વધારાની નોંધ") }, modifier = Modifier.fillMaxWidth())

        Spacer(modifier = Modifier.height(16.dp))
        Button(
            onClick = {
                if (clientName.isEmpty() || fixed == 0.0) {
                    Toast.makeText(context, "કૃપા કરીને ગ્રાહકનું નામ અને કિંમત ભરો", Toast.LENGTH_SHORT).show()
                    return@Button
                }
                coroutineScope.launch {
                    val order = Order(
                        billNo = "ISK-${System.currentTimeMillis() % 10000}",
                        date = "2026-10-30",
                        clientName = clientName,
                        clientPhone = clientPhone,
                        village = village,
                        toVillage = toVillage,
                        arrivalDateTime = arrivalDateTime,
                        departureDateTime = departureDateTime,
                        soundSetupType = soundSetupType,
                        fixedPrice = fixed,
                        advanceAmount = advance,
                        remainingAmount = remaining,
                        notes = notes
                    )
                    repository.saveOrder(order)
                    Toast.makeText(context, "ઓર્ડર સફળતાપૂર્વક બુક થયો!", Toast.LENGTH_SHORT).show()
                    navController.popBackStack()
                }
            },
            colors = ButtonDefaults.buttonColors(containerColor = GoldCol, contentColor = Color(0xFF070D1E)),
            modifier = Modifier.fillMaxWidth()
        ) {
            Text("ઓર્ડર સાચવો (Save Order)", fontWeight = FontWeight.Bold)
        }
    }
}

@Composable
fun OrderListScreen(navController: NavController, repository: FirebaseRepository) {
    val ordersState = repository.getOrdersFlow().collectAsState(initial = emptyList())
    var searchQuery by remember { mutableStateOf("") }

    val filtered = ordersState.value.filter {
        it.clientName.contains(searchQuery, ignoreCase = true) ||
        it.village.contains(searchQuery, ignoreCase = true) ||
        it.billNo.contains(searchQuery, ignoreCase = true) ||
        it.clientPhone.contains(searchQuery)
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        OutlinedTextField(
            value = searchQuery,
            onValueChange = { searchQuery = it },
            placeholder = { Text("નામ, ગામ, મોબાઈલ અથવા બીલ નં. શોધો") },
            leadingIcon = { Icon(Icons.Default.Search, contentDescription = null, tint = GoldCol) },
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(filtered) { order ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    border = BorderStroke(1.dp, GoldCol.copy(alpha = 0.3f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(order.billNo, fontWeight = FontWeight.Bold, color = GoldBright, fontSize = 13.sp)
                            Text("બાકી: ₹${order.remainingAmount}", color = if (order.remainingAmount > 0) Color(0xFFF87171) else Color(0xFF4ADE80), fontWeight = FontWeight.Bold)
                        }
                        Text(order.clientName, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                        Text("ગામ: ${order.village} -> ${order.toVillage}", fontSize = 12.sp, color = Color(0xFF94A3B8))
                        Text("સમય: ${order.arrivalDateTime}", fontSize = 11.sp, color = Color(0xFF94A3B8))
                        Text("મોબાઈલ: ${order.clientPhone}", fontSize = 11.sp, color = GoldCol)
                    }
                }
            }
        }
    }
}

@Composable
fun StaffScreen(repository: FirebaseRepository) {
    val staffState = repository.getStaffFlow().collectAsState(initial = emptyList())
    val staffList = staffState.value

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("સ્ટાફની વિગતો અને ઉપાડ", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GoldBright)
        Spacer(modifier = Modifier.height(12.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(staffList) { staff ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = CardBg),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Text(staff.name, fontWeight = FontWeight.Bold, fontSize = 15.sp, color = Color.White)
                        Text("કામગીરી: ${staff.role} | રોજ: ₹${staff.dailySalary}", fontSize = 12.sp, color = Color(0xFF94A3B8))
                        Text("મોબાઈલ: ${staff.phone}", fontSize = 12.sp, color = GoldCol)
                        val totalUpad = staff.upadList.sumOf { it.amount }
                        Text("કુલ ઉપાડ: ₹$totalUpad", fontWeight = FontWeight.Bold, color = Color(0xFFF87171), fontSize = 13.sp)
                    }
                }
            }
        }
    }
}

@Composable
fun CalendarScreen(repository: FirebaseRepository) {
    val ordersState = repository.getOrdersFlow().collectAsState(initial = emptyList())
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("બુકિંગ કેલેન્ડર ડાયરી", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = GoldBright)
        Text("તારીખ પ્રમાણે કાર્યક્રમો", fontSize = 12.sp, color = Color(0xFF94A3B8))
        Spacer(modifier = Modifier.height(16.dp))

        LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            items(ordersState.value) { order ->
                Card(colors = CardDefaults.cardColors(containerColor = CardBg), modifier = Modifier.fillMaxWidth()) {
                    Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                        Column(modifier = Modifier.weight(1f)) {
                            Text(order.arrivalDateTime, fontWeight = FontWeight.Bold, color = GoldBright)
                            Text("${order.clientName} (${order.village})", color = Color.White)
                            Text(order.soundSetupType, fontSize = 11.sp, color = Color(0xFF94A3B8))
                        }
                    }
                }
            }
        }
    }
}

package com.isksound.orderdiary.data

import com.google.firebase.firestore.DocumentId

data class Order(
    @DocumentId
    val id: String = "",
    val billNo: String = "",
    val date: String = "",
    val clientName: String = "",
    val clientPhone: String = "",
    val village: String = "",
    val toVillage: String = "",
    val arrivalDateTime: String = "",
    val departureDateTime: String = "",
    val soundSetupType: String = "",
    val fixedPrice: Double = 0.0,
    val advanceAmount: Double = 0.0,
    val remainingAmount: Double = 0.0,
    val notes: String = "",
    val status: String = "confirmed",
    val createdAt: Long = System.currentTimeMillis()
)

data class UpadRecord(
    val id: String = "",
    val date: String = "",
    val amount: Double = 0.0,
    val reason: String = "",
    val paymentMode: String = "રોકડ"
)

data class AttendanceRecord(
    val id: String = "",
    val date: String = "",
    val status: String = "હાજર",
    val orderRef: String = ""
)

data class Staff(
    @DocumentId
    val id: String = "",
    val name: String = "",
    val phone: String = "",
    val role: String = "",
    val dailySalary: Double = 0.0,
    val upadList: List<UpadRecord> = emptyList(),
    val attendanceList: List<AttendanceRecord> = emptyList()
)

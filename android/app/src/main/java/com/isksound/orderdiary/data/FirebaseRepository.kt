package com.isksound.orderdiary.data

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
        // Enable offline persistent cache so it works seamlessly in rural villages without internet
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

    // Orders Real-time Flow
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
            e.printStackTrace()
            false
        }
    }

    suspend fun deleteOrder(orderId: String): Boolean {
        return try {
            firestore.collection("orders").document(orderId).delete().await()
            true
        } catch (e: Exception) {
            false
        }
    }

    // Staff Real-time Flow
    fun getStaffFlow(): Flow<List<Staff>> = callbackFlow {
        val listener = firestore.collection("staff")
            .addSnapshotListener { snapshot, error ->
                if (error != null) {
                    close(error)
                    return@addSnapshotListener
                }
                val staffList = snapshot?.toObjects(Staff::class.java) ?: emptyList()
                trySend(staffList)
            }
        awaitClose { listener.remove() }
    }

    suspend fun saveStaff(staff: Staff): Boolean {
        return try {
            val docRef = if (staff.id.isEmpty()) {
                firestore.collection("staff").document()
            } else {
                firestore.collection("staff").document(staff.id)
            }
            docRef.set(staff.copy(id = docRef.id)).await()
            true
        } catch (e: Exception) {
            false
        }
    }
}

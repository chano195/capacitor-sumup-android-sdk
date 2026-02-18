package app.devlas.plugins.sumup

import android.content.Context
import com.sumup.taptopay.TapToPaySdk
import com.sumup.taptopay.TapToPaySdkFactory
import com.sumup.taptopay.listener.PaymentListener
import com.sumup.taptopay.listener.TapToPaySdkListener
import com.sumup.taptopay.models.*
import kotlinx.coroutines.*

/**
 * Gestiona el ciclo de vida del SDK Tap to Pay de SumUp.
 *
 * El SDK permite aceptar pagos NFC (contactless) directamente en el dispositivo Android
 * sin necesidad de hardware adicional (lector externo).
 *
 * Requisitos:
 *  - Dispositivo con NFC
 *  - Android 11+ (API 30)
 *  - USB debugging desactivado
 *  - No modo debug
 *  - Credenciales Maven de SumUp (solicitar a integration@sumup.com)
 *
 * Para Chile: se debe especificar processCardAs (CREDIT o DEBIT) y opcionalmente cuotas.
 */
class TapToPayManager : TapToPayBridge {

    private var sdk: TapToPaySdk? = null
    private var isInitialized = false
    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())

    private var eventCallback: TapToPayBridge.EventCallback? = null

    override fun setEventCallback(callback: TapToPayBridge.EventCallback) {
        eventCallback = callback
    }

    // ── Inicialización ─────────────────────────────────────

    /**
     * Inicializa el SDK Tap to Pay.
     * @param context Application context
     * @param affiliateKey Affiliate key de SumUp
     * @param apiToken Bearer token para autenticar (obtenido del backend)
     */
    override fun initialize(
        context: Context,
        affiliateKey: String,
        apiToken: String,
        callback: TapToPayBridge.InitCallback
    ) {
        if (isInitialized && sdk != null) {
            callback.onResult(true, null)
            return
        }

        try {
            sdk = TapToPaySdkFactory.create(
                context = context.applicationContext,
                affiliateKey = affiliateKey,
                apiToken = apiToken,
                listener = object : TapToPaySdkListener {
                    override fun onReady() {
                        isInitialized = true
                        callback.onResult(true, null)
                        eventCallback?.onEvent("sdkReady", emptyMap())
                    }

                    override fun onError(error: Throwable) {
                        isInitialized = false
                        callback.onResult(false, error.message ?: "Error desconocido al inicializar Tap to Pay")
                    }
                }
            )
        } catch (e: Exception) {
            callback.onResult(false, "Error al crear SDK Tap to Pay: ${e.message}")
        }
    }

    // ── Pago ───────────────────────────────────────────────

    /**
     * Inicia un pago Tap to Pay (contactless NFC).
     *
     * @param amount Monto en la menor unidad (ej: 1000 para $1.000 CLP)
     * @param currency Código de moneda ISO 4217 (ej: "CLP")
     * @param processCardAs "CREDIT" o "DEBIT" (requerido para Chile)
     * @param installments Número de cuotas (solo para crédito, 0 = sin cuotas)
     * @param description Descripción del cobro
     * @param foreignTransactionId ID externo de la transacción
     */
    override fun startPayment(
        amount: Long,
        currency: String,
        processCardAs: String,
        installments: Int,
        description: String,
        foreignTransactionId: String
    ) {
        val currentSdk = sdk
        if (!isInitialized || currentSdk == null) {
            eventCallback?.onPaymentError(
                "SDK Tap to Pay no inicializado. Llama a initTapToPay primero.",
                "NOT_INITIALIZED"
            )
            return
        }

        // Notificar que el pago está iniciando
        eventCallback?.onEvent("paymentStarting", mapOf(
            "amount" to amount,
            "currency" to currency,
            "processCardAs" to processCardAs
        ))

        val paymentRequest = PaymentRequest(
            amount = amount,
            currency = currency,
            description = description,
            foreignTransactionId = foreignTransactionId.ifEmpty { java.util.UUID.randomUUID().toString() },
            processCardAs = when (processCardAs.uppercase()) {
                "DEBIT" -> ProcessCardAs.DEBIT
                else -> if (installments > 1) {
                    ProcessCardAs.CREDIT_WITH_INSTALLMENTS(installments)
                } else {
                    ProcessCardAs.CREDIT
                }
            }
        )

        currentSdk.startPayment(paymentRequest, object : PaymentListener {
            override fun onCardDetectionStarted() {
                eventCallback?.onEvent("cardRequested", mapOf(
                    "message" to "Acerca la tarjeta al dispositivo"
                ))
            }

            override fun onCardDetected() {
                eventCallback?.onEvent("cardPresented", mapOf(
                    "message" to "Tarjeta detectada, procesando..."
                ))
            }

            override fun onPinRequired() {
                eventCallback?.onEvent("pinRequired", mapOf(
                    "message" to "Ingrese su PIN en la pantalla"
                ))
            }

            override fun onPaymentSuccessful(result: PaymentResult) {
                val resultMap = mapOf<String, Any?>(
                    "transaction_code" to result.transactionCode,
                    "amount" to result.amount,
                    "currency" to result.currency,
                    "status" to "SUCCESSFUL",
                    "card_type" to (result.cardType ?: ""),
                    "last_4_digits" to (result.lastFourDigits ?: ""),
                    "payment_type" to "TAP_TO_PAY",
                    "entry_mode" to "NFC",
                    "installments" to installments
                )
                eventCallback?.onPaymentSuccess(resultMap)
            }

            override fun onPaymentFailed(error: Throwable) {
                eventCallback?.onPaymentError(
                    error.message ?: "Error desconocido en el pago",
                    "PAYMENT_FAILED"
                )
            }

            override fun onPaymentCancelled() {
                eventCallback?.onPaymentError(
                    "Pago cancelado por el usuario",
                    "PAYMENT_CANCELLED"
                )
            }
        })
    }

    // ── Teardown ───────────────────────────────────────────

    /**
     * Libera recursos del SDK Tap to Pay.
     * Llamar al cerrar la app o al cambiar de modo.
     */
    override fun teardown() {
        try {
            sdk?.teardown()
        } catch (_: Exception) {
            // Ignorar errores en teardown
        } finally {
            sdk = null
            isInitialized = false
            scope.cancel()
        }
    }

    override fun isSdkReady(): Boolean = isInitialized && sdk != null
}

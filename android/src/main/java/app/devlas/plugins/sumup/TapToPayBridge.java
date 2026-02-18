package app.devlas.plugins.sumup;

import android.content.Context;
import java.util.Map;

/**
 * Interfaz puente para Tap to Pay.
 *
 * Siempre se compila (sin dependencias del SDK Tap to Pay).
 * La implementación real (TapToPayManager.kt) solo se compila
 * cuando las credenciales Maven de SumUp están configuradas.
 *
 * SumUpPlugin.java referencia únicamente esta interfaz y crea
 * la implementación vía reflexión (Class.forName), lo que permite
 * compilar sin errores cuando el SDK no está disponible.
 */
public interface TapToPayBridge {

    /* ── Callbacks ───────────────────────────────────────── */

    interface EventCallback {
        void onEvent(String eventName, Map<String, Object> data);
        void onPaymentSuccess(Map<String, Object> data);
        void onPaymentError(String errorMessage, String errorCode);
    }

    interface InitCallback {
        void onResult(boolean success, String error);
    }

    /* ── API ─────────────────────────────────────────────── */

    void setEventCallback(EventCallback callback);

    void initialize(Context context, String affiliateKey, String apiToken, InitCallback callback);

    void startPayment(long amount, String currency, String processCardAs,
                      int installments, String description, String foreignTransactionId);

    boolean isSdkReady();

    void teardown();
}

/**
 * capacitor-sumup – TypeScript definitions
 *
 * Tipos compartidos entre la capa web (fallback) y el bridge nativo Android.
 * Basado en el SumUp Android Reader SDK v5, Cloud API y Tap to Pay SDK.
 */

import type { PluginListenerHandle } from '@capacitor/core'

// ── Request types ──────────────────────────────────────────

export interface SumUpLoginOptions {
  /** Affiliate key generada en el dashboard de SumUp */
  affiliateKey: string
  /** Token OAuth2 (opcional). Si se omite, se muestra la pantalla de login nativa */
  accessToken?: string
}

export interface SumUpPaymentOptions {
  /** Monto total a cobrar (mínimo 1.00) */
  amount: number
  /** Título descriptivo de la transacción */
  title?: string
  /** Código ISO de moneda (ej: "CLP", "EUR"). Si se omite, usa la del comerciante */
  currencyCode?: string
  /** Solicitar propina directamente en el lector (si el hardware lo soporta) */
  tipOnCardReader?: boolean
  /** Monto de propina fijo (ignorado si tipOnCardReader es true) */
  tip?: number
  /** Omitir pantalla de éxito del SDK */
  skipSuccessScreen?: boolean
  /** Omitir pantalla de error del SDK */
  skipFailedScreen?: boolean
  /** ID de transacción externo (máx 128 chars, debe ser único) */
  foreignTransactionId?: string
}

// ── Tap to Pay types ───────────────────────────────────────

export interface TapToPayInitOptions {
  /** Affiliate key de SumUp */
  affiliateKey: string
  /** Bearer token para autenticar con el backend de SumUp */
  apiToken: string
}

export type ProcessCardAs = 'CREDIT' | 'DEBIT'

export interface TapToPayCheckoutOptions {
  /** Monto a cobrar (entero; ej: 1000 para $1.000 CLP) */
  amount: number
  /** Código de moneda ISO 4217 (ej: "CLP") */
  currency: string
  /** Cómo procesar la tarjeta: "CREDIT" o "DEBIT" (requerido para Chile) */
  processCardAs: ProcessCardAs
  /** Número de cuotas (solo para crédito; 0 = sin cuotas) */
  installments?: number
  /** Descripción del cobro */
  description?: string
  /** ID externo de la transacción */
  foreignTransactionId?: string
}

export interface TapToPayEvent {
  /** Nombre del evento: sdkReady, cardRequested, cardPresented, pinRequired, paymentStarting */
  event: string
  /** Mensaje descriptivo */
  message?: string
  [key: string]: unknown
}

export interface TapToPayReadyStatus {
  ready: boolean
}

// ── Response types ─────────────────────────────────────────

export interface SumUpResponse {
  code: number
  message: string
}

export interface SumUpLoginStatus {
  code: number
  isLoggedIn: boolean
}

export interface SumUpPaymentResult {
  transaction_code: string
  merchant_code: string
  amount: number
  tip_amount: number
  vat_amount: number
  currency: string
  /** PENDING | SUCCESSFUL | CANCELLED | FAILED */
  status: string
  /** CASH | POS | ECOM | UNKNOWN | RECURRING | BITCOIN | BALANCE | TAP_TO_PAY */
  payment_type: string
  /** Ej: CHIP, CONTACTLESS, NFC */
  entry_mode: string
  installments: number
  /** Ej: MASTERCARD, VISA */
  card_type: string
  last_4_digits: string
  receipt_sent: boolean
}

// ── Plugin interface ───────────────────────────────────────

export interface SumUpPlugin {
  // ── SDK clásico (Air / BT) ───────────────────────────────

  /** Inicializa el SDK (SumUpState.init). Llamar una vez al iniciar la app. */
  setup(): Promise<SumUpResponse>

  /** Abre la pantalla de login nativa de SumUp */
  login(options: SumUpLoginOptions): Promise<SumUpResponse>

  /** Cierra la sesión del comerciante */
  logout(): Promise<SumUpResponse>

  /** Verifica si hay una sesión activa */
  isLoggedIn(): Promise<SumUpLoginStatus>

  /** Abre la página de configuración del lector de tarjetas */
  openCardReaderPage(): Promise<SumUpResponse>

  /** Pre-conecta el lector BLE para acelerar el siguiente pago */
  prepareForCheckout(): Promise<SumUpResponse>

  /** Inicia el flujo de cobro con el lector de tarjetas */
  checkout(options: SumUpPaymentOptions): Promise<SumUpPaymentResult>

  /** Cierra la conexión con el lector de tarjetas */
  closeConnection(): Promise<SumUpResponse>

  // ── Tap to Pay (NFC en dispositivo Android) ──────────────

  /** Inicializa el SDK Tap to Pay (requiere affiliateKey + apiToken del backend) */
  initTapToPay(options: TapToPayInitOptions): Promise<SumUpResponse>

  /** Inicia un cobro NFC en el propio dispositivo Android */
  tapToPayCheckout(options: TapToPayCheckoutOptions): Promise<SumUpPaymentResult>

  /** Verifica si el SDK Tap to Pay está listo */
  isTapToPayReady(): Promise<TapToPayReadyStatus>

  /** Libera recursos del SDK Tap to Pay */
  teardownTapToPay(): Promise<SumUpResponse>

  /** Escucha eventos intermedios del Tap to Pay (cardRequested, cardPresented, etc.) */
  addListener(eventName: 'tapToPayEvent', listenerFunc: (event: TapToPayEvent) => void): Promise<PluginListenerHandle>
}

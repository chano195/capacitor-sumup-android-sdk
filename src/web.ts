import { WebPlugin } from '@capacitor/core'
import type {
  SumUpPlugin,
  SumUpLoginOptions,
  SumUpPaymentOptions,
  SumUpResponse,
  SumUpLoginStatus,
  SumUpPaymentResult,
  TapToPayInitOptions,
  TapToPayCheckoutOptions,
  TapToPayReadyStatus,
} from './definitions'

const WEB_RESPONSE: SumUpResponse = { code: -1, message: 'SumUp no disponible en web' }

/**
 * Fallback web: todas las llamadas devuelven un error controlado.
 * Útil para desarrollar la UI sin dispositivo Android.
 */
export class SumUpWeb extends WebPlugin implements SumUpPlugin {
  async setup(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async login(_options: SumUpLoginOptions): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async logout(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async isLoggedIn(): Promise<SumUpLoginStatus> {
    return { code: -1, isLoggedIn: false }
  }

  async openCardReaderPage(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async prepareForCheckout(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async checkout(_options: SumUpPaymentOptions): Promise<SumUpPaymentResult> {
    throw new Error('SumUp checkout no disponible en web')
  }

  async closeConnection(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  // ── Tap to Pay (NFC) ──────────────────────────────────

  async initTapToPay(_options: TapToPayInitOptions): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }

  async tapToPayCheckout(_options: TapToPayCheckoutOptions): Promise<SumUpPaymentResult> {
    throw new Error('Tap to Pay no disponible en web')
  }

  async isTapToPayReady(): Promise<TapToPayReadyStatus> {
    return { ready: false }
  }

  async teardownTapToPay(): Promise<SumUpResponse> {
    return WEB_RESPONSE
  }
}

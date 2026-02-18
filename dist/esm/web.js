import { WebPlugin } from '@capacitor/core';
const WEB_RESPONSE = { code: -1, message: 'SumUp no disponible en web' };
/**
 * Fallback web: todas las llamadas devuelven un error controlado.
 * Útil para desarrollar la UI sin dispositivo Android.
 */
export class SumUpWeb extends WebPlugin {
    async setup() {
        return WEB_RESPONSE;
    }
    async login(_options) {
        return WEB_RESPONSE;
    }
    async logout() {
        return WEB_RESPONSE;
    }
    async isLoggedIn() {
        return { code: -1, isLoggedIn: false };
    }
    async openCardReaderPage() {
        return WEB_RESPONSE;
    }
    async prepareForCheckout() {
        return WEB_RESPONSE;
    }
    async checkout(_options) {
        throw new Error('SumUp checkout no disponible en web');
    }
    async closeConnection() {
        return WEB_RESPONSE;
    }
    // ── Tap to Pay (NFC) ──────────────────────────────────
    async initTapToPay(_options) {
        return WEB_RESPONSE;
    }
    async tapToPayCheckout(_options) {
        throw new Error('Tap to Pay no disponible en web');
    }
    async isTapToPayReady() {
        return { ready: false };
    }
    async teardownTapToPay() {
        return WEB_RESPONSE;
    }
}

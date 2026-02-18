import { WebPlugin } from '@capacitor/core';
import type { SumUpPlugin, SumUpLoginOptions, SumUpPaymentOptions, SumUpResponse, SumUpLoginStatus, SumUpPaymentResult, TapToPayInitOptions, TapToPayCheckoutOptions, TapToPayReadyStatus } from './definitions';
/**
 * Fallback web: todas las llamadas devuelven un error controlado.
 * Útil para desarrollar la UI sin dispositivo Android.
 */
export declare class SumUpWeb extends WebPlugin implements SumUpPlugin {
    setup(): Promise<SumUpResponse>;
    login(_options: SumUpLoginOptions): Promise<SumUpResponse>;
    logout(): Promise<SumUpResponse>;
    isLoggedIn(): Promise<SumUpLoginStatus>;
    openCardReaderPage(): Promise<SumUpResponse>;
    prepareForCheckout(): Promise<SumUpResponse>;
    checkout(_options: SumUpPaymentOptions): Promise<SumUpPaymentResult>;
    closeConnection(): Promise<SumUpResponse>;
    initTapToPay(_options: TapToPayInitOptions): Promise<SumUpResponse>;
    tapToPayCheckout(_options: TapToPayCheckoutOptions): Promise<SumUpPaymentResult>;
    isTapToPayReady(): Promise<TapToPayReadyStatus>;
    teardownTapToPay(): Promise<SumUpResponse>;
}

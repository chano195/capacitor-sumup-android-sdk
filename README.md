# capacitor-sumup

Plugin de Capacitor para pagos con SumUp en Android.

Soporta 2 familias de integración:

- **Reader SDK (Air / lector Bluetooth)**
- **Tap to Pay (NFC en el teléfono Android, condicional)**

Incluye fallback web seguro para desarrollo de UI en navegador.

## Características

- **`setup()`** — Inicializa el SDK de SumUp (`SumUpState.init`)
- **`login()`** — Abre la pantalla nativa de login de SumUp
- **`logout()`** — Cierra la sesión del comerciante
- **`isLoggedIn()`** — Verifica si hay una sesión activa
- **`openCardReaderPage()`** — Abre la configuración Bluetooth del lector de tarjetas
- **`prepareForCheckout()`** — Pre-conecta el lector para agilizar el cobro
- **`checkout()`** — Inicia un flujo de pago en el lector de tarjetas
- **`closeConnection()`** — Desconecta el lector de tarjetas
- **`initTapToPay()`** — Inicializa Tap to Pay con `affiliateKey` + `apiToken`
- **`tapToPayCheckout()`** — Inicia cobro Tap to Pay (débito/crédito/cuotas)
- **`isTapToPayReady()`** — Indica si Tap to Pay está inicializado
- **`teardownTapToPay()`** — Libera recursos de Tap to Pay

## Requisitos

| Dependencia | Versión |
|---|---|
| `@capacitor/core` | `>= 5.0.0` |
| SumUp Merchant SDK | `5.0.3` |
| Android `minSdk` | `30` |
| Java | `17` |
| Kotlin | `1.9.22` |

### Requisitos Tap to Pay (opcional)

Tap to Pay usa dependencia privada:

- `com.sumup.tap-to-pay:utopia-sdk:1.0.4`
- Repositorio privado de SumUp con credenciales Maven

Credenciales esperadas en `.env` del proyecto host:

```env
sumupMavenUser=TU_USUARIO
sumupMavenPassword=TU_PASSWORD
```

Si no hay credenciales válidas, el plugin **compila igual** y Tap to Pay queda no disponible en runtime (`TAP_NOT_AVAILABLE`).

## Instalación

```bash
npm install @chano195/capacitor-sumup
npx cap sync android
```

## Uso

```typescript
import { SumUp } from '@chano195/capacitor-sumup'

// 1. Inicializar una vez al arrancar la app
await SumUp.setup()

// 2. Iniciar sesión
await SumUp.login({
  affiliateKey: 'TU_AFFILIATE_KEY',
  accessToken: 'token-oauth-opcional',
})

// 3. Verificar sesión
const { isLoggedIn } = await SumUp.isLoggedIn()

// 4. Realizar un cobro
const resultado = await SumUp.checkout({
  amount: 15.0,
  currencyCode: 'CLP',
  title: 'Pedido #42',
  skipSuccessScreen: true,
})

console.log(resultado.transaction_code, resultado.status)
```

## Referencia de API

### `setup(): Promise<SumUpResponse>`

Inicializa el SDK de SumUp. Debe llamarse una vez antes de cualquier otro método.

### `login(options: SumUpLoginOptions): Promise<SumUpResponse>`

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `affiliateKey` | `string` | ✅ | Tu clave de afiliado de SumUp |
| `accessToken` | `string` | ❌ | Token OAuth2. Si se omite, se muestra la pantalla nativa de login |

### `logout(): Promise<SumUpResponse>`

Cierra la sesión actual del comerciante.

### `isLoggedIn(): Promise<SumUpLoginStatus>`

Retorna `{ code, isLoggedIn }`.

### `openCardReaderPage(): Promise<SumUpResponse>`

Abre la página nativa de configuración Bluetooth del lector de tarjetas.

### `prepareForCheckout(): Promise<SumUpResponse>`

Pre-conecta el lector BLE para agilizar el próximo pago.

### `checkout(options: SumUpPaymentOptions): Promise<SumUpPaymentResult>`

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `amount` | `number` | ✅ | Monto total (mínimo 1.00) |
| `title` | `string` | ❌ | Descripción de la transacción |
| `currencyCode` | `string` | ❌ | Código de moneda ISO (ej: `CLP`, `EUR`) |
| `tipOnCardReader` | `boolean` | ❌ | Solicitar propina en el hardware del lector |
| `tip` | `number` | ❌ | Monto fijo de propina |
| `skipSuccessScreen` | `boolean` | ❌ | Omitir pantalla de éxito del SDK |
| `skipFailedScreen` | `boolean` | ❌ | Omitir pantalla de error del SDK |
| `foreignTransactionId` | `string` | ❌ | ID de transacción externo (máx 128 caracteres, debe ser único) |

**Retorna** `SumUpPaymentResult`:

```typescript
{
  transaction_code: string
  merchant_code: string
  amount: number
  tip_amount: number
  vat_amount: number
  currency: string
  status: 'PENDING' | 'SUCCESSFUL' | 'CANCELLED' | 'FAILED'
  payment_type: string
  entry_mode: string // CHIP, CONTACTLESS, etc.
  installments: number
  card_type: string  // MASTERCARD, VISA, etc.
  last_4_digits: string
  receipt_sent: boolean
}
```

### `closeConnection(): Promise<SumUpResponse>`

Desconecta el lector de tarjetas.

### `initTapToPay(options: TapToPayInitOptions): Promise<SumUpResponse>`

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `affiliateKey` | `string` | ✅ | Clave de afiliado SumUp |
| `apiToken` | `string` | ✅ | Bearer token obtenido por backend |

### `tapToPayCheckout(options: TapToPayCheckoutOptions): Promise<TapToPayResult>`

| Parámetro | Tipo | Requerido | Descripción |
|---|---|---|---|
| `amount` | `number` | ✅ | Monto (mínimo 1.00) |
| `currency` | `string` | ❌ | ISO 4217 (`CLP` por defecto) |
| `processCardAs` | `'CREDIT' \| 'DEBIT'` | ❌ | Tipo de proceso (Chile) |
| `installments` | `number` | ❌ | Cuotas para crédito |
| `description` | `string` | ❌ | Descripción del cobro |
| `foreignTransactionId` | `string` | ❌ | ID externo único |

### `isTapToPayReady(): Promise<{ ready: boolean }>`

Retorna si Tap to Pay está inicializado y listo para cobrar.

### `teardownTapToPay(): Promise<SumUpResponse>`

Libera recursos del SDK Tap to Pay.

## Fallback Web

En plataformas que no sean Android, todos los métodos retornan una respuesta segura `{ code: -1, message: 'SumUp no disponible en web' }` o lanzan excepción para `checkout()`. Esto te permite desarrollar tu UI en el navegador sin errores.

## Notas Importantes

- **Hilo principal**: Todas las llamadas al SDK se despachan automáticamente al hilo UI de Android.
- **Basado en Activities**: `login()`, `checkout()` y `openCardReaderPage()` lanzan Activities nativas. La Promise se resuelve cuando la Activity termina.
- **Permisos Bluetooth**: El plugin declara los permisos `BLUETOOTH`, `BLUETOOTH_ADMIN`, `BLUETOOTH_CONNECT`, `BLUETOOTH_SCAN`, `ACCESS_FINE_LOCATION` y `ACCESS_COARSE_LOCATION` en su `AndroidManifest.xml`.
- **Tap to Pay condicional**: la implementación real se compila desde `android/src/main/taptopay/` solo cuando hay credenciales Maven válidas.

## Publicación y consumo desde Git

- `dist/` se mantiene versionado para evitar errores de consumo.
- El paquete ejecuta build en `prepare` y `prepack`.
- Antes de publicar, valida con:

```bash
npm run build
npm pack --dry-run
```

## Atribución

Este proyecto es **software libre** bajo licencia MIT. Puedes usarlo, modificarlo y distribuirlo
libremente, incluso en proyectos comerciales. Solo te pedimos una cosa:

> **Si usas este plugin en tu proyecto, da crédito al autor original.**

Formas válidas de dar crédito:

- Mención en el README de tu proyecto: _"Usa [capacitor-sumup](https://github.com/chano195/capacitor-sumup) por DEVLAS SPA"_
- Mención en la sección "Acerca de" o "Créditos" de tu aplicación
- Mantener la nota de copyright en el archivo LICENSE (esto es **obligatorio** por la licencia MIT)

No es obligatorio pedir permiso para usarlo, pero un ⭐ en GitHub y una mención siempre se agradecen.

## Licencia

MIT — Copyright (c) 2026 [DEVLAS SPA](https://devlas.cl)

Consulta el archivo [LICENSE](LICENSE) para los términos completos.

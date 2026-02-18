# Contribuir a capacitor-sumup

¡Gracias por tu interés en contribuir! 🙌

## Cómo contribuir

1. Haz un **fork** del repositorio
2. Crea una rama para tu feature o fix: `git checkout -b mi-cambio`
3. Haz tus cambios y commitea: `git commit -m "Agrega tal cosa"`
4. Sube tu rama: `git push origin mi-cambio`
5. Abre un **Pull Request** en GitHub

## Desarrollo local

```bash
# Clonar
git clone https://github.com/chano195/capacitor-sumup.git
cd capacitor-sumup

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Validar paquete publicable
npm pack --dry-run
```

## Estructura del proyecto

```
├── android/          # Código nativo Android
│   ├── src/main/java/.../SumUpPlugin.java
│   ├── src/main/java/.../TapToPayBridge.java
│   └── src/main/taptopay/.../TapToPayManager.kt  # Solo cuando hay credenciales Maven válidas
├── src/              # Código TypeScript (definiciones, web fallback)
├── dist/             # Archivos compilados (versionados)
├── package.json
├── tsconfig.json
└── README.md
```

## Reglas

- Escribe código limpio y legible
- Respeta la estructura existente del proyecto
- Documenta los cambios públicos en el README
- Los PRs deben compilar sin errores (`npm run build`)
- Si cambias `src/`, debes incluir cambios en `dist/`
- No elimines `tsconfig.json` ni scripts de build (`build`, `prepare`, `prepack`)

## Tap to Pay: criterio de diseño

- Tap to Pay depende de un SDK privado (`utopia-sdk`) y puede no estar disponible en todos los entornos.
- El plugin debe **degradar de forma segura** cuando no hay credenciales Maven.
- `SumUpPlugin.java` no debe depender directamente de clases que puedan no compilarse en builds sin Tap to Pay.

## Checklist de PR

- [ ] `npm run build` sin errores
- [ ] `npm pack --dry-run` muestra `dist/`, `android/` y tipos TS
- [ ] README actualizado si cambió API o requisitos
- [ ] Compatibilidad sin credenciales Tap to Pay verificada (graceful degradation)

## Checklist de release

1. Subir versión en `package.json` (semver)
2. Ejecutar `npm run build`
3. Validar con `npm pack --dry-run`
4. Commit incluyendo `dist/`
5. Crear tag y publicar

## Reportar bugs

Abre un [issue en GitHub](https://github.com/chano195/capacitor-sumup/issues) con:

- Descripción del problema
- Pasos para reproducir
- Versión del plugin, Capacitor y Android
- Logs relevantes

## Atribución y créditos

- Al contribuir, aceptas que tu código se publique bajo la licencia **MIT**.
- Si usas este plugin en tu proyecto, te pedimos que des crédito al proyecto original
  (una mención en tu README, en la sección "Acerca de" de tu app, o similar).
- La nota de copyright en el archivo LICENSE **debe mantenerse** — esto es un requisito legal de la licencia MIT.

Cada línea de código compartida es un ladrillo en un mundo que todavía no existe.

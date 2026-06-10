# Brief Google Ads | Ideamos

Aplicación web multipaso para relevar la información necesaria antes de configurar campañas de Google Ads para clientes de Ideamos.

El formulario está pensado para verse premium, cargar rápido y enviar un brief claro a `hola@ideamos.com.ar` al finalizar.

## URL

- GitHub Pages: [https://estudioideamos.github.io/ideamos-google-ads-brief/](https://estudioideamos.github.io/ideamos-google-ads-brief/)
- Dominio personalizado previsto: `https://ads.ideamos.com.ar`

## Qué hace

- Recorre el brief en varios pasos.
- Guarda el avance en `localStorage` para no perder datos si se recarga la página.
- Valida campos clave antes de avanzar.
- Acepta webs escritas con o sin `http://` o `https://`.
- Envía el resumen final por email usando FormSubmit.
- Si el envío automático falla, abre un `mailto:` de respaldo.
- No solicita contraseña de Google Ads.
- Explica el flujo seguro de acceso por invitación a la cuenta.

## Stack

- HTML estático
- CSS custom
- JavaScript vanilla
- FormSubmit para el envío del brief
- GitHub Pages para hosting

## Estructura

```text
.
|-- assets/
|   |-- ideamos-favicon.png
|   `-- ideamos-logo-hero.png
|-- src/
|   `-- main.js
|-- index.html
|-- styles.css
`-- README.md
```

## Envío del formulario

El envío se hace desde `src/main.js` contra este endpoint:

```text
https://formsubmit.co/ajax/hola@ideamos.com.ar
```

Detalles actuales:

- destinatario: `hola@ideamos.com.ar`
- asunto: `Nuevo brief Google Ads - {empresa}`
- template: `basic`
- reply-to: toma el email del contacto cargado en el formulario
- cuerpo: se arma en lenguaje natural con secciones del brief

## Desarrollo local

Como es un sitio estático, alcanza con abrir `index.html` o servir la carpeta con cualquier servidor simple.

Ejemplo con VS Code Live Server o cualquier servidor local:

```text
index.html
```

No hay proceso de build ni dependencias de `npm`.

## Publicación en GitHub Pages

Repositorio:

- [https://github.com/estudioideamos/ideamos-google-ads-brief](https://github.com/estudioideamos/ideamos-google-ads-brief)

Configuración esperada:

1. Branch de publicación: `main`
2. Fuente: GitHub Pages
3. URL por defecto: `https://estudioideamos.github.io/ideamos-google-ads-brief/`

## Dominio personalizado

Para usar `ads.ideamos.com.ar`:

1. En GitHub Pages, definir el custom domain como `ads.ideamos.com.ar`.
2. En Cloudflare, crear un `CNAME`:

```text
ads -> estudioideamos.github.io
```

3. Dejar ese registro en `DNS only` y no proxied.
4. Esperar propagación.
5. Cuando GitHub valide el DNS, habilitar `Enforce HTTPS`.

Notas:

- El DNS del dominio está delegado a Cloudflare, no a cPanel.
- Si algo se configura solo en cPanel pero no en Cloudflare, no queda publicado hacia internet.
- GitHub puede tardar hasta 24 horas en habilitar HTTPS luego de detectar bien el dominio.

## Correo y DNS

Como `ideamos.com.ar` usa nameservers de Cloudflare, los registros activos de correo también deben existir en Cloudflare.

Puntos importantes:

- `SPF`: dejar un solo registro `v=spf1`
- `DKIM`: publicar en Cloudflare el valor entregado por cPanel/Nuthost
- `DMARC`: publicar el TXT de `_dmarc.ideamos.com.ar` en Cloudflare

SPF recomendado actualmente para el hosting:

```text
v=spf1 a mx ip4:167.250.5.92 include:spf.servidoraweb.net ~all
```

## UX y criterios del proyecto

- Estética alineada al universo visual de Ideamos
- Color de destaque corporativo: `#FF5500`
- Logo y favicon cargados localmente desde `assets/`
- Animaciones decorativas más livianas en mobile para priorizar fluidez
- Desktop con mayor impacto visual
- Mobile optimizado para evitar repintados y vacíos blancos al scrollear

## Seguridad

- No se piden contraseñas de Google Ads.
- El acceso a cuentas existentes se resuelve por invitación segura.
- El formulario solo solicita los datos necesarios para pedir acceso y preparar la campaña.

## Mantenimiento

Si necesitás ajustar textos, campos o validaciones:

- contenido y estructura: `index.html`
- estilos y responsive: `styles.css`
- navegación, validación, guardado y envío: `src/main.js`

## Pendientes posibles

- Confirmar activación final de `https://ads.ideamos.com.ar`
- Revisar estado de `DKIM` y `DMARC` en Cloudflare
- Hacer una última pasada de copy para corregir cualquier acento mal codificado si aparece en algún entorno

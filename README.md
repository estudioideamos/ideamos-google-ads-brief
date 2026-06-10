# Brief Google Ads | Ideamos

Aplicacion web multipaso para relevar la informacion necesaria antes de configurar campanas de Google Ads para clientes de Ideamos.

El formulario esta pensado para verse premium, cargar rapido y procesar un brief claro al finalizar.

## URL

- GitHub Pages: [https://estudioideamos.github.io/ideamos-google-ads-brief/](https://estudioideamos.github.io/ideamos-google-ads-brief/)
- Dominio personalizado previsto: `https://ads.ideamos.com.ar`

## Que hace

- Recorre el brief en varios pasos.
- Guarda el avance en `localStorage` para no perder datos si se recarga la pagina.
- Valida campos clave antes de avanzar.
- Acepta webs escritas con o sin `http://` o `https://`.
- Procesa el resumen final usando FormSubmit.
- Si el envio automatico falla, abre un `mailto:` de respaldo.
- No solicita contrasena de Google Ads.
- Explica el flujo seguro de acceso por invitacion a la cuenta.

## Stack

- HTML estatico
- CSS custom
- JavaScript vanilla
- FormSubmit para procesar el brief
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

## Envio del formulario

La logica de envio esta en `src/main.js` y usa FormSubmit para procesar el brief.

Comportamiento actual:

- arma un asunto dinamico con el nombre de la empresa
- toma el email del contacto como `reply-to`
- construye el contenido final en lenguaje natural por secciones
- si el envio automatico falla, abre un `mailto:` de respaldo

## Desarrollo local

Como es un sitio estatico, alcanza con abrir `index.html` o servir la carpeta con cualquier servidor simple.

Ejemplo con VS Code Live Server o cualquier servidor local:

```text
index.html
```

No hay proceso de build ni dependencias de `npm`.

## Publicacion en GitHub Pages

Repositorio:

- [https://github.com/estudioideamos/ideamos-google-ads-brief](https://github.com/estudioideamos/ideamos-google-ads-brief)

Configuracion esperada:

1. Branch de publicacion: `main`
2. Fuente: GitHub Pages
3. URL por defecto: `https://estudioideamos.github.io/ideamos-google-ads-brief/`

## Dominio personalizado

Para usar `ads.ideamos.com.ar`:

1. En GitHub Pages, definir el custom domain como `ads.ideamos.com.ar`.
2. En el proveedor DNS del dominio, crear un `CNAME`:

```text
ads -> estudioideamos.github.io
```

3. Dejar ese registro en `DNS only` si el proveedor usa proxy.
4. Esperar propagacion.
5. Cuando GitHub valide el DNS, habilitar `Enforce HTTPS`.

Notas:

- El dominio personalizado depende de la configuracion DNS externa del dominio.
- GitHub puede tardar hasta 24 horas en habilitar HTTPS luego de detectar bien el dominio.

## UX y criterios del proyecto

- Estetica alineada al universo visual de Ideamos
- Color de destaque corporativo: `#FF5500`
- Logo y favicon cargados localmente desde `assets/`
- Animaciones decorativas mas livianas en mobile para priorizar fluidez
- Desktop con mayor impacto visual
- Mobile optimizado para evitar repintados y vacios blancos al scrollear

## Seguridad

- No se piden contrasenas de Google Ads.
- El acceso a cuentas existentes se resuelve por invitacion segura.
- El formulario solo solicita los datos necesarios para pedir acceso y preparar la campana.

## Mantenimiento

Si necesitas ajustar textos, campos o validaciones:

- contenido y estructura: `index.html`
- estilos y responsive: `styles.css`
- navegacion, validacion, guardado y envio: `src/main.js`

## Pendientes posibles

- Confirmar activacion final de `https://ads.ideamos.com.ar`
- Hacer una ultima pasada de copy para corregir cualquier texto que se vea raro en algun entorno

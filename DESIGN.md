# Guía de diseño del FrontEnd

Este documento orienta a agentes de IA y desarrolladores que modifiquen `FrontEnd/`. Su objetivo es mantener una interfaz clara, operativa y coherente para el personal de una Administradora de Riesgos de Salud.

## Contexto del producto

La interfaz sirve para consultar y gestionar afiliados, proveedores, planes, pólizas, autorizaciones, reclamos, servicios médicos, pagos, facturas y notificaciones. Es una herramienta de trabajo frecuente: debe priorizar lectura rápida, confianza, precisión y acciones previsibles sobre decoración.

La implementación actual usa React, Tailwind CSS 4, Lucide React, Framer Motion y Recharts. Antes de crear un patrón nuevo, revisa `src/components/ui.tsx` y reutiliza sus componentes.

## Principios visuales

- **Operativa:** prioriza tablas, filtros, estados, formularios y acciones relacionadas con el trabajo diario.
- **Clara:** usa jerarquía tipográfica, espacios consistentes y etiquetas concretas.
- **Confiable:** los estados de aprobación, rechazo, pago, suspensión y error deben ser visualmente inequívocos.
- **Humana:** usa animaciones breves y útiles para orientar cambios de estado, sin distraer.
- **Accesible:** conserva contraste suficiente, foco visible, etiquetas de formulario y navegación usable con teclado.
- **Responsive:** diseña primero para que las tareas críticas funcionen en pantallas pequeñas y crezcan correctamente en escritorio.

## Identidad existente

Conserva la base visual actual antes de proponer una renovación:

- Fondos claros con acentos azul cielo, verde, ámbar y rojo para estados.
- Componentes reutilizables `Button`, `Card`, `Badge`, `Input`, `Select`, `Modal` y `NotificationContainer`.
- Iconos de Lucide dentro de controles cuando exista un icono reconocible.
- Animaciones de Framer Motion para entrada, salida y cambios de estado.
- Gráficos de Recharts para métricas y tendencias.

Las tarjetas actuales usan bordes suaves y esquinas redondeadas. No anides tarjetas sin una razón funcional y evita convertir cada sección en un panel flotante.

## Layout y jerarquía

- Mantén la navegación y la sección activa siempre identificables.
- Coloca los KPI y alertas operativas cerca del inicio del dashboard.
- Agrupa filtros con la lista que modifican.
- Mantén acciones primarias visibles y acciones destructivas separadas.
- Usa títulos breves y descriptivos; no añadas texto de marketing en una herramienta interna.
- Define dimensiones estables para tablas, botones, iconos, gráficos y modales para evitar saltos de layout.
- Evita encabezados gigantes en vistas de gestión; reserva la escala hero para una experiencia que realmente lo necesite.

## Color y estados

Usa color como señal semántica, no como decoración:

- Azul: acción primaria, información o navegación.
- Verde: éxito, activo o aprobado.
- Ámbar: advertencia, pendiente o en gracia.
- Rojo: error, rechazo, suspensión o acción destructiva.
- Gris: contenido secundario, inactivo o neutral.

Acompaña el color con texto, icono o estado visible. Nunca comuniques una decisión importante únicamente con color.

## Componentes y controles

- Usa iconos de Lucide en botones de herramientas y añade `aria-label` o tooltip cuando el icono no sea obvio.
- Usa botones con texto para comandos importantes como guardar, aprobar, rechazar o pagar.
- Usa `Badge` para estados breves y consistentes.
- Usa `Modal` para formularios cortos, confirmaciones y detalles puntuales, no para esconder flujos largos.
- Deshabilita acciones durante una petición y muestra el estado de carga.
- Para acciones irreversibles o de impacto, solicita confirmación y explica el resultado.
- Mantén mensajes de error próximos al campo o acción que los originó.

## Tablas, formularios y datos

- Las tablas deben conservar encabezados, alineación de importes y estados legibles.
- En móvil, permite desplazamiento horizontal o transforma la fila en un resumen vertical sin perder acciones.
- Formatea fechas y moneda según `es-DO` cuando el dato se presente al usuario.
- No inventes datos de ejemplo para rellenar una vista conectada al backend.
- Distingue entre carga, vacío, error y datos cargados.
- Valida entradas en la interfaz para ayudar al usuario, pero deja las reglas definitivas en el backend.

## IA en la interfaz

La IA debe aparecer como asistencia dentro de los flujos existentes, no como autoridad independiente:

- Presenta respuestas como sugerencias, resúmenes o explicaciones.
- Muestra qué contexto se utilizó cuando sea relevante para la confianza del usuario.
- Incluye estados de generación, cancelación, error, timeout y respuesta no disponible.
- Permite copiar, editar o descartar un borrador antes de enviarlo.
- Para autorizaciones, reclamos, pagos o pólizas, exige revisión y confirmación humana.
- Nunca expongas claves de proveedores ni llames directamente a servicios externos desde React.
- No guardes prompts o respuestas sensibles en `localStorage` por defecto.
- Renderiza la salida como texto seguro; no interpretes HTML o Markdown no confiable sin sanitización.
- Evita una pantalla de chat genérica si la capacidad puede vivir junto al afiliado, reclamo o autorización que el usuario está revisando.

## Movimiento y feedback

Usa movimiento con propósito:

- Entrada y salida breve de modales y notificaciones.
- Transiciones de carga y actualización de estados.
- Stagger corto para listas pequeñas cuando ayude a leer.

Evita animaciones permanentes, rebotes, fondos ruidosos y efectos que retrasen tareas repetitivas. Respeta `prefers-reduced-motion` cuando se añadan animaciones nuevas.

## Reglas para agentes de IA

Antes de modificar una vista:

1. Identifica el flujo de usuario y la acción principal.
2. Revisa los componentes existentes y el adaptador API relacionado.
3. Conserva nombres de payload y modelos en español según `src/api/adapters.ts`.
4. Implementa estados de carga, vacío, error y éxito.
5. Comprueba escritorio y móvil.
6. Ejecuta `pnpm run typecheck`, `pnpm run check` y `pnpm run build` desde `FrontEnd/`.

No introduzcas dependencias visuales nuevas, colores arbitrarios, componentes duplicados o llamadas de red directas desde una vista sin una necesidad clara.

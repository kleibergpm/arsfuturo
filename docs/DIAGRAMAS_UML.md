# Diagramas de Realización de Casos de Uso — ARS Futuro

Este dossier reúne los diagramas UML clave del proyecto para describir cómo se realizan los casos de uso en el sistema: Casos de uso, Clases, Secuencias y Actividades. Los diagramas están expresados en Mermaid para facilitar su visualización en Markdown.

## Alcance y Actores
- Actores principales: Administrador, Agente, Supervisor
- Entidades clave: Afiliado, Autorización, Reclamo, Proveedor, Póliza, Plan
- Servicios/Componentes: Frontend (React), API Backend, Sistema de Notificaciones

---

## Diagrama de Casos de Uso
```mermaid
flowchart LR
  classDef actor fill:#f7f7f7,stroke:#333,stroke-width:1px;

  Admin([Administrador]):::actor
  Agente([Agente]):::actor
  Supervisor([Supervisor]):::actor

  subgraph Sistema [ARS Futuro]
    UC1([Gestionar Afiliados])
    UC2([Registrar Autorización])
    UC3([Aprobar/Rechazar Autorización])
    UC4([Registrar Reclamo])
    UC5([Procesar Reclamo])
    UC6([Consultar Proveedores])
    UC7([Gestionar Pólizas])
    UC8([Simulador de Prima])
    UC9([Exportar Datos CSV])
    UC10([Ver Dashboard])
    UC11([Login / Autenticación])
    UC12([Notificaciones])
  end

  Admin -- usa --> UC1
  Admin -- usa --> UC7
  Admin -- usa --> UC9
  Admin -- usa --> UC10
  Admin -- inicia --> UC11

  Agente -- usa --> UC1
  Agente -- usa --> UC2
  Agente -- usa --> UC4
  Agente -- usa --> UC6
  Agente -- usa --> UC8
  Agente -- usa --> UC9
  Agente -- inicia --> UC11

  Supervisor -- usa --> UC3
  Supervisor -- usa --> UC5
  Supervisor -- usa --> UC10
  Supervisor -- inicia --> UC11

  UC2 -. incluye .-> UC12
  UC3 -. incluye .-> UC12
  UC4 -. incluye .-> UC12
  UC5 -. incluye .-> UC12
```

### Diagrama de Casos de Uso (Versión solicitada — Sistema de Seguro de Salud)
```mermaid
flowchart LR
  classDef actor fill:#f7f7f7,stroke:#333,stroke-width:1px;

  Af([Afiliado]):::actor
  Ad([Administrador]):::actor
  PM([Proveedor Médico]):::actor
  ES([Empleado del Seguro]):::actor
  SB([Sistema Bancario]):::actor

  subgraph Sistema [Sistema de Seguro de Salud]
    CU01([CU01 Registrar Afiliado])
    CU02([CU02 Iniciar Sesión])
    CU03([CU03 Gestionar Pólizas])
    CU04([CU04 Consultar Cobertura])
    CU05([CU05 Registrar Reclamación Médica])
    CU06([CU06 Revisar Reclamaciones])
    CU07([CU07 Registrar Servicio Médico])
    CU08([CU08 Emitir Pago a Proveedor])
    CU09([CU09 Generar Reportes])
    CU10([CU10 Actualizar Datos Personales])
  end

  Ad -- usa --> CU01
  Ad -- usa --> CU03
  Ad -- usa --> CU08
  Ad -- usa --> CU09
  Ad -- inicia --> CU02

  Af -- usa --> CU04
  Af -- usa --> CU05
  Af -- usa --> CU10
  Af -- inicia --> CU02

  PM -- usa --> CU07
  PM -- inicia --> CU02

  ES -- usa --> CU06
  ES -- inicia --> CU02

  SB -- participa --> CU08
```

---

## Diagrama de Clases del Dominio
```mermaid
classDiagram
  class Usuario {
    +id: UUID
    +nombre: string
    +rol: Rol
  }

  class Afiliado {
    +id: UUID
    +nombre: string
    +cedula: string
    +plan: Plan
    +estado: EstadoAfiliado
    +telefono: string
    +email: string
    +dependientes: int
  }

  class Autorizacion {
    +id: UUID
    +afiliadoId: UUID
    +procedimiento: string
    +proveedorId: UUID
    +copago: number
    +estado: EstadoAutorizacion
    +fecha: date
  }

  class Reclamo {
    +id: UUID
    +afiliadoId: UUID
    +proveedorId: UUID
    +monto: number
    +fecha: date
    +estado: EstadoReclamo
  }

  class ProveedorMedico {
    +id: UUID
    +nombre: string
    +tipo: TipoProveedor
    +ciudad: string
    +telefono: string
  }

  class Poliza {
    +id: UUID
    +empresa: string
    +plan: Plan
    +inicio: date
    +fin: date
    +primaMensual: number
    +asegurados: int
  }

  class Notificacion {
    +id: UUID
    +tipo: TipoNotificacion
    +mensaje: string
    +fecha: date
  }

  class Plan {
    +id: UUID
    +nombre: string
    +cobertura: string
  }

  class ServicioMedico {
    +id: UUID
    +afiliadoId: UUID
    +proveedorId: UUID
    +descripcion: string
    +monto: number
    +fecha: date
  }

  class TransaccionPago {
    +id: UUID
    +proveedorId: UUID
    +referenciaBanco: string
    +monto: number
    +fecha: date
    +estado: EstadoPago
  }

  Usuario "1" --> "*" Notificacion
  Afiliado "1" --> "*" Autorizacion : solicita
  Afiliado "1" --> "*" Reclamo : registra
  ProveedorMedico "1" --> "*" Autorizacion : atiende
  ProveedorMedico "1" --> "*" Reclamo : participa
  ProveedorMedico "1" --> "*" ServicioMedico : presta
  Afiliado "1" --> "*" ServicioMedico : recibe
  ServicioMedico "1" --> "0..1" Reclamo : asociado
  ProveedorMedico "1" --> "*" TransaccionPago : pago
  TransaccionPago "1" --> "1" ProveedorMedico
  Poliza "1" --> "*" Afiliado : cubre
  Plan "1" --> "*" Afiliado : asignado
  Poliza "1" --> "1" Plan : define
```

---

## Diagramas de Secuencia

### CU07 Registrar Servicio Médico
```mermaid
sequenceDiagram
  participant PM as Proveedor Médico
  participant UI as Frontend (React)
  participant SM as ServiciosController
  participant API as Backend API
  participant N as Notificaciones

  PM->>UI: Abrir "Registrar Servicio"
  UI->>SM: Enviar datos del servicio
  SM->>API: Validar afiliado y póliza
  API-->>SM: OK / Error
  SM->>API: POST /servicios
  API-->>SM: Servicio registrado
  SM-->>UI: Confirmación y actualización
  UI->>N: Notificar registro
```

### CU08 Emitir Pago a Proveedor
```mermaid
sequenceDiagram
  participant Adm as Administrador
  participant UI as Frontend (React)
  participant PG as PagosController
  participant API as Backend API
  participant Bank as Sistema Bancario
  participant N as Notificaciones

  Adm->>UI: Seleccionar proveedor y monto
  UI->>PG: Solicitar emisión de pago
  PG->>API: Crear transacción
  API-->>PG: Transacción creada
  PG->>Bank: Enviar orden de pago
  Bank-->>PG: Confirmación / Rechazo
  PG->>API: Actualizar estado transacción
  API-->>PG: OK
  PG-->>UI: Mostrar resultado
  UI->>N: Notificar al proveedor
```

### CU06 Revisar Reclamaciones
```mermaid
sequenceDiagram
  participant ES as Empleado del Seguro
  participant UI as Frontend (React)
  participant RC as ReclamosController
  participant API as Backend API
  participant N as Notificaciones

  ES->>UI: Abrir lista de reclamaciones
  UI->>API: GET /reclamos?estado=en_revision
  API-->>UI: Reclamaciones pendientes
  ES->>UI: Revisar documentos
  UI->>RC: Decisión (Aprobar/Rechazar)
  RC->>API: PATCH /reclamos/{id}
  API-->>RC: Estado actualizado
  RC-->>UI: Refrescar
  UI->>N: Notificar resultado
```

### CU04 Consultar Cobertura
```mermaid
sequenceDiagram
  participant Af as Afiliado
  participant UI as Frontend (React)
  participant PL as PolizasController
  participant API as Backend API

  Af->>UI: Abrir "Mi Cobertura"
  UI->>API: GET /polizas/{afiliadoId}/coberturas
  API-->>UI: Lista de coberturas
  UI-->>Af: Mostrar detalle y límites
```

### CU10 Actualizar Datos Personales
```mermaid
sequenceDiagram
  participant Af as Afiliado
  participant UI as Frontend (React)
  participant AF as AfiliadosController
  participant API as Backend API
  participant N as Notificaciones

  Af->>UI: Abrir perfil
  UI->>AF: Enviar cambios de contacto
  AF->>API: PUT /afiliados/{id}
  API-->>AF: Datos actualizados
  AF-->>UI: Confirmación
  UI->>N: Notificar actualización
```

---

## Diagramas de Actividades

### Flujo: Crear Autorización
```mermaid
flowchart TD
  A[Inicio] --> B[Buscar afiliado]
  B --> C[Seleccionar procedimiento]
  C --> D[Seleccionar proveedor]
  D --> E{"Cobertura suficiente?"}
  E -- Sí --> F[Calcular copago]
  E -- No --> G["Alertar excedente / solicitar validación"]
  F --> H[Confirmar solicitud]
  G --> H
  H --> I["Crear autorización (Pendiente)"]
  I --> J[Notificar]
  J --> K[Fin]
```

### Flujo: Procesar Reclamo
```mermaid
flowchart TD
  A[Inicio] --> B[Capturar datos del reclamo]
  B --> C[Adjuntar documentos]
  C --> D{Documentación completa?}
  D -- Sí --> E[Enviar a revisión]
  D -- No --> B
  E --> F{Decisión}
  F -- Aprobado --> G[Registrar pago]
  F -- Rechazado --> H[Informar rechazo]
  G --> I[Actualizar métricas]
  H --> I
  I --> J[Notificar]
  J --> K[Fin]
```

### Flujo: Gestionar Afiliado
```mermaid
flowchart TD
  A[Inicio] --> B[Filtrar/Buscar]
  B --> C{Acción}
  C -- Ver detalle --> D[Mostrar ficha]
  C -- Crear/Editar --> E[Formulario de afiliado]
  E --> F[Validar datos]
  F --> G{Valido?}
  G -- Sí --> H[Guardar cambios]
  G -- No --> E
  H --> I[Refrescar tabla]
  I --> J[Notificar]
  J --> K[Fin]
```

### Flujo: Consultar Proveedores
```mermaid
flowchart TD
  A[Inicio] --> B["Seleccionar filtros \\(ciudad, tipo\\)"]
  B --> C[Ver lista de proveedores]
  C --> D["Ver detalle / Contacto"]
  D --> E[Fin]
```
### Diagramas de Actividades (Versión solicitada — Sistema de Seguro de Salud)
```mermaid
flowchart TD
  A[Inicio] --> B[Capturar datos del servicio]
  B --> C[Adjuntar comprobantes]
  C --> D{"Documentación completa?"}
  D -- Sí --> E[Enviar reclamo]
  D -- No --> B
  E --> F[Recibir confirmación]
  F --> G[Estado: En revisión]
  G --> H[Fin]
```

```mermaid
flowchart TD
  A[Inicio] --> B[Listar reclamaciones pendientes]
  B --> C[Revisar documentos]
  C --> D{"Valida?"}
  D -- Sí --> E[Aprobar reclamo]
  D -- No --> F[Rechazar reclamo]
  E --> G[Preparar pago]
  F --> G[Notificar rechazo]
  G --> H[Actualizar estado]
  H --> I[Fin]
```

```mermaid
flowchart TD
  A[Inicio] --> B[Ingresar datos del servicio]
  B --> C[Validar afiliado y póliza]
  C --> D{"Elegible?"}
  D -- Sí --> E[Registrar servicio]
  D -- No --> F[Notificar no elegible]
  E --> G[Confirmar registro]
  F --> G
  G --> H[Fin]
```

```mermaid
flowchart TD
  A[Inicio] --> B[Seleccionar proveedor y monto]
  B --> C[Verificar aprobación previa]
  C --> D{"Aprobado?"}
  D -- Sí --> E[Enviar orden al banco]
  D -- No --> F[Solicitar aprobación]
  E --> G[Recibir confirmación bancaria]
  G --> H[Registrar transacción]
  H --> I[Notificar proveedor]
  I --> J[Fin]
```

```mermaid
flowchart TD
  A[Inicio] --> B[Visualizar plan vigente]
  B --> C[Filtrar por servicio]
  C --> D[Ver límites y copagos]
  D --> E[Fin]
```

```mermaid
flowchart TD
  A[Inicio] --> B[Editar datos de contacto]
  B --> C[Validar formato]
  C --> D{"Válido?"}
  D -- Sí --> E[Guardar cambios]
  D -- No --> B
  E --> F[Notificar actualización]
  F --> G[Fin]
```

---

## Notas
- Estos diagramas se basan en las funcionalidades presentes en la aplicación (Afiliados, Autorizaciones, Reclamos, Proveedores, Pólizas, Dashboard y Notificaciones).
- Se pueden ampliar para cubrir integraciones específicas con APIs o cambios futuros de arquitectura.
- Para visualizar Mermaid en Markdown puedes usar extensiones de VS Code o ver el archivo en GitHub.
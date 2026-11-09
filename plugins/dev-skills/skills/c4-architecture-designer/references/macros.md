# C4-PlantUML Macro Reference

Complete reference for the C4-PlantUML macros. `?` marks an optional argument. All
element macros take `$alias, $label` first; aliases must be unique within a diagram.

## Contents
- Includes
- Person & System (Context)
- Container
- Component
- Boundaries
- Relationships
- Deployment
- Dynamic diagrams
- Layout & legend
- Styling, tags, and icons
- Common pitfalls

## Includes

Pick the file matching the deepest level used in the diagram. A higher-level include
also defines all lower-level macros it builds on, but use the file that matches intent.

```
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
```

Offline / local PlantUML ships the last released version in its standard library:
`!include <C4/C4_Container>` (no internet needed). The raw URL is always the most
current; prefer it unless the user needs offline rendering.

## Person & System (Context level)

- `Person(alias, label, ?descr, ?sprite, ?tags, ?link)` — a human user inside scope
- `Person_Ext(alias, label, ?descr, ...)` — a human user outside scope (greyed)
- `System(alias, label, ?descr, ...)` — a software system in scope
- `System_Ext(alias, label, ?descr, ...)` — external system (greyed)
- `SystemDb(alias, label, ?descr, ...)` — system shaped as a database
- `SystemQueue(alias, label, ?descr, ...)` — system shaped as a queue
- `SystemDb_Ext`, `SystemQueue_Ext` — external variants

## Container level

A container is a separately runnable/deployable unit (NOT a Docker container
specifically — it's an app, service, database, SPA, etc.).

- `Container(alias, label, technology, ?descr, ?sprite, ?tags, ?link)`
- `ContainerDb(alias, label, technology, ?descr, ...)` — database container
- `ContainerQueue(alias, label, technology, ?descr, ...)` — queue/bus container
- `Container_Ext`, `ContainerDb_Ext`, `ContainerQueue_Ext` — external variants

The `technology` argument is required and meaningful: "React", "Java/Spring Boot",
"PostgreSQL 15", "Kafka". It renders as `[Technology]` under the label.

## Component level

A component is a grouping of related functionality inside a container (a module,
package, or major class cluster) — not a separate deployable unit.

- `Component(alias, label, technology, ?descr, ...)`
- `ComponentDb(alias, label, technology, ?descr, ...)`
- `ComponentQueue(alias, label, technology, ?descr, ...)`
- `Component_Ext`, `ComponentDb_Ext`, `ComponentQueue_Ext`

## Boundaries

- `System_Boundary(alias, label) { ... }` — groups containers of one system
- `Container_Boundary(alias, label) { ... }` — groups components of one container
- `Enterprise_Boundary(alias, label) { ... }` — groups systems within an enterprise
  (Context level; use to separate internal vs. external systems)
- `Boundary(alias, label, ?type, ?tags, ?link) { ... }` — generic boundary

Place elements inside the `{ }` block. Do NOT wrap the entire diagram in one giant
boundary — the relationship layout engine struggles with it and floating legends
won't render inside it.

## Relationships

`Rel($from, $to, $label, ?$techn, ?$descr, ?$sprite, ?$tags, ?$link, ?$index, ?$rel)`

- `Rel(a, b, "Uses", "HTTPS")` — basic labeled, with optional technology
- Directional (hint the layout engine): `Rel_Up`, `Rel_Down`, `Rel_Left`, `Rel_Right`
  (also the short forms `Rel_U`, `Rel_D`, `Rel_L`, `Rel_R`)
- `BiRel(a, b, "Label", ?techn)` — bidirectional; directional `BiRel_*` variants exist
- `Rel_Back(a, b, ...)` — arrow points back from `to` to `from`
- Layout-only (invisible, force positioning without drawing an arrow):
  `Lay_U`, `Lay_D`, `Lay_L`, `Lay_R`, `Lay_Distance`

Labels should be action-oriented and read from→to: "Sends order to", "Reads from",
"Authenticates via", "Publishes events to". Add technology when it clarifies the
integration; omit it when it's noise.

## Deployment level

Built on container macros — define containers inside deployment nodes.

- `Deployment_Node(alias, label, ?type, ?descr, ?sprite, ?tags, ?link) { ... }`
- `Node(alias, label, ?type, ?descr, ...) { ... }` — short alias for Deployment_Node
- `Node_L(...)` — left-aligned node; `Node_R(...)` — right-aligned node

`type` describes the infrastructure: "Amazon EC2", "Kubernetes Pod", "iOS Device",
"Ubuntu 22.04 Server". Nodes nest to show region → cluster → host → container.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
Deployment_Node(aws, "AWS", "Cloud") {
  Deployment_Node(region, "us-east-1", "Region") {
    Deployment_Node(eks, "EKS Cluster", "Kubernetes") {
      Container(api, "API", "Java/Spring Boot")
    }
    Deployment_Node(rds, "RDS", "Managed DB") {
      ContainerDb(db, "Database", "PostgreSQL")
    }
  }
}
Rel(api, db, "Reads/Writes", "SQL/TCP")
@enduml
```

## Dynamic diagrams

Use `C4_Dynamic.puml`. Relationships auto-number to show order. Set/advance the index
with the `$index` argument; `RelIndex...()` macros are obsolete — use `Rel($index=...)`.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
Person(user, "Customer")
Container(spa, "Web App", "React")
Container(api, "API", "Java")
ContainerDb(db, "Database", "PostgreSQL")

Rel(user, spa, "Submits order")
Rel(spa, api, "POST /orders", "JSON/HTTPS")
Rel(api, db, "Inserts order row", "SQL")
Rel(api, spa, "Returns confirmation", "JSON")
@enduml
```

## Layout & legend

- `LAYOUT_TOP_DOWN()` — default flow, top to bottom
- `LAYOUT_LEFT_RIGHT()` — left-to-right; directional `Rel_*` rotate with it
- `LAYOUT_LANDSCAPE()` — left-to-right but directional `Rel_*` are NOT rotated
- `LAYOUT_WITH_LEGEND()` — auto-layout plus a legend explaining stereotypes
- `SHOW_LEGEND(?hideStereotype)` — explicit legend; `SHOW_LEGEND(false)` keeps `<<stereotypes>>`
- `SHOW_FLOATING_LEGEND()` — legend as a movable element
- `HIDE_STEREOTYPE()` — hide the `<<person>>`/`<<system>>` stereotype text
- `SHOW_ELEMENT_TYPE()` — show element type in the technology slot instead of a stereotype
- Person rendering: `SHOW_PERSON_PORTRAIT()`, `HIDE_PERSON_SPRITE()`, `SHOW_PERSON_SPRITE(?sprite)`
- `set separator none` — when using `.`-namespaced aliases

Put legend macros AFTER at least one use of each element you want represented.

## Styling, tags, and icons

- `AddElementTag(tagName, ?bgColor, ?fontColor, ?borderColor, ?shadowing, ?shape, ?sprite, ?techn, ?legendText, ?legendSprite)`
- `AddRelTag(tagName, ?textColor, ?lineColor, ?lineStyle, ?sprite, ?techn, ?legendText)`
- `AddBoundaryTag(...)` — tag styling for boundaries
- Apply a tag via the `$tags` argument: `Container(api, "API", "Java", $tags="critical")`
  (multiple tags separated by `+`)
- `UpdateElementStyle(elementName, ?bg, ?font, ?border, ...)` — restyle a built-in type
- `UpdateRelStyle(textColor, lineColor)` — restyle the previous `Rel`
- `UpdateBoundaryStyle(...)`, `UpdateLegendTitle("...")`

Icons/sprites (optional polish): include a sprite set, then pass the sprite name as the
`$sprite` argument.
```
!define DEVICONS https://raw.githubusercontent.com/tupadr3/plantuml-icon-font-sprites/master/devicons
!include DEVICONS/java.puml
Container(api, "API", "Java", "Business logic", $sprite="java")
```

## Common pitfalls

- Don't omit the `technology` argument on `Container`/`Component` — it's required and informative.
- Don't put commas inside an unquoted label; always quote labels and descriptions.
- Don't wrap everything in one outer boundary (see Boundaries).
- Don't mix C4 levels in one diagram (no components sitting next to whole systems).
- Aliases can't contain spaces or hyphens at the start; use `snake_case`.
- A relationship references aliases, not labels: `Rel(spa, api, ...)` not `Rel("Web App", ...)`.

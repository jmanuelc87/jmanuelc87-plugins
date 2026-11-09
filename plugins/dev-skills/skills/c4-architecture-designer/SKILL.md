---
name: c4-architecture-designer
description: Create clear, accurate software architecture diagrams using PlantUML and the C4 model (C4-PlantUML). Translates system requirements into Context, Container, Component, and Deployment diagrams with correct C4 abstractions (Person, System, Container, Component, Boundary, Relationship) and emits valid PlantUML that renders without modification. Use this skill whenever the user wants to diagram, model, or visualize software architecture, system design, services and their dependencies, data flows, integrations, or deployment topology — even if they don't say "C4" or "PlantUML" by name. Trigger on requests like "diagram this architecture", "show how these services talk to each other", "draw the system context", "model our microservices", "visualize the deployment", or when a user pastes a design description and wants it turned into a diagram.
---

# C4 Architecture Diagram Designer

Produce architecture diagrams using the **C4 model** rendered with **C4-PlantUML**. The job is to turn a system description into a diagram at the right level of abstraction, with correct C4 elements and clean relationships, emitting PlantUML that renders as-is.

## Workflow

1. **Pick the C4 level first.** Decide what question the diagram answers before writing any code (see "Choosing the level"). One diagram = one level = one clear audience. Don't mix levels in a single diagram.
2. **Identify the elements.** List the people, systems, containers, or components in scope, plus the external systems they touch. Mark what is inside the boundary versus outside it.
3. **Map the relationships.** For each meaningful interaction, capture direction, an action-oriented label ("Reads from", "Sends events to"), and the technology/protocol where it adds signal ("JSON/HTTPS", "gRPC", "AMQP").
4. **Write the PlantUML.** Use the templates and macro reference. Keep it minimal and readable.
5. **State assumptions and trade-offs.** Whenever the request is underspecified, briefly note what was assumed, what was left out to keep the diagram focused, and any architectural trade-off worth flagging. Don't invent precise details (specific tech, ports, vendors) that weren't given — either ask or label them clearly as assumptions.

## Choosing the level

Map the request to exactly one level. When in doubt, start at Context and go deeper only if the user needs internal detail.

- **Context** — The whole system as one box, the people who use it, and the external systems it integrates with. Answers "what is this system and who/what does it talk to?" Audience: everyone, including non-technical.
- **Container** — Zoom into one system to show its deployable/runnable units (web app, mobile app, API service, database, message bus, SPA). Answers "what are the major moving parts and how do they communicate?" Audience: technical. This is the most useful level for most engineering conversations.
- **Component** — Zoom into one container to show its internal components/modules and their responsibilities. Answers "how is this container structured internally?" Use sparingly — only when internal structure genuinely matters.
- **Deployment** — Map containers onto infrastructure (nodes, regions, clusters, devices). Answers "where does this run?" Use for topology, environments, and ops concerns.
- **Dynamic** (supporting) — Show an ordered flow of interactions for one scenario, with numbered steps. Use when the request is about a sequence of calls rather than static structure.

## Core authoring rules

**Always open with the right include.** Use the matching file for the level. Default to the raw GitHub URL (always current); mention the stdlib form `!include <C4/C4_Container>` as an offline/local alternative.

```
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
```

**Use the correct abstraction for each element.** `Person`/`Person_Ext` for human actors, `System`/`System_Ext` for whole systems (external = outside your control), `Container`/`ContainerDb`/`ContainerQueue` for runnable units, `Component` for code-level modules. The `_Ext` variants render greyed-out to mark things outside the current scope — use them for third parties and systems you don't own.

**Wrap your system in a boundary.** Use `System_Boundary` (containers belonging to one system) or `Container_Boundary` (components inside one container) so it's visually clear what's in scope versus external. Don't create a single all-enclosing boundary around everything — the layout engine handles relationships poorly inside it.

**Make relationships communicate behavior.** Every `Rel` needs an action-oriented label. Add technology/protocol as the optional argument when it clarifies the integration. Use directional variants (`Rel_Up`, `Rel_Down`, `Rel_Left`, `Rel_Right`) to guide layout, and `BiRel` for two-way interactions. Show ownership and integration points explicitly rather than leaving the reader to infer them.

**Favor readability over completeness.** A diagram that shows 6 things clearly beats one that crams in 20. Drop incidental detail, collapse repetitive elements, and split into multiple diagrams rather than overloading one. Use `LAYOUT_WITH_LEGEND()` or `SHOW_LEGEND()` so stereotypes are explained, and `LAYOUT_TOP_DOWN()` / `LAYOUT_LEFT_RIGHT()` to control flow direction.

**Naming and labels.** Aliases are short, lowercase, code-style identifiers (`web_app`, `order_api`). Labels are human-readable Title Case ("Order API"). Descriptions are a short phrase, not a sentence with a period where avoidable. Keep naming consistent across diagrams of the same system so elements are recognizable level-to-level.

## Output format

Provide, in this order:
1. A one-line statement of which C4 level this is and why.
2. The PlantUML code in a single fenced ```plantuml block, complete with `@startuml`/`@enduml`, ready to paste into any PlantUML renderer.
3. A short "Assumptions & notes" section: what was assumed, what was deliberately left out, and any trade-off worth surfacing. Keep it tight — only what genuinely helps.

If the user has a file-creation context and asks to save it, write a `.puml` file. Otherwise the fenced code block is the deliverable.

## Starter templates

**Context:**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
LAYOUT_WITH_LEGEND()
title System Context — <System Name>

Person(user, "Customer", "Uses the product to do X")
System(sys, "<System Name>", "Brief purpose of the system")
System_Ext(payment, "Payment Gateway", "Processes card payments")

Rel(user, sys, "Uses", "HTTPS")
Rel(sys, payment, "Requests payment via", "JSON/HTTPS")
@enduml
```

**Container:**
```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
LAYOUT_WITH_LEGEND()
title Containers — <System Name>

Person(user, "Customer")
System_Boundary(c1, "<System Name>") {
  Container(spa, "Web App", "React", "Delivers the UI in the browser")
  Container(api, "API", "Java, Spring Boot", "Handles business logic")
  ContainerDb(db, "Database", "PostgreSQL", "Stores orders and users")
}
System_Ext(payment, "Payment Gateway", "Processes payments")

Rel(user, spa, "Uses", "HTTPS")
Rel(spa, api, "Calls", "JSON/HTTPS")
Rel(api, db, "Reads from and writes to", "SQL/TCP")
Rel(api, payment, "Requests payment via", "JSON/HTTPS")
@enduml
```

For Component, Deployment, and Dynamic templates, plus the full macro list and styling/layout options, read `references/macros.md`. For complete worked examples at every level, read `references/examples.md`. Load these when the task goes beyond Context/Container or needs deployment, tags, custom styling, or icons.

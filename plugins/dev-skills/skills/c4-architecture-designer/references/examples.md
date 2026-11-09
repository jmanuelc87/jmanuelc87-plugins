# Worked Examples

Complete, render-ready examples for each C4 level, plus the reasoning that shaped each
one. Use these as patterns — adapt element names, technologies, and relationships to the
user's actual system.

## 1. Context — Internet Banking

Shows the system as one box, who uses it, and the external systems it depends on. No
internal detail. Good first diagram for any new system or for a non-technical audience.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Context.puml
LAYOUT_WITH_LEGEND()
title System Context — Internet Banking System

Person(customer, "Personal Banking Customer", "A customer of the bank")
System(banking, "Internet Banking System", "Lets customers view accounts and make payments")

System_Ext(mainframe, "Mainframe Banking System", "Stores core account information")
System_Ext(email, "E-mail System", "Sends notifications to customers")

Rel(customer, banking, "Views accounts and makes payments using", "HTTPS")
Rel(banking, mainframe, "Gets account information from, and makes payments using", "XML/HTTPS")
Rel(banking, email, "Sends e-mail using", "SMTP")
Rel_Back(customer, email, "Sends e-mails to")
@enduml
```

Notes: external systems use `System_Ext` (greyed). `Rel_Back` shows email flowing toward
the customer without reordering the layout.

## 2. Container — Internet Banking

Zooms into the one system to show its runnable parts. This is the workhorse level for
engineering discussions. Note the `System_Boundary` making scope explicit.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Container.puml
LAYOUT_WITH_LEGEND()
title Containers — Internet Banking System

Person(customer, "Personal Banking Customer")

System_Boundary(banking, "Internet Banking System") {
  Container(web, "Web Application", "Java, Spring MVC", "Serves static content and the SPA")
  Container(spa, "Single-Page App", "JavaScript, Angular", "Provides banking features in the browser")
  Container(mobile, "Mobile App", "Xamarin", "Provides a subset of features on mobile")
  Container(api, "API Application", "Java, Spring Boot", "Provides banking functionality via JSON/HTTPS")
  ContainerDb(db, "Database", "Oracle", "Stores users, accounts, and audit logs")
}

System_Ext(mainframe, "Mainframe Banking System")
System_Ext(email, "E-mail System")

Rel(customer, web, "Visits bigbank.com", "HTTPS")
Rel(customer, spa, "Uses", "HTTPS")
Rel(customer, mobile, "Uses")
Rel(web, spa, "Delivers to the browser")
Rel(spa, api, "Calls", "JSON/HTTPS")
Rel(mobile, api, "Calls", "JSON/HTTPS")
Rel(api, db, "Reads from and writes to", "JDBC")
Rel(api, mainframe, "Makes API calls to", "XML/HTTPS")
Rel(api, email, "Sends e-mail using", "SMTP")
@enduml
```

## 3. Component — API Application

Zooms into ONE container (the API) to show its internal structure. Use only when
internal organization matters. Note `Container_Boundary` and that the database and
external systems remain as context.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Component.puml
LAYOUT_WITH_LEGEND()
title Components — API Application

Container(spa, "Single-Page App", "Angular")
ContainerDb(db, "Database", "Oracle")
System_Ext(mainframe, "Mainframe Banking System")

Container_Boundary(api, "API Application") {
  Component(signin, "Sign In Controller", "Spring MVC REST", "Handles authentication requests")
  Component(accounts, "Accounts Controller", "Spring MVC REST", "Serves account data")
  Component(security, "Security Component", "Spring Bean", "Validates credentials and issues tokens")
  Component(mainframe_facade, "Mainframe Facade", "Spring Bean", "Wraps the mainframe API")
}

Rel(spa, signin, "Submits credentials to", "JSON/HTTPS")
Rel(spa, accounts, "Requests account data from", "JSON/HTTPS")
Rel(signin, security, "Uses")
Rel(security, db, "Reads from", "JDBC")
Rel(accounts, mainframe_facade, "Uses")
Rel(mainframe_facade, mainframe, "Makes API calls to", "XML/HTTPS")
@enduml
```

## 4. Deployment — Production Topology

Maps containers onto infrastructure. Nodes nest to show the hierarchy. Use container
macros inside nodes; relationships connect the deployed containers.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Deployment.puml
LAYOUT_WITH_LEGEND()
title Deployment — Internet Banking (Production)

Deployment_Node(mobile_dev, "Customer's Mobile Device", "iOS / Android") {
  Container(mobile, "Mobile App", "Xamarin")
}

Deployment_Node(aws, "Amazon Web Services", "us-east-1") {
  Deployment_Node(eks, "EKS Cluster", "Kubernetes") {
    Deployment_Node(api_pod, "api-pod", "Pod (x3 replicas)") {
      Container(api, "API Application", "Java/Spring Boot")
    }
  }
  Deployment_Node(rds, "Amazon RDS", "Managed Database") {
    ContainerDb(db, "Database", "Oracle")
  }
}

Rel(mobile, api, "Makes API calls to", "JSON/HTTPS")
Rel(api, db, "Reads from and writes to", "JDBC")
@enduml
```

## 5. Dynamic — Sign-in Flow

Shows the ordered sequence of interactions for one scenario. Relationships auto-number.

```plantuml
@startuml
!include https://raw.githubusercontent.com/plantuml-stdlib/C4-PlantUML/master/C4_Dynamic.puml
LAYOUT_WITH_LEGEND()
title Dynamic — Customer Sign-in

Person(customer, "Customer")
Container(spa, "Single-Page App", "Angular")
Container(api, "API Application", "Java")
Component(security, "Security Component", "Spring Bean")
ContainerDb(db, "Database", "Oracle")

Rel(customer, spa, "Enters credentials")
Rel(spa, api, "POST /signin", "JSON/HTTPS")
Rel(api, security, "Validates credentials with")
Rel(security, db, "Looks up user in", "JDBC")
Rel(security, api, "Returns token to")
Rel(api, spa, "Returns session token", "JSON")
@enduml
```

## Adapting these

- Replace technologies with the user's actual stack; never leave placeholder tech in a final diagram.
- If the user gives a tech but not a description, it's fine to omit the description rather than invent one.
- When the user's system has many similar containers (e.g. 12 microservices), group or
  sample them rather than drawing all 12 — note the simplification in assumptions.
- Keep aliases stable across levels so the same element is recognizable when zooming in.

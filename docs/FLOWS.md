# CyberSecurity-AI Flows

## 1. MCP Client Flow

```mermaid
sequenceDiagram
  participant Client as MCP Client
  participant Server as CyberSecurity-AI MCP
  participant Policy as Policy Boundary
  participant Core as Public-Safe Core
  participant Bridge as CHIMERIA Bridge

  Client->>Server: tools/list
  Server-->>Client: career + platform + bridge tools
  Client->>Server: tools/call career_invoke
  Server->>Policy: check intent
  Policy-->>Server: allowed / safe rewrite
  Server->>Core: build career packet
  Core->>Bridge: optional approved manifest status
  Bridge-->>Core: public-safe bridge packet
  Core-->>Server: final packet
  Server-->>Client: defensive intelligence output
```

## 2. Local HTTP Demo Flow

```mermaid
flowchart TD
  Browser[Browser or Local Dashboard] --> Health[/GET /health/]
  Browser --> Platform[/GET /platform/]
  Browser --> Careers[/GET /careers/]
  Browser --> Search[/GET /search?q=iam/]
  Browser --> Bridge[/GET /bridge/]
  Browser --> Arch[/GET /architecture/]
  Platform --> Core[Public-Safe Core]
  Careers --> Core
  Search --> Policy[Policy Boundary]
  Policy --> Core
  Bridge --> Manifest[(Approved CHIMERIA Manifest)]
```

## 3. Private CHIMERIA Bridge Flow

```mermaid
flowchart LR
  A[Private CHIMERIA Trunk] --> B[Approved Export Review]
  B --> C[public_bridge_manifest.json]
  C --> D[CyberSecurity-AI Bridge Adapter]
  D --> E[Approved Fields Only]
  E --> F[MCP / CLI / HTTP Output]
  D -. blocks .-> G[Private source, doctrine internals, implementation details]
```

## 4. Marketing Demo Flow

1. Show the README architecture image.
2. Run MCP smoke test.
3. Run CLI platform packet.
4. Run local HTTP demo API.
5. Search a safe career term.
6. Show CHIMERIA bridge status closed by default.
7. Optional private demo: set approved manifest and show safe bridge status.

## 5. Safety Flow

```mermaid
flowchart TD
  Request[User or Agent Request] --> Check[Policy Check]
  Check -->|Safe| Answer[Career / Platform Packet]
  Check -->|Unsafe| Rewrite[Safe Defensive Reframe]
  Answer --> Boundary[No private trunk, no exploit guidance]
  Rewrite --> Boundary
```

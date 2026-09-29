# Eight AI Agent Roadmap Flows

Each diagram has an SVG preview. To edit the flow, modify the Mermaid source below or the corresponding text.

## 01. Prompt Engineering Foundations

```mermaid
flowchart TD
    N0["User goal: Define the task and intended reader"]
    N1["Context: Supply relevant facts and boundaries"]
    N0 --> N1
    N2["Instruction: Specify role, task, constraints, and tone"]
    N1 --> N2
    N3["Example + format: Show a sample or required JSON shape"]
    N2 --> N3
    N4["LLM response: Generate an answer from the prompt"]
    N3 --> N4
    N5["Review + refine: Check accuracy; revise weak instructions"]
    N4 --> N5
    classDef core fill:#19c6be,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** Output: a repeatable prompt and an answer checked against the goal.

## 02. Working with LLMs and APIs

```mermaid
flowchart TD
    N0["App request: FastAPI receives an authenticated request"]
    N1["Prepare payload: Select model, instructions, and input"]
    N0 --> N1
    N2["API call: Send request; handle timeouts and limits"]
    N1 --> N2
    N3["Structured response: Parse text or schema-constrained JSON"]
    N2 --> N3
    N4["Validate: Check fields, types, errors, and usage"]
    N3 --> N4
    N5["Return result: Send a safe response to the client"]
    N4 --> N5
    classDef core fill:#7c72ff,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** Track latency, token usage, and cost per request.

## 03. Building AI-Powered Applications

```mermaid
flowchart TD
    N0["Question: User asks about an order or document"]
    N1["Choose source: Query SQL records or search documents"]
    N0 --> N1
    N2["Retrieve evidence: Fetch relevant, permitted passages"]
    N1 --> N2
    N3["Grounded prompt: Attach evidence and answer instructions"]
    N2 --> N3
    N4["Check answer: Verify citations and missing information"]
    N3 --> N4
    N5["Answer: Return response with source references"]
    N4 --> N5
    classDef core fill:#3195ed,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** RAG is useful for documents; structured SQL may be better for records.

## 04. Tool Use and Function Calling

```mermaid
flowchart TD
    N0["User request: Ask for an order status or calculation"]
    N1["Model selects tool: Propose a named function and arguments"]
    N0 --> N1
    N2["Permission gate: Authenticate and validate arguments"]
    N1 --> N2
    N3["Execute function: Call an allowed API, database, or calculator"]
    N2 --> N3
    N4["Tool result: Return data or a handled error to the model"]
    N3 --> N4
    N5["Final response: Explain result without inventing actions"]
    N4 --> N5
    classDef core fill:#f39b43,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** The application executes tools; the model only requests them.

## 05. AI Agent Fundamentals

```mermaid
flowchart TD
    N0["Goal + limit: Define success, tools, and maximum steps"]
    N1["Plan next step: Choose answer, retrieval, or tool use"]
    N0 --> N1
    N2["Act: Call an allowed tool with checked arguments"]
    N1 --> N2
    N3["Observe: Inspect result and update task context"]
    N2 --> N3
    N4["Stop or repeat: Check goal, budget, and error conditions"]
    N3 --> N4
    N5["Report outcome: Return answer or explain blocked work"]
    N4 --> N5
    N4 -->|Goal incomplete, limits allow| N1
    classDef core fill:#dd69c5,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** If the goal is incomplete and limits allow, repeat Plan → Act → Observe.

## 06. Multi-Agent Systems and Orchestration

```mermaid
flowchart TD
    N0["Complex task: Separate genuinely distinct subtasks"]
    N1["Coordinator: Define owners, data access, and handoffs"]
    N0 --> N1
    N2["Specialists: Research, analyze, or execute scoped work"]
    N1 --> N2
    N3["Handoff: Pass structured findings and provenance"]
    N2 --> N3
    N4["Merge + review: Resolve conflicts; require approval if needed"]
    N3 --> N4
    N5["One answer: Deliver an integrated, traceable result"]
    N4 --> N5
    classDef core fill:#38bf83,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** Use multiple agents only when specialization earns its extra complexity.

## 07. AI Agent Architect Skills

```mermaid
flowchart TD
    N0["Requirements: Set quality, latency, cost, and risk targets"]
    N1["System design: Choose model, data, tools, and boundaries"]
    N0 --> N1
    N2["Trust controls: Enforce identity, least privilege, approvals"]
    N1 --> N2
    N3["Evaluation: Test real tasks and known failure cases"]
    N2 --> N3
    N4["Operations: Trace calls, monitor, retry, and recover"]
    N3 --> N4
    N5["Release decision: Review evidence before deployment"]
    N4 --> N5
    classDef core fill:#f36b79,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** An architect designs the whole workflow and its failure handling.

## 08. Career Path and Portfolio

```mermaid
flowchart TD
    N0["Foundation: Build Python, API, SQL, and prompt skills"]
    N1["Application: Ship one validated model-powered feature"]
    N0 --> N1
    N2["Agent project: Add retrieval, tools, and permissions"]
    N1 --> N2
    N3["Production proof: Measure quality, cost, latency, and errors"]
    N2 --> N3
    N4["Architecture case: Document tradeoffs and safeguards"]
    N3 --> N4
    N5["Portfolio: Show working demos and engineering decisions"]
    N4 --> N5
    classDef core fill:#bba1ff,stroke:#25314f,color:#101930
    class N0,N1,N2,N3,N4,N5 core
```

**Design note:** Roles and compensation depend on market and demonstrated capability.

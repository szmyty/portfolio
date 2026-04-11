# 🧹 COMPLEXITY SPEC — Complexity Budget Definition

---

## 🎯 Purpose

This specification defines the structure, rules, and expectations for the COMPLEXITY.md file.

The COMPLEXITY.md document serves as the authoritative complexity budget for the project, establishing principles that guide engineers toward simplicity and away from unnecessary abstraction.

---

## 🧱 Responsibilities of COMPLEXITY.md

COMPLEXITY.md must:

- define the core principle that complexity is a cost
- establish clear guiding principles for managing complexity
- provide concrete rules that can be applied during code review
- list warning signs that indicate complexity drift
- provide a decision heuristic for evaluating new complexity

---

## 📐 Required Sections

COMPLEXITY.md must include the following sections:

---

### 1. Purpose

Describes why the document exists and what it enables.

---

### 2. Core Principle

States the fundamental position on complexity in a single, memorable statement.

---

### 3. Guiding Principles

Covers at minimum:

- prefer simple solutions
- avoid premature abstraction
- introduce complexity only when justified

---

### 4. Complexity Budget Rules

A table or list of concrete, actionable rules such as:

- no speculative abstraction
- no premature optimization
- no unnecessary indirection

---

### 5. Warning Signs

Specific, observable indicators that complexity has exceeded the budget.

---

### 6. Decision Heuristic

A short set of questions that help engineers decide whether new complexity is justified.

---

### 7. Evolution

Describes when and how the document should be updated.

---

## 🧠 Formatting Rules

COMPLEXITY.md must:

- use clear section headers with emojis consistent with other system documents
- use concise bullet points
- include a table for rules where applicable
- avoid unnecessary verbosity
- maintain readability and scannability

---

## ⚠️ Constraints

COMPLEXITY.md must NOT:

- contain project-specific implementation details
- reference specific technologies or frameworks unless necessary
- include code samples
- evolve into a style guide (that belongs elsewhere)

---

## 🧭 Philosophy

COMPLEXITY.md is:

- a guiding principle document
- a shared vocabulary for complexity discussions
- a reference during code review and architecture decisions

It is not:

- a linting ruleset
- a technical specification
- a list of forbidden patterns

---

## 🔁 Evolution

COMPLEXITY.md should:

- be updated when new patterns emerge that require guidance
- be referenced during milestone audits
- remain concise — if it grows too large, it has violated its own principles

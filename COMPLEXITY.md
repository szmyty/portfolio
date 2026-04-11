# 🧹 COMPLEXITY — Complexity Budget Guidelines

---

## 🎯 Purpose

This document defines the complexity budget for this project.

It establishes principles to prevent unnecessary complexity and keep the codebase clean, maintainable, and understandable.

---

## 🧠 Core Principle

Complexity is a cost.

Every abstraction, pattern, or indirection added to the codebase must justify its existence through a clear, tangible benefit. When in doubt, choose the simpler path.

---

## 📐 Guiding Principles

### 1. Prefer Simple Solutions

- solve the problem at hand, not a hypothetical future problem
- write code that is easy to read and delete
- favor straightforward logic over clever constructs
- if two solutions work equally well, choose the simpler one

---

### 2. Avoid Premature Abstraction

- do not abstract until a pattern repeats at least three times
- duplication is preferable to a wrong abstraction
- abstractions must be earned through real, observed need
- an abstraction that does not simplify the call site is not an abstraction — it is overhead

---

### 3. Introduce Complexity Only When Justified

Complexity is justified when it:

- reduces a greater complexity elsewhere
- is required by a hard external constraint (performance, security, scale)
- is mandated by a well-understood, stable pattern (e.g. dependency injection, routing)

Complexity is not justified when it:

- exists to anticipate future requirements that may never arrive
- mirrors patterns from larger systems not appropriate for this scale
- is added for intellectual interest rather than practical need

---

## 🚦 Complexity Budget Rules

| Rule | Description |
|------|-------------|
| **No speculative abstraction** | Do not create shared utilities, hooks, or layers until the need is proven by repetition |
| **No premature optimization** | Do not optimize for performance until a bottleneck is measured |
| **No unnecessary indirection** | Avoid wrapping libraries unless a meaningful adapter layer is needed |
| **No framework mimicry** | Do not recreate framework patterns when the framework already handles them |
| **No over-configuration** | Avoid building configuration systems for values that will never change |

---

## ⚠️ Warning Signs

The following are signals that complexity is growing beyond its budget:

- a feature requires reading more than two files to understand
- a new contributor cannot trace a data flow without guidance
- an abstraction has only one concrete implementation
- a component accepts more than five props
- a module imports from more than five distinct sources
- a function does more than one thing

When these signals appear, simplify before extending.

---

## 🧭 Decision Heuristic

Before adding complexity, ask:

1. **Is this solving a real, current problem?** — If not, stop.
2. **Has this problem occurred more than twice?** — If not, wait.
3. **Does this simplify the code at the call site?** — If not, reconsider.
4. **Can I explain it to a new contributor in two sentences?** — If not, simplify.

If all four answers are yes, the complexity is justified.

---

## 🔁 Evolution

This document should be updated when:

- new patterns emerge that require guidance
- audit findings reveal complexity drift
- the scope of the project changes significantly

---

## 🧭 Final Note

This is not a rule against building things.

It is a rule against building things before they are needed.

Build for today. Refactor for tomorrow.

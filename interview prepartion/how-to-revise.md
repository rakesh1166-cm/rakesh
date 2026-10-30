# How to Revise (So You Don't Forget)

**Core principle:** Reading answers again feels productive, but you forget most of it within days.
Answers stick when you **pull them out of memory** (active recall) at **growing intervals** (spaced repetition).

> **Golden rule:** Never re-read an answer before you've tried to answer it from memory.

---

## 1. Learning a New Question (4 Steps)

1. **Understand it, don't memorize the words**
   - Run every code example yourself in Python.
   - Change the example a little and predict the output before running it.

2. **Shrink it to a one-line core idea**

   | Question | Core idea |
   |---|---|
   | `is` vs `==` | Identity vs equality; use `is` only for `None` |
   | Shallow vs deep copy | Shallow shares the nested objects, deep copies them |
   | LEGB | Local → Enclosing → Global → Built-in; `global`/`nonlocal` let you rebind |
   | Mutable vs immutable | Change in place vs reassign to a new object |

3. **Learn the answer as a structure.** Use this structure for every question:

   **Definition → Example → Trade-off or pitfall**

   This is also what earns a **Strong** grade in the quiz rules.

4. **Close the file and explain it out loud**, as if speaking to an interviewer.
   Then open the file and check what you missed. The parts you missed are what you need to learn.

---

## 2. Spaced Repetition Schedule

Tracked in [revision-log.md](revision-log.md).

| Grade | Meaning | Next review |
|---|---|---|
| 🔴 Weak | Wrong, or couldn't explain | Tomorrow (1 day) |
| 🟡 Partial | Mostly right, missed a key point | In 3 days |
| 🟢 Strong | Explanation, example, and trade-off | In 7 days |

When you answer **Strong again**, the interval roughly doubles: 7 → 14 → 30 → 60 days.
When you **struggle**, the interval gets shorter again.

---

## 3. Daily Routine (About 20 Minutes)

| Time | Activity | How |
|---|---|---|
| 5 min | Learn 1–2 new questions | Section 1 steps above |
| 15 min | Quiz on due questions | Say **"quiz me on Python"** to Claude |
| 2 min | Flashcard review | Flashcards section in [revision-log.md](revision-log.md) |

> A short daily session beats a long weekly one. 20 minutes a day is better than 3 hours on Sunday.

---

## 4. Habits That Make It Last

- **Say it out loud.** Interviews are spoken, so practice that way. Record yourself once a week.
- **Write code by hand** without autocomplete, for example the mutable default argument fix.
- **Connect questions to each other.** When you remember one, the others come with it:
  - Mutable vs immutable → shallow/deep copy → `is` vs `==`
  - Scope (LEGB) → closures → decorators
- **Mix topics** once there are more files (Python → ML → RAG in one session), because real interviews jump between topics.
- **Teach it.** If you can explain it simply to a beginner, you know it.

---

## 5. Weekly Checklist

- [ ] Quizzed on every question that was due this week
- [ ] Re-tried every Weak question at least twice
- [ ] Added new questions to a `*-qa.md` file and to the Review Tracker
- [ ] Did one mock interview out loud (5 random questions, no notes)
- [ ] Read the Session Summaries and checked whether the same gaps keep coming back

---

## 6. Before an Interview (Final 2–3 Days)

- Go through **only the Weak and Partial** questions in [revision-log.md](revision-log.md).
- Say the **one-line core idea** of each question out loud.
- Do one full mock interview with Claude: *"Give me a mock Python interview, 10 questions, mixed difficulty."*
- Sleep well. Memory consolidates during sleep.

---

## Files

| File | Purpose |
|---|---|
| [python-qa.md](python-qa.md) (and other `*-qa.md`) | Question bank with full answers |
| [revision-log.md](revision-log.md) | Grades, review dates, gaps, flashcards |
| [CLAUDE.md](CLAUDE.md) | Rules Claude follows for quizzes and tracking |

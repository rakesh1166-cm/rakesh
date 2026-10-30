# Interview Preparation

This folder holds my interview prep notes, one Q&A file per subject, and a revision log for spaced-repetition quizzes.

## Topics
Python, FastAPI, ML, DL, NLP, RAG, and Agentic AI.

## Files
- `how-to-revise.md`: my revision method and daily routine
- `revision-log.md`: quiz results and review schedule
- `python-qa.md`: Python
- `fastapi-qa.md`: FastAPI
- `ml-qa.md`: Machine Learning
- `dl-qa.md`: Deep Learning
- `nlp-qa.md`: Natural Language Processing
- `rag-qa.md`: Retrieval-Augmented Generation
- `agentic-ai-qa.md`: Agentic AI

The subject files (`*-qa.md`) are the question bank.

## Adding Q&A
- Add new Q&A to the matching subject file, under the right topic heading.
- Also add a row for each new question to the Review Tracker in `revision-log.md`, with Grade `Not reviewed` and Next Review set to today.
- Use the Q&A format below. Keep answers short and interview-ready, and add code where it helps.
- Mark difficulty as 🟢 Easy, 🟡 Medium, or 🔴 Hard.
- Don't duplicate questions. If one already exists, improve it instead.

### Q&A Format
```
### Q: <question>
**Difficulty:** 🟢 / 🟡 / 🔴
**Answer:** <concise answer>
**Example:** <code or example, optional>
**What the interviewer expects:** <key points, optional>
**Follow-ups:** <likely follow-up questions, optional>
```

## Quiz Sessions

### Before Each Session
- Read `revision-log.md` and the subject file being quizzed (for example `python-qa.md`).
- If a file is missing, ask me to provide it.
- Pick questions that are due for review first (Next Review is today or earlier).
- Include one question previously graded Strong to check retention.
- Then fill the session with questions that haven't been asked yet.

### Quiz Rules
1. Ask one question at a time.
2. Wait for my answer before revealing any explanation.
3. Grade my answer:
   - **Strong:** correct explanation, an example, and a trade-off.
   - **Partial:** mostly correct but missing an important point.
   - **Weak:** incorrect, or I couldn't explain it.
4. Explain what the interviewer expected (use the question's "What the interviewer expects" section when it has one).
5. For a Partial or Weak answer, give a hint and let me retry.
6. Then give a concise corrected answer.
7. Ask one practical follow-up question.

### Revision Tracking
For each question asked, record in `revision-log.md`:
- Topic and question
- Grade
- The specific mistake or missing point
- Last reviewed date
- Next review date

Initial review intervals:
- **Weak:** tomorrow (1 day)
- **Partial:** after 3 days
- **Strong:** after 7 days

If I answer a question correctly again, extend the interval (roughly double it). If I struggle, shorten it. Update the existing row for a question rather than adding a duplicate.

### End of Session
- Summarize my three main gaps.
- Create up to three short flashcards for those gaps.
- Update `revision-log.md`. If file editing isn't available, give me the exact rows to copy.

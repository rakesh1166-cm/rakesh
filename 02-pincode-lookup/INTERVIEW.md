# Interview Questions — Pincode Lookup API

Questions based on this project (`main.py`, `models.py`, `exceptions.py`, `data.py`).
Questions only — no answers. Work through them out loud and verify against the running code.

**How this file is organised.** Every section has two parts:

- **Concepts (general)** — theory questions an interviewer asks anyone, no matter what repo you built.
  Answer these from first principles.
- **In this code** — the same topic, pinned to specific lines of this project. Answer these with the
  file open.

**This is a trimmed file.** Every theory question here is either core or one that actually gets
asked; deeper trivia has been cut. If you want a study *plan* rather than a reference shelf,
start at **§15** — ten questions, then stop.

> These deliberately **do not repeat** the questions in `01-chaimenu/INTERVIEW.md`.
> That file covers the general ground — project layout, ASGI/WSGI, decorators, venvs,
> framework comparisons, `async` vs `def`, OpenAPI, scaling, HTTP methods.
> This file goes deep on what is **new in this codebase**: custom exception classes, custom
> exception handlers, manual JSON conversion, POST request bodies, path parameter vs
> request body, field validators, and the clean error/response pattern.
> Read the chai file first; treat this one as volume two.

---

## 1. Custom exception classes

### Concepts (general)

1. **What is the difference between `HTTPException` and a custom exception class?** Compare them on every point that matters: who supplies the status code, who builds the JSON, what the response body looks like, whether registration is required, what happens if you forget it, whether your business code ends up depending on the web framework, and how each appears in the API docs.
2. Draw Python's exception hierarchy from `BaseException` down. Which class should user-defined exceptions inherit from, and why not `BaseException`?
3. When should you define a custom exception at all, rather than reusing `ValueError`, `KeyError`, or `LookupError`? Give a rule you would actually apply.
4. What is exception chaining? Distinguish `__cause__` from `__context__`, and say what `raise ... from None` is for.
5. Why does the order of `except` clauses matter? Show a case where catching the parent first silently swallows the child.
6. What are EAFP and LBYL? Which style is `if code not in db: raise ...` — and which is more Pythonic here?
7. What goes in each of `try` / `except` / `else` / `finally`? Give a reason to use `else` at all.
8. Why is a bare `except:` considered a bug? What does it catch that `except Exception:` does not?
9. Compare returning a sentinel (`None`) with raising an exception for "not found". When is each correct?

### In this code

10. `PinCodeNotFoundError` and `InvalidPinCodeError` in `exceptions.py` both inherit from plain `Exception`, not from `HTTPException`. What does that choice buy you, and what does it cost?
11. Why would you define your own exception class at all, when `raise HTTPException(status_code=404, detail=...)` is one line and needs no new file?
12. `PinCodeNotFoundError.__init__` stores `self.pincode` and calls nothing else — not even `super().__init__()`. What are the practical consequences of skipping the `super()` call?
13. What does `str(PinCodeNotFoundError("110001"))` print as written? What would you change so a stack trace in the logs shows the pincode?
14. `InvalidPinCodeError` takes a second argument `reason` with a default of `"Invalid format"`. Why is that a parameter rather than hardcoded in the handler?
15. These two exception classes carry **data** (`pincode`, `reason`) but no HTTP concepts — no status code, no JSON. Which layer decides that "not found" means 404, and why is that separation valuable?
16. Would you put the status code on the exception class instead (`class PinCodeNotFoundError: status_code = 404`)? Argue both designs.
17. How would you introduce a shared base class — say `PincodeAPIError` — that both exceptions inherit from? What would you then be able to register in one line?
18. If you registered a handler for that base class *and* a handler for `PinCodeNotFoundError`, which one would FastAPI call for a `PinCodeNotFoundError`? How is that resolution done?
19. Where should these domain exceptions live if the lookup logic moved into a service layer that knew nothing about HTTP?
20. Why is raising a custom exception deep inside business logic often better than returning an error tuple like `(None, "not found")`?
21. Your custom exception escapes because you forgot to register a handler. What does the client see, and what status code?
22. How do these custom exceptions interact with `try/except` in a caller? Write the `except` clause that catches both.
23. Would you ever want `InvalidPinCodeError` to subclass `ValueError`? What would that change about how it can be caught?
24. Rewrite this project once with `HTTPException` and once with the custom classes it has. Put the two versions side by side and say which you would ship, given that the app is this small.

---

## 2. Exception handlers — registration and dispatch

### Concepts (general)

25. What is a **global exception handler**, and what problem does centralising error responses solve that per-route `try/except` does not?
26. Compare global error handling across frameworks: FastAPI's exception handlers, Flask's `@app.errorhandler`, Django's middleware, and Express's `(err, req, res, next)`. What is common to all four?
27. Where should an error be **logged** — at the `raise` site, in the handler, or both? What is double-logging, and why is it a real problem in production?
28. An unhandled exception reaches the framework. What should the client get, what should the logs get, and why must those two differ?
29. What is information disclosure via error messages? Name three things that must never appear in a 500 body.
30. How does a handler get chosen when several could match an exception? Explain dispatch by class hierarchy.
31. What is a middleware chain, and how is a middleware different from an exception handler in terms of *when* it runs?
32. How would you test error paths in general — not just happy paths? What coverage metric hides missing error tests?

### In this code

33. What exactly does `app.add_exception_handler(PinCodeNotFoundError, pincode_not_found_handler)` register, and where does FastAPI store it?
34. This project uses `app.add_exception_handler(...)` as a function call. The chai project's equivalent would use the `@app.exception_handler(...)` decorator. Are they the same mechanism? Show both spellings for `PinCodeNotFoundError`.
35. Why might you prefer the imperative `add_exception_handler` call here, given that the handlers live in a different module from `app`?
36. Trace the full path of `raise PinCodeNotFoundError("999999")` from line 31 of `main.py` to the JSON the client receives. Name every layer it passes through.
37. When the handler runs, has the route function already returned? What happened to the rest of `lookup_pincode` after the `raise`?
38. Does `response_model=LocationResponse` on line 25 apply to the error response produced by the handler? Explain why or why not.
39. Both handlers are declared `async def` while every route function in `main.py` is plain `def`. Is that inconsistency a bug? What does FastAPI require of an exception handler?
40. Every exception handler takes `(request, exc)`. Why is `request` passed in when neither handler here uses it? Name three things you could do with it.
41. Use `request` to add the failing path and the client's IP to the error body. Write the change.
42. How would you add a correlation/request id to every error response so a user can quote it in a support ticket?
43. What is the difference between an exception handler and middleware for producing error responses? When would you reach for each?
44. What is Starlette's `ExceptionMiddleware`, and where do your registered handlers actually live in the middleware stack?
45. If an exception is raised inside your *exception handler*, what does the client get?
46. How would you register a catch-all handler for `Exception` so no traceback ever leaks to the client? What is the risk of doing that carelessly?
47. Does a registered handler for `Exception` catch `PinCodeNotFoundError` too? What decides the precedence?
48. How would you override the built-in `RequestValidationError` handler so the bulk endpoint's 422 body matched the shape of your custom errors?
49. How do you keep the exception handlers testable in isolation, without spinning up the app?

---

## 3. Manual / explicit JSON conversion

### Concepts (general)

50. What is **serialization**? Define it, and define deserialization, marshalling, and encoding while you are at it.
51. List the data types JSON supports. Now list common Python types that have **no** JSON equivalent.
52. `datetime`, `Decimal`, `UUID`, `set`, `bytes`, `None`, `Enum` — for each, say what happens when you try to JSON-encode it and what the usual workaround is.
53. Why is `float` a bad choice for money in a JSON API? What do you send instead?
54. What is a **content type** / MIME type? What does `application/json` tell the client, and what does `charset` add?
55. What is content negotiation? Explain `Accept` on the request versus `Content-Type` on the response.
56. What is the difference between returning a **value** and returning a **response object** in any web framework? Which one lets you set headers and status?
57. Compare JSON with MessagePack, Protobuf, and XML on size, speed, human-readability, and schema support. When would you leave JSON?
58. What is JSON injection, and why is hand-building JSON with string formatting dangerous?

### In this code

59. Both handlers `return JSONResponse(status_code=..., content={...})`. Why can't they simply `return {"error": ...}` the way a route function does?
60. What does `JSONResponse` do to the `content` dict that a bare `return` of that same dict would also have done inside a route? Where does the difference actually lie?
61. Name every job `JSONResponse` performs: serialization, headers, status. What `Content-Type` does it set, and what encoding?
62. If you did `return {"error": "..."}` from `pincode_not_found_handler`, what would break — an exception, a 500, or a silently wrong response? Try it and report what you see.
63. Inside a route function, `return pincode_db[code]` returns a plain dict and the client still gets JSON. Explain who converts it there, and why that automatic step is unavailable in an exception handler.
64. What is `jsonable_encoder`, where does FastAPI call it for you, and why must you sometimes call it yourself before constructing a `JSONResponse`?
65. Your error body needs to include a `datetime` of when the failure happened. Show what goes wrong with a raw `JSONResponse` and how you fix it.
66. Why does the status code have to be passed explicitly as `status_code=404` here, whereas a route function that returns a dict gets 200 without saying so?
67. Building the response manually means `response_model` validation is skipped. Why is that a trap, and how would you keep the error shape from silently drifting?
68. Rewrite the two handlers so the error body is produced by a Pydantic `ErrorResponse` model instead of a hand-written dict literal. What do you gain in the OpenAPI docs?
69. If you build the body from a Pydantic model, how do you hand it to `JSONResponse`? Compare `.model_dump()`, `.model_dump_json()`, and `jsonable_encoder`.
70. Which one of those three is wrong to pass to `JSONResponse(content=...)`, and what does the client see if you use it?
71. What is `ORJSONResponse`, and would swapping it in change anything measurable for a bulk request of 20 pincodes?
72. How would you return the same error as XML or `text/plain` for a client that asked for it via the `Accept` header?
73. Compare `JSONResponse` with `PlainTextResponse` and the base `Response` class in terms of what you must supply yourself.
74. Add a `Retry-After` header to the not-found response. Where does it go in the `JSONResponse` call?
75. `content=` versus `body=` on a Starlette `Response` — what is the difference, and which one accepts a dict?

---

## 4. POST requests and JSON request bodies

### Concepts (general)

76. Draw the anatomy of an HTTP request: request line, headers, blank line, body. Which methods conventionally carry a body?
77. What is a **request body**, and what are the three common encodings for one? Compare `application/json`, `application/x-www-form-urlencoded`, and `multipart/form-data`.
78. Define **safe** and **idempotent** for HTTP methods. Put GET, POST, PUT, PATCH, DELETE in a table against both.
79. If a client times out and retries a POST, what can go wrong? What is an idempotency key and how does it work?
80. Why do query strings appear in access logs, browser history, and the `Referer` header while bodies do not? What does that mean for where you put sensitive values?
81. Why should a server cap request body size? What attack does an uncapped body invite, and at which layer do you enforce the cap?
82. What is a DTO (data transfer object)? How does it differ from a domain model, and why do APIs usually need both?
83. What is CSRF, and why is a JSON-only POST endpoint less exposed to it than a form-encoded one?
84. What status code should a POST return when it creates something, when it only computes something, and when it queues something?

### In this code

85. `bulk_lookup(request: BulkRequest)` — how does FastAPI decide that `request` comes from the **request body** rather than from the path or the query string? State the rule.
86. The parameter is *named* `request`, which is also the conventional name for the raw `Request` object. Does the name matter to FastAPI here? What decides the binding — the name or the annotation?
87. Why is shadowing the name `request` a bad idea in this handler? What would you have to do if you also needed the real `Request` object?
88. Walk the exact sequence for `POST /pincode/bulk`: raw bytes → parsed JSON → `BulkRequest` instance → your loop. Name what would fail at each stage and with which status code.
89. What happens if the client sends `Content-Type: text/plain` with a valid JSON body? Which status code, and produced by which layer?
90. What happens if the body is `{"pincode": ["110001"]}` — singular key instead of `pincodes`? Show the error body.
91. What if the body contains an extra key, `{"pincodes": [...], "country": "IN"}`? Is it rejected, ignored, or kept? How do you change that behaviour?
92. Why must a JSON body be sent with POST rather than GET here? Can GET carry a body at all, and should it?
93. How would you send this POST from PowerShell, from `curl.exe`, and from `/docs`? Give all three.
94. If `bulk_lookup` needed two body parameters — say `pincodes` and `options` — how would FastAPI shape the expected JSON? What is `Body(embed=True)` for?
95. How would you accept a bare JSON *list* (`["110001","400001"]`) as the whole body instead of an object with a `pincodes` key? What would you lose by doing that?
96. This POST is a read operation — nothing is created or mutated. Is POST the right method? Argue for POST and argue for `GET /pincode?codes=110001,400001`.
97. Is `POST /pincode/bulk` idempotent as implemented? Does the answer matter for a client that retries on timeout?
98. What status code does a successful `POST /pincode/bulk` return, and is that the right one given nothing was created?
99. How large can this request body get before you should worry? How would you cap the body size at the server or proxy?

---

## 5. Path parameter vs request body

### Concepts (general)

100. Break a URL into its parts: scheme, host, port, path, query, fragment. Which parts reach the server?
101. Name **all five** places a web framework can pull input from — path, query, header, cookie, body — and give a rule for choosing between them.
102. State the general difference between a **path parameter** and a **request body**: visibility, size limit, type richness, cacheability, and idempotency.
103. In REST, what is a path segment supposed to *mean*? Why is `/pincode/110001` more RESTful than `/getPincode?code=110001`?
104. Which parts of a request can a CDN or reverse proxy cache on? Why does that alone often decide where a parameter goes?
105. What is path traversal, and why is any path parameter that reaches a filesystem dangerous?
106. Sensitive values — a token, a national ID, a password. Rank path, query, header, and body by exposure, and justify the order.

### In this code

107. State the difference between a path parameter and a request body, using `GET /pincode/{code}` and `POST /pincode/bulk` from this project as the two examples.
108. For each of these, say whether it belongs in the path, the query string, or the body, and defend the choice: a single pincode; a list of 20 pincodes; an API key; a `?include_district=false` toggle; a 2 MB CSV of pincodes.
109. `code: str` on line 26 arrives as a path parameter and is *always* a string. Why can a path parameter never be a `dict`, while a body can?
110. What type conversion does FastAPI apply to a path parameter, and what happens to leading zeros if you had declared `code: int` instead? Why is `str` the right call for Indian pincodes?
111. Path parameters are visible in the URL, in browser history, in proxy logs, and in the Referer header. Which of this project's two endpoints leaks the lookup value that way?
112. How does the OpenAPI schema describe these two differently — where does the path parameter appear versus where does the body schema appear?
113. `GET /pincode/{code}` needs no `Content-Type`; `POST /pincode/bulk` does. Explain why, in terms of what each request actually carries.
114. Rewrite the single lookup to take its pincode in a JSON body instead of the path. What would you lose — think caching, bookmarking, and the browser address bar?
115. `PincodeRequest` in `models.py` was clearly written for exactly that body-based single lookup, yet no route uses it. Wire it up as `POST /pincode/lookup` and compare the resulting error response for a 5-digit input against what `GET /pincode/11000` returns today.
116. At how many pincodes would a query-string version of the bulk endpoint break, and what would the failure look like to the client?

---

## 6. Validation and Pydantic validators

### Concepts (general)

117. What is input validation, and why is "the client already validated it" never an acceptable reason to skip it on the server?
118. Distinguish **syntactic** validation from **semantic** validation. Which one is "6 digits" and which is "this pincode exists"?
119. Where does validation belong in a layered application — the edge, the service, the database, or all three? Defend your answer.
120. What is the difference between validation, **coercion**, and **sanitization**? Give an example of each on a pincode string.
121. Fail-fast versus collect-all-errors: which is right for a single field, and which for a 20-item batch? What does each do to the user experience?
122. What is a schema, and what does schema-driven validation give you that hand-written `if` statements do not? Name at least four things.
123. Why is **400** debated against **422** for a validation failure? What does each status code actually mean, and who is right?
124. What is a regular expression's role in validation, and what is ReDoS? How would a careless pincode pattern become a denial of service?
125. What is the difference between a **required** field, an **optional** field, and a field with a **default**? How does each appear in a schema?

### In this code

126. `@field_validator("pincodes")` in `BulkRequest` — when does it run relative to your handler body? Prove it with a request that violates it.
127. What does the `@classmethod` decorator under `@field_validator` do, and what breaks if you omit it in Pydantic v2?
128. The validator raises `ValueError("At least one pincode is required")`, yet the client sees HTTP **422** with a `detail` array — not a 500 and not your bare string. Explain the whole transformation.
129. Why `ValueError` and not `HTTPException` inside a Pydantic validator? What happens if you raise `HTTPException` there instead?
130. `validate_pincodes` enforces three separate rules — non-empty, max 20, each 6 digits. Should those be one validator or three? What does the client's error body look like in each design?
131. The validator loops and raises on the first bad code. How would you instead report *every* invalid pincode in one response? Why is that better UX for a bulk endpoint?
132. Which of these rules would be better expressed as field constraints — `Field(min_length=1, max_length=20)` on the list, and `pattern=r"^\d{6}$"` on the items? What do you gain in `/openapi.json` by doing so?
133. Write `pincodes: list[Annotated[str, Field(pattern=r"^\d{6}$")]]` and describe how the resulting 422 body differs from the current one, especially the `loc` field.
134. What is the difference between `@field_validator` and `@model_validator`? Which would you need to enforce "either `pincodes` or `city` must be given, but not both"?
135. What do `mode="before"` and `mode="after"` mean on a validator? Which mode would let you strip whitespace from `" 110001 "` before the digit check?
136. Should this API accept `" 110001 "` or `"110 001"` and normalise them? Where exactly would that normalisation go?
137. `PincodeRequest.validate_pincode` and `BulkRequest.validate_pincodes` implement the same 6-digit rule twice. Factor the rule into one reusable place. Name at least two mechanisms Pydantic gives you for that.
138. The same rule appears a **third** time as a plain `if` on line 27 of `main.py`. Is three copies of one business rule acceptable? What is the failure mode when someone changes only one of them?
139. What is `Annotated` in Pydantic v2, and why is it the modern way to attach constraints?
140. How do you give the bulk endpoint an example request body so `/docs` pre-fills it? Show `model_config` with `json_schema_extra`.
141. `BulkResponse.status: str = "success"` has a default. Would `Literal["success"]` be better? What does that change in the generated schema?

---

## 7. Two validation layers — model versus handler

### Concepts (general)

142. What is a **single source of truth** for a business rule, and how do you recognise when you have lost it?
143. Is DRY always right? Describe a case where duplicating a rule deliberately is the better engineering call.
144. What is a *guard clause*, and why do they usually belong at the top of a function?
145. Framework-generated error bodies versus hand-rolled ones: which should a public API commit to in its contract, and why?
146. What is contract-first (schema-first) API design, and how does it change where validation lives?

### In this code

147. `lookup_pincode` validates its input with a hand-written `if` (line 27) and raises a custom exception; `bulk_lookup` validates via Pydantic and produces a 422 automatically. Which endpoint's approach do you prefer, and why?
148. As a direct consequence, a malformed pincode returns a different status code and a different JSON shape depending on which endpoint you hit. Demonstrate this with two `curl` commands and describe the client-side pain.
149. Could the single lookup validate through Pydantic too? Show how, using `Path(..., pattern=r"^\d{6}$")` — and say which status code you would then get.
150. What is the trade-off between validating in the model (422, framework-shaped body) and validating in the handler (your status code, your body)? When is each right?
151. FastAPI's 422 body is a list under `detail` with `type`/`loc`/`msg`/`input`. Is that shape good for a mobile client to parse? How would you flatten it?
152. Where does the `422` status code come from, and why did FastAPI historically choose 422 over 400 for validation failures?
153. If you standardised everything on your custom error envelope, which handler would you have to override, and what would the bulk endpoint's error body look like afterwards?
154. Count the copies of the "6 digits" rule in this repo. Write the one-line change that would make a future rule change (say, allowing a 3-digit prefix search) touch exactly one place.

---

## 8. Clean error and response patterns

### Concepts (general)

155. What belongs in a well-designed API error response? List the fields and justify each.
156. Why does an error body need a **machine-readable code** as well as a human-readable message? Who consumes each?
157. Why must an error never be returned as `200 OK` with `{"success": false}`? Name what breaks in clients, proxies, caches, and monitoring.
158. Distinguish the **4xx** and **5xx** families. Whose fault is each, and which should trigger a pager?
159. Give the precise meaning of 400, 401, 403, 404, 409, 410, 422, 429, 500, 502, 503, and 504. Which of them would a lookup API realistically emit?
160. When is 404 wrong for "no data"? Compare "this endpoint does not exist" with "this endpoint exists and found nothing".
161. What is RFC 9457 (formerly 7807) "Problem Details for HTTP APIs"? List its standard fields.
162. How do you keep error messages useful to developers without leaking internals to attackers? Give the rule.
163. What should a client do differently for a retryable error versus a permanent one, and how does your response tell it which it has?

### In this code

164. Describe the error envelope this project settled on — `error`, `message`, `pincode`. What is each field *for*, and which of them is machine-readable versus human-readable?
165. Why include a stable machine-readable `error` code like `"pincode_not_found"` when `message` already says the same thing in English?
166. Why does the error body echo the offending `pincode` back? What does that save the client from doing?
167. Compare this envelope with FastAPI's default `{"detail": "..."}`. What does the custom shape give a front-end that `detail` does not?
168. Should the *success* responses share an envelope with the errors? `LocationResponse` is a bare object while `BulkResponse` has a `status` field — is that inconsistency defensible?
169. `GET /pincode/110001` returns a flat object; `POST /pincode/bulk` returns `{"status": "success", ...}`. Redesign both so every response in the API has the same top-level shape. What do you lose?
170. Map this project's error body onto RFC 9457's fields, one by one. Which of its fields do you have no equivalent for?
171. What HTTP status code would you use for a pincode that is well-formed but simply absent from the dataset — 404 or 200 with a null? Argue both.
172. The bulk endpoint returns 200 even when *every* requested pincode is missing. Is that right? What would 404 there break for the client?
173. Should `found` and `not_found` both be in the response when the client can count `results` and `missing` itself? What is the argument for redundancy in an API payload?
174. Design the error contract for a version 2 of this API: list the error codes you would publish, with their status codes.
175. How would you make sure the error `message` never leaks internal detail — file paths, SQL, stack frames — once `data.py` is replaced by a real database?
176. How do you document these error responses in `/docs` so consumers see them without reading the source? Show the `responses={...}` argument on the decorator.
177. Should error `message` strings be localised? Where would you put the translation, and what does that imply about the `error` code field?

---

## 9. The data layer

### Concepts (general)

178. Compare a hash map with a list for lookup by key: average and worst-case complexity for each, and what makes the average case hold.
179. How does a Python `dict` work under the hood? What must a key support, and what happens on a hash collision?
180. What is a **repository pattern**, and what does it decouple?
181. What is dependency injection, and what does it make possible in testing that a module-level global does not?
182. Module-level mutable state in a web app — name three distinct failure modes it causes under concurrency and across workers.
183. What is the N+1 query problem? Show the shape of the bad code and the shape of the fix.
184. Where can a cache live — client, CDN, application, database? What does each layer buy you, and what is the invalidation cost?

### In this code

185. `pincode_db` is a `dict` keyed by pincode string, whereas the chai project used a list. What is the lookup complexity of `code in pincode_db` versus scanning a list, and why does the dict fit this problem?
186. Every value in `data.py` repeats its own key inside the dict (`"110001": {"pincode": "110001", ...}`). Is that duplication necessary? What breaks in `LocationResponse` if you remove the inner `pincode` field?
187. `return pincode_db[code]` hands the caller a reference to the actual stored dict. What could a future mutation bug do here, and how does `response_model` accidentally protect you?
188. Line 30 does `if code not in pincode_db` and line 32 does `pincode_db[code]` — two lookups. Rewrite it with a single `.get()`. Does it matter at this scale?
189. Real India has ~19,000 pincodes. At what point does an in-memory dict stop being the right answer, and what replaces it first?
190. How would you load this data from a CSV at startup instead of hardcoding it? Which FastAPI lifecycle hook would you use, and what would you do if the file were missing?
191. If the pincode data lived in Postgres, what would the single lookup and the bulk lookup each become? Why is the bulk case the interesting one?
192. How would a naive port of `bulk_lookup` to a database walk straight into the N+1 problem, and what single query fixes it?
193. Both route functions reach directly into the module-level `pincode_db`. Sketch a `PincodeRepository` and show how `Depends` would inject it.
194. How would you keep this dataset fresh — India Post publishes updates — without a deploy?

---

## 10. Bulk / batch endpoint design

### Concepts (general)

195. Why do batch endpoints exist at all? What cost are they amortising, and when is the saving real?
196. What is **partial success**, and why does HTTP's single status code make it awkward to express?
197. Design the three common batch response shapes — parallel array, keyed map, per-item status list — and say when each is right.
198. Should a batch operation be atomic (all or nothing) or best-effort? How does the answer differ for reads versus writes?
199. Why cap the number of items in a batch? What are you defending against, and how do you pick the number?
200. Compare a batch endpoint with pagination, with a streaming response, and with many parallel single requests under HTTP/2. When does the batch endpoint stop being worth it?

### In this code

201. Why does `bulk_lookup` put missing pincodes in a `missing` list instead of raising `PinCodeNotFoundError` like the single lookup does? State the design principle.
202. The single lookup raises on a missing code; the bulk lookup does not. Is that a contradiction or correct API design? Defend it.
203. `results` preserves input order but drops the missing entries, so the client cannot line results up with its input positions. How would you fix that? Compare returning a keyed map versus a per-item status list.
204. Redesign the response as `{"110001": {...}, "999999": null}`. What do you gain, and what do you lose for a strongly-typed client?
205. Why cap the request at 20 pincodes? What attack or accident is that limit defending against?
206. Is 20 the right number? How would you decide it empirically?
207. What should happen if a client sends the same pincode twice in one bulk request? What does the code do today?
208. `results` is built from raw dicts but `BulkResponse.results` is typed `list[LocationResponse]`. Where does the conversion happen, and what would a malformed entry in `data.py` cause — a 422 or a 500?
209. `BulkResponse` is constructed explicitly at line 46 while `lookup_pincode` returns a bare dict. Both endpoints declare a `response_model`. Which style is better, and does the client see any difference?
210. The bulk loop is O(n) over the request with O(1) dict hits. Where would the real cost be once this is database-backed, and what single query would you write?
211. How would you add partial-failure reporting — say the datastore is up but three lookups timed out? Which status code, and what body?
212. Rate-limiting: should the bulk endpoint count as one request or as twenty? How would you implement that?

---

## 11. Routing

### Concepts (general)

213. How does a router match an incoming request? Describe the algorithm and what it matches on besides the path.
214. What is the difference between a static path segment and a dynamic one, and which should win when both could match?
215. Does route declaration order matter? Explain for a first-match router and for a specificity-ranked router.
216. Compare API versioning strategies: URL path, header, query parameter, and content negotiation. What does each cost?
217. What makes a URL design good? Give five rules, and a REST-y naming convention for a resource that supports batch operations.

### In this code

218. `POST /pincode/bulk` and `GET /pincode/{code}` share a URL prefix. Why do they not collide, and what exactly does FastAPI match on?
219. `GET http://127.0.0.1:8000/pincode/bulk` returns `{"error":"pincode_not_found", ..., "pincode":"bulk"}`. Trace why. Is that a bug, and what does it reveal about route matching?
220. If you added `GET /pincode/bulk`, would the declaration order relative to `GET /pincode/{code}` matter? Which one wins, and why?
221. How would you make the literal path segment `bulk` unreachable as a pincode value, at the routing layer rather than inside the handler?
222. What is a path converter, and how would `/pincode/{code:path}` change the matching?
223. How would you version these routes as `/v1/pincode/...` without touching either handler function?
224. Both endpoints hang off `/pincode`. Show the `APIRouter` with `prefix="/pincode"` and `tags=["pincode"]` that would group them, and what the two decorators become.

---

## 12. Code review

### Concepts (general)

225. What do you look for first in a code review? Give your ordered checklist.
226. What is a code smell? Name five that appear in small web projects specifically.
227. What is dead code, and why is an unused import more than a cosmetic problem?
228. Which class of bug does a **linter** catch, which does a **type checker** catch, and which does only a **test** catch? Place a wrong-handler-registration bug in that taxonomy.
229. What makes a comment worth writing? Give the test you apply, and name the kinds of comment that are always noise.
230. Why pin dependency versions? Compare a loose `requirements.txt`, a pinned one, and a lockfile.

### In this code

231. `main.py` line 17 registers `pincode_not_found_handler` for `InvalidPinCodeError`. What is the user-visible consequence? Give the exact request and the exact wrong response.
232. Because of that bug, `invalid_pincode_handler` is imported on line 6 and never used. Would any linter or test have caught this? Which one, and how?
233. Write the test that would have failed on this bug. Which assertion catches it — the status code, the `error` field, or both?
234. The `reason` string `"Must be exactly 6 digit"` is passed at line 28 and never reaches the client. Where does it die?
235. `invalid_pincode_handler` builds `f"... is invalid: {exc.reason} "` — note the trailing space before the closing quote. Why do stray spaces in API strings matter more than they look?
236. `exceptions.py` line 15 says `# Cusom handler`. Beyond the typo, is the comment earning its place?
237. `main.py` line 15 says `# register your custom exception handler` (singular) above two registrations. Rewrite both comments to say something the code does not already say.
238. `code:str` on line 26 is missing a space after the colon, and `data.py`/`models.py` mix conventions. Which tool would normalise all of this, and how would you enforce it on every commit?
239. `PincodeRequest` is defined in `models.py` and imported nowhere. Delete it or use it? Justify.
240. There is no `.gitignore`, and `.venv/` plus `__pycache__/` now sit in the project folder. Write the `.gitignore` this project needs.
241. A `.DS_Store` file is present in a Windows project folder. Where did it come from, and what does its presence tell you about how this repo has been handled?
242. `requirements.txt` pins nothing — just `fastapi` and `uvicorn[standard]`. What breaks the day FastAPI releases 1.0?
243. There are no tests at all. Given the exception-handler bug, what is the single most valuable test file to write first?
244. `lookup_pincode` and `bulk_lookup` are both plain `def` while the exception handlers are `async def`. Which convention would you standardise on for this app, and why?
245. Neither endpoint has `summary`, `tags`, or documented error responses. What would you add to make `/docs` genuinely useful to a front-end developer?
246. Nothing here logs anything. What are the three log lines you would add first, and at which levels?

---

## 13. Hands-on exercises

247. Fix the exception-handler registration bug and verify `GET /pincode/11000` returns 400 with `error: "invalid_pincode"`.
248. Add `GET /pincode/{code}/nearby` returning other pincodes in the same district.
249. Add `GET /city/{name}` — reverse lookup, returning every pincode for a city name, case-insensitively.
250. Add `?fields=city,state` to the single lookup so the client can request a subset. Which FastAPI feature handles that cleanly?
251. Add a `POST /pincode/validate` endpoint that uses the currently-unused `PincodeRequest` model and returns only `{"valid": true|false}` — no lookup.
252. Add a `state` filter to the bulk endpoint so only pincodes in a given state are returned.
253. Introduce a shared `PincodeAPIError` base class and collapse the two `add_exception_handler` calls into one.
254. Replace the hand-written error dicts with a Pydantic `ErrorResponse` model and document it in `/docs` via `responses={404: {"model": ErrorResponse}}`.
255. Override FastAPI's `RequestValidationError` handler so the bulk endpoint's 422 uses your `error`/`message`/`pincode` envelope.
256. Move the 6-digit rule into one reusable validator used by `PincodeRequest`, `BulkRequest`, and the path parameter. Delete the other two copies.
257. Make the bulk endpoint report *all* invalid pincodes at once instead of failing on the first.
258. Change the bulk response to preserve input order with a per-item `found` flag, and update `README.md` to match.
259. Add a middleware that logs method, path, status code, and duration, then use it to confirm which handler produced a given error.
260. Write `tests/test_pincode.py` with `TestClient`, covering: a hit, a miss, a malformed code, an empty bulk list, a 21-item bulk list, and a mixed bulk request.
261. Add `X-Request-ID` handling: read it if present, generate one if not, echo it on every response including errors.
262. Load the pincode data from a CSV at startup with a lifespan handler, and fail fast with a clear message if the file is missing.
263. Rewrite the whole error layer using only `HTTPException`, then diff it against the current design and write three sentences on which you would ship.

---

## 14. Trace it end to end

### Concepts (general)

264. Describe the life of an HTTP request through any web application, from socket accept to the last byte written. Name every stage.
265. At how many distinct points in that lifecycle can a status code be decided? Who owns each point?
266. Which stages run *before* your handler, and which run *after* it returns? Which of them can still change the response?
267. Where in the lifecycle does an exception unwind to? What is a stack unwind, and what does the framework do at the top of it?

### In this code

268. Draw the full path of `GET /pincode/110001`: uvicorn → Starlette → routing → `lookup_pincode` → `response_model` → JSON. Mark where the dict from `data.py` becomes bytes.
269. Draw `GET /pincode/999999` on the same diagram. Mark the exact point where control leaves the handler and where the `JSONResponse` is created.
270. Draw `GET /pincode/11000` twice — once as the code behaves today, once as it was intended to behave — and label the one line of `main.py` that separates the two.
271. Draw `POST /pincode/bulk` with an invalid body. Mark where the request dies and note that your handler never runs.
272. On all four diagrams, mark every place a status code is decided. How many distinct places are there, and who owns each?
273. Which of those four responses passed through `response_model` validation, and which bypassed it entirely?

---

## 15. The ten that actually get asked

283 questions is a study bank, not a revision list. If you have one evening before an
interview, prepare **these ten**. They are the generic, framework-agnostic ones that come
up again and again for any Python/backend role — and between them they cover most of what
this project demonstrates. Each links to the deeper questions in this file.

274. **What is the difference between `HTTPException` and a custom exception class?**
     Who sets the status code, who builds the JSON, whether you must register a handler, what happens if you forget, and whether your business logic ends up importing the web framework.
     → §1 Q1, Q10–11, Q24

275. **Where can input come from in an HTTP request, and how do you choose?**
     Path, query, header, cookie, body — with the reasoning: size, visibility in logs, cacheability, and whether it identifies the resource or filters it.
     → §5 Q100–102, Q107–108

276. **What are the HTTP status codes, and what does each family mean?**
     4xx is the caller's fault, 5xx is yours. Be exact on 400, 401 vs 403, 404, 409, 422, 429, 500 vs 502 vs 503 — and be ready for "400 or 422 for a validation error?"
     → §8 Q158–159, §6 Q123, §7 Q152

277. **What happens when your code raises an exception that nothing catches?**
     The unwind, what the client gets, what the logs get, and why those two must differ. Then: what a global exception handler is for.
     → §2 Q25, Q28–29, Q36

278. **What is serialization, and how does a Python object become JSON?**
     Which types JSON has, which Python types have no equivalent, and what you do about `datetime`, `Decimal`, and `UUID`. Almost always followed by "what `Content-Type` do you set?"
     → §3 Q50–52, Q59, Q64

279. **Safe versus idempotent — build the table for GET, POST, PUT, PATCH, DELETE.**
     Then the real question behind it: why is idempotency what makes a client retry safe, and what is an idempotency key?
     → §4 Q78–79, Q97

280. **What does a validation library like Pydantic give you that hand-written `if` checks do not?**
     Schema-driven validation, coercion, the generated API schema, and one consistent error shape. Follow-up: where should validation live in a layered app?
     → §6 Q117–119, Q122, §7 Q147, Q150

281. **What does a good API error response look like?**
     A machine-readable code plus a human-readable message, the right status, no internal detail — and why returning `200 OK` with `{"success": false}` is always wrong.
     → §8 Q155–157, Q162, Q164–165

282. **`async def` versus `def` — concurrency versus parallelism.**
     The GIL, I/O-bound versus CPU-bound, what blocking the event loop does. The single most-asked Python backend question, and this project's handlers are all sync.
     → §2 Q39; full treatment in `01-chaimenu/INTERVIEW.md` §18

283. **Why is a `dict` lookup O(1) and a list scan O(n)?**
     How hashing works, what a collision does, and why average case is not worst case. The classic warm-up, and `pincode_db` is a live example.
     → §9 Q178–179, Q185

**How to use them.** Answer each out loud in about two minutes, then open the linked
section and check what you missed. If an answer needs code, write it against this repo —
an answer grounded in something you actually built beats a memorised definition every time.

---

## References

- Python exceptions and the built-in hierarchy: <https://docs.python.org/3/library/exceptions.html>
- Starlette exceptions and handlers: <https://starlette.dev/exceptions/>
- FastAPI — handling errors: <https://fastapi.tiangolo.com/tutorial/handling-errors/>
- FastAPI — request body: <https://fastapi.tiangolo.com/tutorial/body/>
- FastAPI — path parameters and numeric validations: <https://fastapi.tiangolo.com/tutorial/path-params-numeric-validations/>
- FastAPI — custom response classes and `jsonable_encoder`: <https://fastapi.tiangolo.com/advanced/custom-response/>
- Pydantic validators: <https://pydantic.dev/docs/concepts/validators/>
- JSON data interchange format (RFC 8259): <https://www.rfc-editor.org/rfc/rfc8259.html>
- HTTP semantics — methods, status codes, headers (RFC 9110): <https://www.rfc-editor.org/rfc/rfc9110.html>
- RFC 9457 — Problem Details for HTTP APIs: <https://www.rfc-editor.org/rfc/rfc9457.html>
- URI generic syntax (RFC 3986): <https://www.rfc-editor.org/rfc/rfc3986.html>
- India Post PIN code data: <https://www.indiapost.gov.in/>

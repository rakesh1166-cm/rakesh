# Interview Questions — Chai Point Menu API

Questions based on this project (`main.py`, `models.py`, `data.py`, `requirements.txt`).
Questions only — no answers. Work through them out loud and verify against the running code.

**How this file is organised.** Every section has two parts:

- **Concepts (general)** — theory an interviewer asks anyone, whatever they built.
  Answer from first principles, no repo needed.
- **In this code** (or **Core questions**, where the topic is theory rather than this app) —
  the same subject pinned to this project. Answer these with the file open.

Section 10 is the exception: it is a list of exercises, so it has no theory half.

**This is a trimmed file.** Every question here is either core theory or one that actually gets
asked. Deep-systems trivia that no FastAPI interview reaches for has been removed. If you want
a study *plan* rather than a reference shelf, start at **§24** — ten questions, then stop.

> Volume two is `02-pincode-lookup/INTERVIEW.md`, which does not repeat anything here.
> It goes deep on custom exception classes, custom exception handlers, manual JSON
> conversion, POST request bodies, path parameter vs request body, field validators,
> and clean error/response design.

---

## 1. Project structure

### Concepts (general)

1. What is separation of concerns, and how would you explain it to someone who has only ever written one-file scripts?
2. Define cohesion and coupling. What does high cohesion with low coupling look like in a small web app?
3. What is the difference between a module and a package in Python? What does `__init__.py` still do in modern Python, and what no longer needs it?
4. How does Python resolve `import x`? Explain the role of `sys.path` and of the directory you launched from.
5. What is a circular import, why do web projects hit them so often, and name two ways to break one.
6. Describe layered architecture — presentation, service, repository. What belongs in each layer, and which layer is allowed to know about HTTP?

### In this code

7. Explain this project's folder structure and the purpose of each `.py` file.
8. Why is `data.py` kept separate from `main.py`, and why are the Pydantic models in `models.py` rather than at the top of `main.py`?
9. If this project grew to 50 endpoints, how would you restructure it? What is `APIRouter`, and at what point does it become necessary?
10. This project has no `__init__.py` and no package folder. Why does `from models import MenuItem` still work?
11. Why does `requirements.txt` list only two packages when `pip freeze` shows eighteen?

---

## 2. FastAPI fundamentals

### Concepts (general)

12. Distinguish a web server, an application server, and a web framework. Which of nginx, uvicorn, and FastAPI is which?
13. What happens at **import time** versus at **request time** in a web application? Why does that distinction decide where expensive setup goes?
14. HTTP is stateless. What does that actually mean, and where does state have to live instead?
15. Compare a process, a thread, and a coroutine as units of concurrency — memory cost, isolation, and switching cost.
16. What is a worker process, and how does running several of them change the meaning of a module-level variable?

### In this code

17. What does the line `app = FastAPI(...)` actually create?
18. In `uvicorn main:app --reload`, explain each part: `main`, the colon, `app`, and `--reload`. Should `--reload` be used in production?
19. Why does FastAPI need an ASGI server like uvicorn instead of running on its own?
20. Where do `/docs`, `/redoc`, and `/openapi.json` come from? Did anyone write them?
21. None of the route handlers in this project are `async def`. Is that a problem? What does FastAPI do with a plain `def` handler?

---

## 3. Routing, path and query parameters

### Concepts (general)

22. Break a URL into scheme, host, port, path, query, and fragment. Which parts reach the server?
23. What does a path segment *mean* in REST, as opposed to a query parameter? Give the semantic rule, not the syntax.
24. How do you represent a list in a query string? Name two conventions and a downside of each.
25. Compare offset/limit pagination with cursor pagination. At what point does offset pagination break down?
26. When should a filtered collection return 404 versus an empty list? State a rule you would apply API-wide.

### In this code

27. Explain the difference between a **path parameter** and a **query parameter**, using `/menu/{item_id}` and `/menu?category=chai`.
28. How does FastAPI know `item_id` comes from the path while `category` comes from the query string?
29. What does `Query(None, description="...")` do? What does the `None` represent?
30. What happens when you request `/menu/abc`? Which status code, which layer produced it, and why is it not 404 or 500?
31. What is the difference between 404, 422, and 500 in the context of this API?
32. How would you add pagination (`?skip=0&limit=5`) to the `/menu` endpoint?

---

## 4. Pydantic and validation

### Concepts (general)

33. What is a schema? What is JSON Schema, and what can consume one?
34. What is type coercion, and when is silent coercion dangerous in an API?
35. Why validate **responses** at all when you control the data being returned?
36. What is over-posting / mass assignment, and how does a strict model prevent it?
37. How do you evolve a schema without breaking existing clients? List what counts as a breaking change.

### In this code

38. How is Pydantic validation used in this project? Name every place it runs.
39. What does `response_model=MenuResponse` on the decorator actually do to the returned value?
40. `get_item` returns a plain dict but declares `response_model=MenuItem`. Trace what happens to that dict before it reaches the client.
41. If you added a `secret_cost` key to every dict in `data.py`, would it appear in the response? What is the security benefit here?
42. What is the difference between **request** validation and **response** validation? Which one does this read-only project rely on?
43. `price: float` — what happens if you pass the string `"30.0"`? What about `"thirty"`?
44. How would you enforce that `price` must be greater than zero, and restrict `category` to only `chai`, `snacks`, and `combos`?
45. What changed between Pydantic v1 and v2 (`.dict()` vs `.model_dump()`), and what is `pydantic_core`?

---

## 5. Error handling

### Concepts (general)

46. What does a framework do with an exception you never catch? Trace it from the `raise` to the bytes the client receives.
47. Distinguish an **expected** error from an **unexpected** one. Should they be handled by the same mechanism?
48. When is 204, when is 200-with-an-empty-body, and when is 404 the right answer for 'nothing here'?
49. What makes error text good for an end user versus good for a developer? Can one string be both?

### In this code

50. Why use `HTTPException` instead of `return {"error": "not found"}`?
51. What does `raise HTTPException(status_code=404, detail="...")` produce on the wire — exact JSON shape and status code?
52. Why `raise` rather than `return`? What happens to the rest of the function body?
53. In `get_menu`, an unknown category raises 404. Is that right for an empty filter result, or would 200 with an empty list be better? Argue both sides.
54. What is an exception handler? How would you register one with `@app.exception_handler` and change the error shape across the whole app?
55. What is `RequestValidationError`, and which of this project's responses does it produce?

---

## 6. Data layer and this project's limitations

### Concepts (general)

56. Distinguish reference data, transactional data, and derived data. Which one is a restaurant menu?
57. What is an ORM? Compare an ORM, a query builder, and raw SQL on control, safety, and speed of development.
58. What is a database migration, and why can you not simply edit the table by hand?
59. What is a data access layer, and what should it never leak upward to its callers?

### In this code

60. `menu_items` is a module-level list. What happens to runtime edits when the server restarts, and what are the other failure modes of storing changing data this way?
61. This API is read-only. What would you need to add to support `POST /menu`?
62. `get_item` loops through the whole list to find one id. What is the time complexity, and how would you improve it?
63. How would you replace `data.py` with a real database while leaving `main.py` mostly unchanged? How would `Depends` help?
64. Item 6 (Vada Pav) has `available: False` but is still returned. Bug or deliberate? Justify either answer.

---

## 7. Testing

### Concepts (general)

65. Explain the test pyramid. What goes in each layer, and what is the cost/confidence trade-off?
66. What is the arrange-act-assert pattern, and why does it make tests readable?
67. Define mock, stub, fake, and spy. Give one example of each.
68. What is code coverage measuring, and why is 100% not the goal? What does it fail to measure entirely?
69. What is a flaky test? Name the most common causes and how you would fix each.

### In this code

70. How would you write tests for these endpoints? Which library and which client?
71. What is `TestClient`, and does using it require the server to be running?
72. Write the assertions you would make for `GET /menu?category=chai`, and for `/menu/99` returning 404 with the right `detail`.
73. This project has no tests and no test dependency in `requirements.txt`. What would you add, and why should it not go in the main requirements file?

---

## 8. Production and deployment

### Concepts (general)

74. What is the 12-factor app? Name the factors that matter most for a small API like this one.
75. Why must configuration come from the environment? What belongs in env vars, what in code, and what in a secret store?
76. What is structured logging, and why is it better than `print` once you have more than one machine?
77. Distinguish liveness, readiness, and startup probes. What should each one actually check?
78. What is a reverse proxy for? Name five jobs it does that your application should not.
79. What is CORS actually protecting, who enforces it, and why is it not a server-side security control?

### In this code

80. What changes would you make before deploying this to production? List at least five.
81. Why is `--reload` unsuitable for production? What is Gunicorn with uvicorn workers, and why is that combination common?
82. How would you configure CORS so a browser front-end on another domain could call this API?
83. `/docs` is publicly accessible. Should it be in production? How would you disable or protect it?
84. How would you add caching, given that this menu data almost never changes?
85. What would a `Dockerfile` for this project look like, and which command would be the `CMD`?

---

## 9. Code review — find the issues

### Concepts (general)

86. What makes a good pull request? Talk about size, description, and commit hygiene.
87. What is the difference between a nit and a blocker, and should you label them in review?
88. Which review checks should be automated rather than done by a human? Name five.

### In this code

89. The `category` query parameter is documented as `"chai, snack or combo"`, but `data.py` stores `snacks` and `combos`. What is the user-visible consequence, and how would you fix it?
90. Line 16 of `main.py` has the comment `# /menu?cateory=chai`. What is wrong with it?
91. `models.py` declares `status: str = "success"` but `get_item` returns a bare `MenuItem` with no `status` field. Is the response shape consistent across endpoints? Should it be?
92. There is no `.gitignore`, yet `.venv/` exists in the project folder and a `.DS_Store` sits beside it. What are the risks?

---

## 10. Hands-on exercises

93. Add a `GET /categories` endpoint returning the distinct category names with a count for each.
94. Add `?min_price=` and `?max_price=` filters to `/menu`.
95. Convert the category filter so an invalid value returns 422 at validation time instead of 404 inside the handler.
96. Split the routes out of `main.py` into a router module without changing any URL.
97. Add a `GET /health` endpoint suitable for a load balancer, and explain what it should and should not check.

---

## 11. Decorators in FastAPI

### Concepts (general)

98. What is a closure, and exactly what does it capture — the value or the variable?
99. What is the difference between a decorator and a decorator factory? Show the two shapes side by side.
100. What does `functools.wraps` preserve, and name three things that visibly break without it.
101. When decorators are stacked, in what order are they applied, and in what order do they run at call time?

### Core questions

102. What is a Python decorator? Explain it with a minimal example that does not involve FastAPI.
103. List every place FastAPI uses decorators. Name at least six distinct decorator families.
104. In `@app.get("/menu", response_model=MenuResponse)`, identify the decorator, the argument, and the decorated function — then rewrite it without decorator syntax.
105. Why is `@app.get("/menu")` a *decorator factory* rather than a plain decorator?
106. What does `@app.middleware("http")` decorate? Write an example that logs the duration of every request.
107. What does `@app.exception_handler(...)` do? Write one that returns a custom JSON error shape for this menu API.
108. What were `@app.on_event("startup")` and `@app.on_event("shutdown")`? Why are they deprecated, and what replaces them?
109. Pydantic's `@field_validator` and `@model_validator` — write an example that rejects a `MenuItem` with a negative price.

---

## 12. Virtual environment vs system environment

### Concepts (general)

110. What is `PATH`, and how does a shell decide which executable a bare command refers to?
111. What is `site-packages`, and how does Python find an installed module at import time?
112. What is semantic versioning? Explain what `==`, `>=`, and `~=` each mean in a requirements file.
113. What is a transitive dependency, and what is dependency hell? Describe a concrete conflict.
114. What is a lockfile, and why is `pip freeze` output not quite the same thing?

### Core questions

115. Explain the difference between a virtual environment and the system Python environment.
116. Describe what `python -m venv .venv` creates on disk, and what *activating* it changes about your shell.
117. This project pins `fastapi==0.141.1` in its `.venv`. Another project on the same machine needs `fastapi==0.95`. How do both coexist?
118. Why should `.venv/` never be committed to git? What gets committed instead?
119. What is the difference between `pip install -r requirements.txt` and `pip freeze > requirements.txt`? Which direction is which?
120. Compare `venv`, `virtualenv`, `conda`, `poetry`, and `uv`. When would you pick each?
121. Your venv works from the terminal but PyCharm shows import errors for `fastapi`. What is almost certainly wrong?

---

## 13. Web frameworks — what and which kinds

### Concepts (general)

122. What is HTTP, in one paragraph? Cover statelessness, the request/response cycle, and what a 'session' really is on top of it.
123. Compare REST, RPC, GraphQL, and gRPC as API styles. What problem is each best at?
124. What criteria would you use to evaluate *any* framework before adopting it? List at least six.

### Core questions

125. What is a web framework, and what do you get from one that you would otherwise have to write yourself?
126. What are the types of web framework? Classify them by scope and by concurrency model.
127. Explain full-stack (batteries-included) vs micro vs API-only frameworks, naming a Python example of each. Where does FastAPI sit, and why?
128. What does a web framework *not* do? Separate the responsibilities of the framework, the application server, and the reverse proxy.
129. What is middleware, where does it sit in the request lifecycle, and what is routing?
130. What does MVC mean, and does FastAPI follow it?

---

## 14. WSGI vs ASGI

### Concepts (general)

131. What is blocking versus non-blocking I/O at the operating-system level?
132. What is an event loop, and what OS facility does it sit on — `select`, `epoll`, `kqueue`, IOCP?

### Core questions

133. What does WSGI stand for, and what problem did it solve when it was introduced?
134. What does ASGI stand for, and what does it add that WSGI cannot do?
135. Produce a table comparing WSGI and ASGI across: concurrency model, async support, WebSocket support, long-lived connections, background tasks, typical servers, and frameworks that use each.
136. Which of Flask, Django, and FastAPI use WSGI, and which use ASGI?
137. Write a minimal raw WSGI application (`environ`, `start_response`) and the equivalent raw ASGI application (`scope`, `receive`, `send`). What structural difference lets ASGI stream and hold a connection open?
138. What are `scope`, `receive`, and `send` in ASGI? What does each one carry?
139. Why can WSGI not serve WebSockets?
140. Can you run a WSGI app under an ASGI server? What adapter do you need, and what do you lose?
141. Name the common servers for each — which are WSGI and which are ASGI?

---

## 15. FastAPI vs Flask vs Django

### Concepts (general)

142. How do you read a framework benchmark honestly? What do those charts systematically hide?
143. How do you weigh team familiarity against technical fit? Describe a case where the familiar choice was correct.

### Core questions

144. Why is FastAPI considered a "pure backend" framework while Django is not?
145. Produce a table comparing FastAPI, Flask, and Django across: concurrency model, built-in validation, automatic docs, ORM, admin panel, templating, learning curve, typical use case, and performance.
146. Flask is synchronous, ships no built-in validation, and generates no docs. For each of those three gaps, name what you would add to a Flask project to close it.
147. Why is FastAPI most often recommended over Flask and Django for a new API? Give your top three reasons.
148. When is Django the better choice, and when is Flask? Describe a concrete project for each where you would not pick FastAPI.
149. Does Django support async now? What are the practical limits of that support?
150. Django ships an ORM, an admin, auth, and templates; FastAPI ships none of them. Is that a weakness? Argue the design philosophy.
151. "FastAPI is fast" — fast at what, exactly? Separate runtime performance from development speed.
152. If you had to port this project to Flask, what would you need to hand-write that FastAPI gave you for free?

---

## 16. The two pillars — Starlette and Pydantic

### Concepts (general)

153. What is a dependency? Distinguish direct from transitive, and runtime from build-time.
154. What is an abstraction leak? Give a concrete example from any framework you have used.
155. What does it mean that a Python package is backed by a Rust or C extension? What changes about installing, debugging, and profiling it?

### In this code

156. FastAPI is built on two key dependencies. Name them and state precisely what each contributes.
157. What does FastAPI get from Starlette? Name at least five capabilities. What does it get from Pydantic?
158. Is `FastAPI` a subclass of Starlette's `Starlette` class? What does that imply about what you can call on `app`?
159. Sort these into Starlette's vs FastAPI's own: `Request`, `Response`, `JSONResponse`, `APIRouter`, `HTTPException`, `TestClient`, `BackgroundTasks`, `Depends`.
160. `fastapi.HTTPException` and `starlette.exceptions.HTTPException` are different classes. What is the difference, and when does it bite you?
161. What is `pydantic_core`? Which language is it written in, and why does that matter for throughput?
162. Both appeared in your `pip freeze` output without being in `requirements.txt`. Explain why.

---

## 17. OpenAPI and automatic documentation

### Concepts (general)

163. What is an API specification, and what does it solve beyond human-readable documentation?
164. Compare spec-first and code-first API development. What does each optimise for?
165. What counts as a breaking change to an API contract? List five, including one that looks harmless.
166. How does documentation drift happen, and how do you prevent it structurally rather than by discipline?

### In this code

167. What is OpenAPI? Distinguish OpenAPI, Swagger, and Swagger UI.
168. How does FastAPI build the OpenAPI schema when you never wrote any of it?
169. Trace each of these from this project's source to its place in `/openapi.json`: the `title`, the `description`, the `Query` description, and `MenuResponse`.
170. What is the difference between `/docs` and `/redoc`?
171. What do `summary`, `description`, `tags`, and `response_description` do on a route decorator?
172. How do you declare the possible error responses (the 404s) so they show up in the docs?
173. What can you generate *from* an `openapi.json`? Name at least three downstream uses.

---

## 18. When `async def` runs and when `def` runs

### Concepts (general)

174. Define concurrency versus parallelism with an analogy you would use in an interview.
175. What is the GIL? State precisely what it prevents and what it does not.
176. What is I/O-bound versus CPU-bound work, and how do you determine which one you actually have?
177. What is a coroutine? How does `await` differ from a blocking call?
178. What is the 'coloured functions' problem — async contagion? How does it spread through a codebase?

### In this code

179. When does FastAPI run a handler declared `async def`, and on which thread?
180. When does FastAPI run a handler declared plain `def`, and on which thread?
181. All three handlers in this project are plain `def`. Explain exactly what FastAPI does with them, and whether the event loop is blocked.
182. What is the event loop? What happens when you block it?
183. You call a blocking sync database driver inside an `async def` handler. What goes wrong, and how do you fix it?
184. What is `run_in_threadpool`? What is the default threadpool size, and what happens under heavy load when every handler is a blocking `def`?
185. Is it ever *worse* to mark a handler `async def`? Give an example.
186. Where would you put a CPU-heavy job (resizing menu photos) so it does not stall the server?

---

## 19. Inspecting the raw request object

### Concepts (general)

187. What arrives at a server for one HTTP request? List every part in the order it appears on the wire.
188. Why are header names case-insensitive, and why can a header appear more than once?
189. What are `X-Forwarded-For` and the standard `Forwarded` header? Why can neither be trusted by default, and what makes them trustworthy?
190. Which parts of a request must never be written to logs? Give the list and the reason for each.

### In this code

191. How do you get the raw request object inside a FastAPI handler? Write the import and the handler signature.
192. Write a handler that returns the request's `method`, `url`, `headers`, `path_params`, `query_params`, and client host.
193. What type is `request.headers`? Why is it not a plain dict, and how do you read a header case-insensitively?
194. What is the difference between `request.query_params` and a declared `category: str | None` parameter? When would you reach for the raw version?
195. How do you read the raw request body? Why can you normally only do it once, and what is the workaround?
196. What is `request.state` for? Give a use case involving middleware.
197. How do you log the real client IP behind a reverse proxy? Why can you not trust `request.client.host`?
198. Does adding `request: Request` to a handler signature change the generated OpenAPI docs? Why or why not?

---

## 20. Responses — how the result gets back to the client

### Concepts (general)

199. What is in an HTTP response? Name every part, in order.
200. How does a client know a response has finished? Name both mechanisms.
201. Explain HTTP caching: `Cache-Control`, `ETag`, `Last-Modified`, and conditional requests. Which responses in a menu API are cacheable?
202. What is compression negotiation — `Accept-Encoding` and `Content-Encoding` — and where in the stack should compression happen?

### In this code

203. Trace what happens to the dict returned by `get_item` between the `return` statement and the bytes on the wire. Name every stage in order.
204. What does FastAPI wrap a returned dict in by default? What `Content-Type` does it set?
205. List the response classes FastAPI and Starlette provide, with a short example of each: `Response`, `JSONResponse`, `PlainTextResponse`, `HTMLResponse`, `RedirectResponse`, `StreamingResponse`, `FileResponse`.
206. What is `ORJSONResponse`, and why might you switch this API to it?
207. How do you set a custom status code on a *successful* response? How do you add a custom header to one response, and to every response?
208. When you return a `JSONResponse` directly, what happens to `response_model` validation? Why is that a trap?
209. What is `BackgroundTasks`? How does work scheduled there relate to the response that was already sent?
210. What exactly is uvicorn's job here? Draw the boundary between what FastAPI produces and what uvicorn transmits.

---

## 21. Scale — handling millions of orders efficiently

### Concepts (general)

211. Define latency, throughput, concurrency, and utilisation. How do they relate?
212. What are p50, p95, and p99 latency? Why is the mean latency close to useless for a user-facing API?
213. Compare horizontal and vertical scaling. What hard limit does each eventually hit?
214. What makes a service stateless, and what are the sneaky ways a service becomes accidentally stateful?
215. What are backpressure and load shedding? What should an overloaded API do rather than queue forever?

### In this code

216. How would this architecture handle millions of orders efficiently? Walk the whole path from client to data store.
217. Where is the first bottleneck in the current code if traffic went from 10 to 10,000 requests per second?
218. The menu almost never changes. Describe a caching strategy and say exactly where the cache lives.
219. How does async I/O let one process serve far more concurrent requests than thread-per-request does?
220. How do you scale FastAPI horizontally? What must be true of the application for that to work?
221. Where does a message queue belong in an order-taking system, and what does it protect you from?
222. How would you load-test this API? Name a tool and the metrics you would watch.
223. What is connection pooling, and why does it matter more than handler speed at high load?
224. How many uvicorn workers would you run, and how do you decide the number?

---

## 22. HTTP methods — PUT vs PATCH

### Concepts (general)

225. Define safe, idempotent, and cacheable. Build the full table for GET, POST, PUT, PATCH, DELETE, HEAD, and OPTIONS.
226. What is an idempotency key? Describe a server-side implementation, including how long you keep the key.
227. What are HEAD and OPTIONS for, and when should a server return 405 rather than 404?

### Core questions

228. List the common HTTP methods and state what each is for.
229. Explain the difference between PUT and PATCH. Give a concrete request body for each, against `/menu/1`.
230. What does *idempotent* mean? Which of GET, POST, PUT, PATCH, DELETE are idempotent?
231. Is PATCH idempotent? Justify your answer carefully.
232. Why is POST not idempotent, and what practical problem does that cause for an order endpoint?
233. Write `PUT /menu/{item_id}` and `PATCH /menu/{item_id}` for this project. How do the Pydantic models differ, and what is `exclude_unset` doing?
234. What status code should a successful POST return? A successful DELETE? A PUT that created a new resource?
235. Distinguish 200, 201, 202, and 204.
236. This API exposes only GET. Which methods would a real Chai Point ordering system need, and on which paths?

---

## 23. Architecture of this project

### Concepts (general)

237. What is the difference between a logical architecture and a deployment architecture? Which one has the load balancer on it?
238. What is a sequence diagram good at that a box-and-arrow diagram is not?
239. What is a single point of failure, and how do you systematically find them on a diagram?
240. What is a trust boundary, and why should it be drawn explicitly on an architecture diagram?

### In this code

241. Draw the architecture of this chai menu project: client, uvicorn, Starlette, FastAPI routing, Pydantic validation, and the data module. Label where the request enters and where the response exits.
242. On your diagram, mark the exact point where a 422 is produced and the point where a 404 is produced. Why are they in different places?
243. Mark where `response_model` validation happens relative to the handler's `return` statement.
244. Redraw the diagram for a production deployment: add a reverse proxy, multiple workers, a database, and a cache.
245. Redraw it again as a real ordering system: add authentication, an order service, a payment provider, and a queue.
246. Walk through `GET /menu?category=chai` as a sequence diagram, naming every component it touches in order. Then do `GET /menu/abc` and show where it short-circuits.

---

## 24. The only 10 that really matter — start here

Even trimmed, this file is a reference shelf, not a study plan.

These ten are asked in almost **every** FastAPI interview, worldwide, regardless of company
size or seniority. They are deliberately **generic** — no knowledge of this repo needed. If you
can answer these ten fluently, with a code example for each, you will pass the FastAPI portion
of most interviews. Everything else here is depth for a follow-up.

Work top to bottom. The ranking is by how often the question is actually asked.

---

**1. What is FastAPI, and why would you choose it over Flask or Django?**

The opener in nearly every interview. Expect it first.
*Really testing:* whether you chose your tools or inherited them. A strong answer names the
trade-offs and says when you would **not** pick FastAPI. → §15, §16, §13

---

**2. Explain `async def` vs `def` in FastAPI. When does each run, and what is the event loop?**

The most common *technical* question, and the one most candidates get half-right.
*Really testing:* whether you know that a blocking call inside `async def` stalls every other
request. Be ready to say what happens to a plain `def` handler (threadpool) and why that is not
parallelism. → §18

---

**3. What is the difference between WSGI and ASGI, and why does FastAPI need uvicorn?**

*Really testing:* whether you know what runs your code. Many candidates cannot explain why
`python main.py` isn't how you start a FastAPI app. → §14, §2

---

**4. How does Pydantic validation work? What does `response_model` do?**

*Really testing:* that validation runs in **two** directions — on the way in and on the way out —
and that `response_model` silently drops undeclared fields, which is a security feature, not a
formatting one. → §4

---

**5. What is dependency injection with `Depends`, and what do you use it for?**

FastAPI's signature feature, and a near-certain question. Typical uses: database sessions, the
current authenticated user, shared query parameters, and swapping real services for fakes in
tests.
*Really testing:* whether you have built anything non-trivial, since you cannot avoid `Depends`
in a real app. Know sub-dependencies, `yield` dependencies for setup/teardown, and dependency
caching within one request.
⚠️ **Barely covered in this file** — study it from the official docs.
→ <https://fastapi.tiangolo.com/tutorial/dependencies/>

---

**6. How do you handle errors? Explain `HTTPException` and when you would write a custom handler.**

*Really testing:* whether you return correct **status codes** rather than `200 OK` with an error
message in the body. Know 400, 401, 403, 404, 422, and 500, and which of them FastAPI raises for
you. → §5, §22

---

**7. How does FastAPI generate automatic documentation?**

*Really testing:* that the docs are derived from your type hints and Pydantic models — not written
by hand and not magic. Distinguish OpenAPI (the spec), Swagger UI (`/docs`), and ReDoc
(`/redoc`). → §17

---

**8. How do you implement authentication and authorization in FastAPI?**

Asked in essentially every interview for a paid role, because every real API needs it.
Know `OAuth2PasswordBearer`, JWT issue-and-verify, password hashing with bcrypt/passlib, getting
the current user as a dependency, and authentication (who you are) versus authorization (what you
may do).
⚠️ **Not covered anywhere in this file** — zero mentions of JWT or OAuth2. This is the biggest
gap. Study it separately. → <https://fastapi.tiangolo.com/tutorial/security/>

---

**9. Explain path parameters, query parameters, and the request body. How does FastAPI decide which is which?**

*Really testing:* basic competence, and whether you know REST conventions — a path segment
identifies a resource, a query parameter filters a collection. Expect a follow-up on where
Pydantic models fit (the body) and why GET has no body. → §3, §22

---

**10. How would you structure a large FastAPI project, and how do you test it?**

Often phrased as "walk me through how you'd organise this for a team." Know `APIRouter`, the
routers/services/repository split, where config belongs, and `TestClient` with dependency
overrides.
*Really testing:* whether you have worked on something bigger than a tutorial. → §1, §7, §8

---

### The three runners-up

Asked often enough to prepare, just below the top ten:

- **Middleware** — what it is, where it sits, and writing one that logs request duration. → §11, §19
- **Background tasks** — `BackgroundTasks` vs a real queue like Celery, and when each fits. → §20
- **CORS** — why the browser blocks the request, and what `CORSMiddleware` actually changes. → §8

---

### Per-topic fast pass — the single most-asked question from each section

If you want one question per topic instead of ten across all topics, answer these 23.

| § | Topic | The most-asked question from it |
|---|---|---|
| 1 | Project structure | Explain the folder structure and the purpose of each `.py` file |
| 2 | FastAPI fundamentals | In `uvicorn main:app --reload`, explain every part |
| 3 | Routing & parameters | Difference between a path parameter and a query parameter |
| 4 | Pydantic validation | What does `response_model` actually do to the returned value? |
| 5 | Error handling | Why `HTTPException` instead of returning an error dict? |
| 6 | Data layer | `menu_items` is a module-level list — what breaks, and why? |
| 7 | Testing | How would you test these endpoints? Which client? |
| 8 | Production | What would you change before deploying this? Name five |
| 9 | Code review | Find the `snack` vs `snacks` defect and say how you'd fix it |
| 10 | Hands-on | Add a `GET /categories` endpoint with per-category counts |
| 11 | Decorators | What is a decorator? Explain without FastAPI, then with it |
| 12 | Environments | Virtual environment vs system Python environment |
| 13 | Web frameworks | What is a web framework, and what does it save you writing? |
| 14 | WSGI vs ASGI | What is WSGI, what problem did it solve, what does ASGI add? |
| 15 | vs Flask/Django | Why is FastAPI "pure backend" while Django is not? |
| 16 | Starlette + Pydantic | Name FastAPI's two key dependencies and what each contributes |
| 17 | OpenAPI docs | Distinguish OpenAPI, Swagger, and Swagger UI |
| 18 | async vs def | When does `async def` run, and on which thread? |
| 19 | Raw request | How do you access the raw `Request` object? Write the signature |
| 20 | Responses | Trace a returned dict from `return` to bytes on the wire |
| 21 | Scale | How would this handle millions of orders efficiently? |
| 22 | PUT vs PATCH | Difference between PUT and PATCH, with a body for each |
| 23 | Architecture | Draw this project's architecture end to end |

**Two topics have no row here because the file does not cover them** — and both are asked more
often than most rows above: **dependency injection with `Depends`** and **authentication
(OAuth2 / JWT)**. See items 5 and 8 in the top ten for the links.

### How to use this section

1. Answer all ten **out loud**, as if to an interviewer. Silent reading hides the gaps.
2. Write a **minimal code example** for each from memory — roughly 10 lines.
3. For #5 and #8, go to the official docs: this file does not cover them properly.
4. Only then open the other 23 sections, and only where a follow-up caught you out.

---

## References

- Starlette — routing, middleware, WebSockets, lightweight async web services: <https://starlette.dev/>
- Pydantic validation: <https://pydantic.dev/docs/validation/latest/>
- FastAPI: <https://fastapi.tiangolo.com/>
- ASGI specification: <https://asgi.readthedocs.io/>
- WSGI (PEP 3333): <https://peps.python.org/pep-3333/>
- OpenAPI specification: <https://spec.openapis.org/oas/latest.html>
- HTTP semantics, methods and status codes (RFC 9110): <https://www.rfc-editor.org/rfc/rfc9110.html>

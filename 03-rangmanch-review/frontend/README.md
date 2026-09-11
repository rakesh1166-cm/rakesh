# Rangmanch Reviews — React CRUD UI

A small React (Vite) frontend for the FastAPI in the parent folder. It exists to make CRUD
**visible**: every button maps to exactly one endpoint, and a live request log shows the method,
URL, request body and response for each call.

## Run it

Two terminals.

**1 — the API** (from the project root, one folder up):

```bash
.venv\Scripts\uvicorn main:app --reload --port 8001
```

**2 — the UI** (from this folder):

```bash
npm install     # first time only
npm run dev
```

Open http://localhost:5173.

### Why 8001 and not 8000

Port 8000 on this machine is already held by the **02-pincode-lookup** project. Two servers cannot
share a port — whichever starts second dies with `WinError 10048` and you are left talking to the
wrong app. So this project uses 8001, set once in `.env` (`VITE_API_BASE`).

Vite reads `.env` only at startup, so restart `npm run dev` after editing it.

To use 8000 instead: stop the pincode server, then change both the uvicorn `--port` and the value
in `.env`.

> A confusing symptom worth recognising: if the *wrong* FastAPI app is on the port, the browser
> still cannot read its reply, because that app has no CORS entry for `localhost:5173`. JavaScript
> sees the same opaque failure as "nothing is listening" — which is why the error banner names both
> causes.

## What maps to what

The sidebar is the menu; each item is one screen, and most screens are one endpoint.

| Menu item          | HTTP call                           | Backend function      |
| ------------------ | ----------------------------------- | --------------------- |
| **New review**     | `POST /review/`                     | `create_review`       |
| **Browse reviews** | `GET /review/?play_name&skip&limit` | `list_reviews`        |
| **Find by ID**     | `GET /review/{id}`                  | `get_review`          |
| **Average rating** | `GET /review/average/{play_name}`   | `get_average_rating`  |
| **Edit & delete**  | `PATCH` / `DELETE /review/{id}`     | `update_review` / `delete_review` |
| **Request log**    | —                                   | every call, in order  |
| **Cheat sheet**    | —                                   | the five ops + traps  |

"Edit & delete" shows the same list as Browse, because both operations need a row to act on — the
Edit and Delete buttons live on each card.

A strip at the bottom always shows the most recent call; click it to jump to the full log. The
sidebar footer shows whether the API is reachable.

## Files

- [src/api.js](src/api.js) — every endpoint in one place, one function each. Read this first.
- [src/App.jsx](src/App.jsx) — which screen is showing, the shared review list, and the log.
- [src/components/Sidebar.jsx](src/components/Sidebar.jsx) — the menu; one entry per screen.
- [src/components/CreateForm.jsx](src/components/CreateForm.jsx) — CREATE, with a live preview of
  the JSON body it will POST.
- [src/components/BrowseView.jsx](src/components/BrowseView.jsx) — READ list, filter and paging.
- [src/components/ReviewCard.jsx](src/components/ReviewCard.jsx) — UPDATE and DELETE. Note that it
  builds the PATCH body from **only the fields that changed** — that is the difference between
  PATCH and PUT.
- [src/components/FindOne.jsx](src/components/FindOne.jsx) — READ one, and what a 404 means.
- [src/components/AverageView.jsx](src/components/AverageView.jsx) — the aggregate endpoint.
- [src/components/RequestLog.jsx](src/components/RequestLog.jsx) — the teaching panel; fed by
  `onRequest` in api.js.
- [src/components/CheatSheet.jsx](src/components/CheatSheet.jsx) — reference screen.

## Things worth noticing while you click around

- The trailing slash matters: the router uses `prefix="/review"` with a path of `"/"`, so the list
  and create endpoints are `/review/`, not `/review`.
- `ReviewUpate` in models.py only allows `rating` and `comment`, so the edit form cannot change the
  play or reviewer name. The API decides what is editable, not the UI.
- Rating is validated in two places: the stars widget (1–5) and `Field(ge=1, le=5)` on the server.
  Never trust only the frontend.
- Filtering by play uses `==`, so the play name must match exactly.
- "Next page" is disabled when fewer rows came back than `limit` — that is how you know there is no
  next page without a count endpoint.
- Delete returns `{"message": "Review deleted"}`, not the deleted row. Expand it in the log.

## Note on the backend

`main.py` gained a `CORSMiddleware` block allowing `http://localhost:5173`. Browsers block
cross-origin calls without it — the server would be fine, but the browser refuses to hand the
response to JavaScript. curl and `/docs` never needed it because neither is a cross-origin browser
request.

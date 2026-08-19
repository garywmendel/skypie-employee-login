# SkyPie — Employee Sign In (Harri)

Design prototype for the employee sign-in flow, covering 11 states across roster sync,
reactivation, and access-ended handling.

Static host only. No database, no API calls, no employee data. Nothing here talks to
Harri or to SkyPie production — it's a clickable prototype for design review.

**Unrelated to any other project. Deploy as its own repo and its own Railway service.**

---

## Files

```
server.js        Express static host + optional access gate
package.json     one dependency (express), Node 20+
public/
  index.html     the prototype (self-contained, no build step)
.gitignore
```

---

## Deploy — browser only, no terminal

### 1. Create the repo

1. Go to `github.com/new`
2. Name: `skypie-employee-login` · **Private** · don't add a README
3. Create repository
4. On the empty repo page: **uploading an existing file**
5. Drag in `server.js`, `package.json`, `.gitignore`, `README.md`, and the `public` folder
6. Confirm `public/index.html` landed inside `public/`, not at the root
7. Commit to `main`

### 2. Deploy on Railway

1. Railway → **New Project** → **Deploy from GitHub repo**
2. Pick `skypie-employee-login`
3. Railway detects Node, runs `npm install`, then `npm start`. No config needed.

### 3. Add the access gate

Service → **Variables** → **New Variable**

| Name | Value |
|---|---|
| `SKYPIE_ACCESS_CODE` | any code you choose |

The browser prompts for a username and password. **Leave the username blank** — only
the password is checked, against this value.

Leave the variable unset and the site is fully public. The prototype contains internal
product decisions and open security questions, so set it before sharing the link.

### 4. Generate the URL

Service → **Settings** → **Networking** → **Generate Domain**

Gives you `skypie-employee-login-production.up.railway.app` or similar.

---

## Checks

| URL | Expect |
|---|---|
| `/healthz` | `{"ok":true,"gated":true}` — never gated, so Railway can always reach it |
| `/` | the prototype |
| any other path | falls back to the prototype |

If `gated` reads `false` but you set the variable, the service didn't restart. Redeploy
from the **Deployments** tab.

---

## Updating the prototype

Only `public/index.html` changes between design revisions. Edit it on GitHub
(pencil icon → paste the replacement → commit) and Railway redeploys automatically.

Replace the whole file rather than editing in place. It's a single self-contained
document — partial edits risk unbalanced tags that render as a blank page.

---

## Notes

- No OAuth, no tokens, no persistence, so nothing needs re-authorising after a redeploy.
- `Cache-Control: no-store` — reviewers always see the current build, no hard refresh.
- `X-Robots-Tag: noindex` — keeps an unreleased feature out of search results.

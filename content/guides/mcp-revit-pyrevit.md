---
title: Connect Revit to Claude, through pyRevit
slug: mcp-revit-pyrevit
group: MCP setup
summary: Two routes into Revit — Autodesk's own read-only server, and a pyRevit extension that runs Python against the Revit API. The second needs a config change nobody tells you about, and it can delete things.
software: Revit · pyRevit
level: Advanced
reading: 9 min
diagram: mcp-revit-pyrevit.svg
updated: 2026-11-16
---

Revit is the hardest of these to connect and the one with the most to lose if
it goes wrong. A live central file with six people in it is not a sandbox.

There are two routes and they are **not** equivalent. Read
[What MCP actually is](mcp-what-it-is.html) first if you have not set up a
server before.

## Route A — Autodesk's own server (read-only)

Autodesk ship an MCP server for recent Revit versions. On our machine it
installs to:

```
C:\Program Files\Autodesk\Revit <version> MCP Server Read-Tools Technical Preview\Autodesk.RevitMcpServer.Stdio.exe
```

The folder name tells you the two things that matter: it is a **technical
preview**, and it is **read-tools**. It reads the model and does not write.

That is a feature. For audits, takeoffs, schedule interrogation and "what is
actually in this model" questions — which is most of what you want — read-only
is exactly right, and it removes the entire category of risk.

**Claude Desktop config:**

```json
{
  "mcpServers": {
    "revit-mcp": {
      "command": "C:/Program Files/Autodesk/Revit 2027 MCP Server Read-Tools Technical Preview/Autodesk.RevitMcpServer.Stdio.exe",
      "args": []
    }
  }
}
```

Adjust the version in the path. Forward slashes; the spaces are fine inside a
JSON string.

**Availability varies by Revit version and release channel.** Look in
`C:\Program Files\Autodesk\` for a folder with `MCP Server` in the name before
assuming you have it. If it is not there, use Route B.

## Route B — the pyRevit extension (read and write)

This runs an MCP server from a **pyRevit extension**, giving Claude a Python
API into the running Revit session. More capable, and correspondingly more
dangerous.

**Source:** the setup below follows
[BIM Pure's pyRevit MCP tutorial](https://www.bimpure.com/blog/pyrevit-mcp-claude-code-tutorial)
and the extension at
[mcp-servers-for-revit/mcp-server-for-revit-python](https://github.com/mcp-servers-for-revit/mcp-server-for-revit-python).

### What you need

- **pyRevit**, installed.
- **Git** — [git-scm.com](https://git-scm.com/install/windows). You may need to
  restart Windows afterwards.
- **uv**, the Python package manager.
- **Admin rights** on the machine.
- A Claude paid subscription, and Claude Code or Claude Desktop.

### Step 1 — install the pyRevit extension

In Revit, open pyRevit's **Extensions** menu, find
**`mcp-server-for-revit-python`**, and click **Install Extension**.

There is a **Path** field you can customise. **Copy that path** — you will need
it for the Claude config.

The extension lands under your pyRevit extensions folder. To find it:

```powershell
Get-ChildItem "$env:APPDATA\pyRevit\Extensions" -Directory
```

### Step 2 — turn on the pyRevit Routes server

This is the step that is easy to miss and without which nothing works.

Open **pyRevit settings → Routes**, and turn on **Routes Server (beta)**.

### Step 3 — bind it to localhost

**Do not skip this.** By default the Routes server binds to **`0.0.0.0`** —
every network interface on the machine. That exposes an endpoint that can run
Python inside Revit to anything that can reach your machine.

Open `pyRevit_config.ini`, in:

```
%APPDATA%\pyRevit
```

Find the `Routes` section and set:

```ini
server_host = "127.0.0.1"
server_port = 48884
```

Save it, close it, and **restart both Revit and Claude Code.**

### Step 4 — the Claude config

The config points at the MCP executable inside the extension's own virtual
environment. On our machine:

```json
{
  "mcpServers": {
    "revit-connector": {
      "command": "C:/Users/<you>/AppData/Roaming/pyRevit/Extensions/mcp-server-for-revit-python.extension/.venv/Scripts/mcp.exe",
      "args": [
        "run",
        "C:/Users/<you>/AppData/Roaming/pyRevit/Extensions/mcp-server-for-revit-python.extension/main.py"
      ]
    }
  }
}
```

**Claude Code:**

```bash
claude mcp add revit-connector -- "C:/Users/<you>/AppData/Roaming/pyRevit/Extensions/mcp-server-for-revit-python.extension/.venv/Scripts/mcp.exe" run "C:/Users/<you>/AppData/Roaming/pyRevit/Extensions/mcp-server-for-revit-python.extension/main.py"
```

Reading that path: `.venv\Scripts\mcp.exe` is a **Python virtual environment
inside the extension**, with the MCP tooling installed into it. Confirm it
exists before you go looking for config problems:

```powershell
Test-Path "$env:APPDATA\pyRevit\Extensions\mcp-server-for-revit-python.extension\.venv\Scripts\mcp.exe"
```

If that returns `False`, the venv has not been created and Claude will fail
silently with no server. The BIM Pure tutorial's approach is to point Claude
Code at the extension folder and have it do the install; follow the repo's own
README for the dependency steps rather than guessing them.

### Step 5 — verify

Open a Revit model, then ask Claude Code to confirm the connection. The
tutorial suggests being explicit about the endpoint, because the server will
otherwise try `localhost` and may resolve it differently:

> My pyRevit Routes server uses host 127.0.0.1 and port 48884 — make the MCP
> server connect to exactly that, and use 127.0.0.1, not localhost.

Then something harmless:

> What Revit version is open, what's the document name, and how many levels does it have?

A real answer means you are connected. A general explanation of Revit levels
means you are not.

## Route B writes to your model

The extension exposes **`execute_revit_code`**, which runs generated Python
against the Revit API. The tutorial's own demonstration prompt is:

> Delete all trees visible in the active view.

That is not a read-only tool, and the tutorial itself warns that running this
kind of thing on an active project "could be risky".

## What to let it do

**Yes, confidently:**

- Reading model information — version, worksets, levels, grids, phases, design
  options, warnings.
- Interrogating categories and parameters: what exists, what is populated,
  what the fill rates are. This is where it earns its keep.
- Listing views and finding where an element appears.
- Producing the inputs for an audit. Our
  [IFC Model Audit](../skills/ifc-model-audit.html) and
  [Area Schedule Audit](../skills/area-schedule-audit.html) skills are built to
  consume exactly this.

**No, or not without care:**

- **Anything on a live central file.** Detach a copy. Always.
- **Bulk parameter writes.** A loop across 4,000 elements is one typo from a
  very long undo.
- **Deleting or purging.** There is no scenario where you need Claude to purge
  a model unattended.
- **Syncing to central.** Do that yourself, having looked at what changed.

## The rule that matters

**Detach, then play.**

Open a detached copy, let Claude work on that, read what it did, and apply the
finding to the live model yourself. Everything on the "yes" list works
perfectly on a detached copy, because all of it is reading.

The temptation is to skip this because the read-only work is obviously safe —
and then one day you ask for "a quick parameter fix" on the model you happen to
have open. **The habit is the protection, not the risk assessment.**

## Expectations

The tutorial is candid about limits, and they match our experience: generated
code "might not work for more complex tasks" — it managed a wall and failed on
stairs — and the approach is slower than a purpose-built MCP server because
Claude is writing Revit API code each time.

On model choice: a smaller model for light tasks, a larger one for complex
multi-step work, with the obvious token cost. And expect to restart Claude
Desktop a few times during setup, and to approve access more than once.

## A note on what Revit data can and cannot tell you

A model answers what is *in* it. It will not tell you what is missing, and it
will not flag a parameter that exists and was never populated — those come back
as blanks, and **a blank is the absence of data, not a value of none.**

That distinction is the difference between a schedule you can rely on and one
that quietly understates. It is why our model-audit skills report coverage as
fill rates rather than present/absent, and it is worth carrying into anything
you ask Claude to pull out of a model.

---
title: What MCP actually is, and where Claude keeps its config
slug: mcp-what-it-is
group: Start here
summary: The Model Context Protocol in plain terms, the two places Claude reads server config from, and the JSON shape every setup guide assumes you already know.
software: All
level: Start here
reading: 6 min
diagram: mcp-what-it-is.svg
updated: 2026-11-16
---

Every MCP setup guide on the internet starts at step three. It hands you a
block of JSON and assumes you know which file it goes in, which Claude reads
it, and what to do when nothing happens. This page is steps one and two.

## What MCP is

The Model Context Protocol lets Claude talk to a program running on your
machine. Claude is not reaching into Rhino or QGIS directly — it is sending
messages to a small **server** process, and that server is the thing that knows
how to drive the application.

So every working setup has three parts, and when something breaks it is almost
always obvious which one:

1. **The application** — Rhino, Revit, QGIS, Blender. Usually it needs to be
   **running**, and often it needs an add-on or plugin installed that opens a
   listening port.
2. **The MCP server** — a separate process, started by Claude, that translates
   between Claude and the application.
3. **Claude** — Desktop or Code, which launches the server and reads the tools
   it offers.

The commonest failure is not a broken config. It is **the application not being
open**, or the add-on not enabled inside it. Check that first, every time.

## The two config files

Claude Desktop and Claude Code are separate products with separate
configuration. Setting one up does not set up the other.

### Claude Desktop

| Platform | File |
|---|---|
| Windows | `%APPDATA%\Claude\claude_desktop_config.json` |
| macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |

On Windows you can paste `%APPDATA%\Claude` into the Explorer address bar and
it will resolve.

**Claude Desktop reads this file at launch.** After editing it you must quit
Claude completely — not just close the window — and reopen it. On Windows,
check the system tray.

### Claude Code

Claude Code stores servers in `~/.claude.json`, but **you should not edit that
file by hand.** Use the CLI:

```
claude mcp add <name> -- <command> <args...>
claude mcp list
claude mcp remove <name>
```

The `--` matters. Everything after it is the command Claude runs, passed
through verbatim.

Claude Code also supports a **`.mcp.json` in a project directory**, which is
how you share a server configuration with a team through version control.

## The JSON shape

A Claude Desktop config is one object with one key you care about:

```json
{
  "mcpServers": {
    "my-server": {
      "command": "path-or-name-of-executable",
      "args": ["first-argument", "second-argument"],
      "env": {
        "SOME_API_KEY": "value"
      }
    }
  }
}
```

- **`command`** is the executable. It can be a bare name if it is on your
  `PATH` (`npx`, `uvx`, `python`), or a full absolute path.
- **`args`** is an array of strings. Not one string with spaces in it —
  **an array**. This is the single most common syntax error.
- **`env`** is optional and holds environment variables the server needs,
  typically API keys.

### Three things that will bite you on Windows

**Backslashes in JSON.** In JSON a backslash starts an escape sequence, so a
Windows path needs either **forward slashes** or **doubled backslashes**. The
first and third lines below are valid. The second is not, and it is the one
everybody writes:

```json
"command": "C:/Users/you/tools/server.exe"
"command": "C:\Users\you\tools\server.exe"
"command": "C:\\Users\\you\\tools\\server.exe"
```

Use forward slashes. They work on Windows, and you will never miscount a
backslash again.

**`npx` needs a shim.** On Windows, `npx` is a batch script rather than an
executable, and Claude often cannot launch it directly. The working pattern is
to call it through the command processor:

```json
{
  "command": "cmd",
  "args": ["/c", "npx", "-y", "some-package@1.2.3"]
}
```

**Trailing commas.** JSON does not allow them. A trailing comma after the last
entry in an object will silently stop the whole file from loading, and Claude
will start with no servers at all and no error.

## Pinning versions

If a server is published to npm or PyPI, pin the version:

```json
"args": ["/c", "npx", "-y", "some-package@0.6.9"]
```

Without a version you get whatever was published this morning. MCP servers are
young software and breaking changes are frequent. Pin it, note the version, and
upgrade deliberately.

## Checking it worked

**Claude Code:** `claude mcp list` shows configured servers and whether they
connected.

**Claude Desktop:** open a new conversation and ask Claude what tools it has.
If the server connected, its tools appear with names like `mcp__qgis__*`.

**If the server is not there:**

1. Is the application running, with its add-on enabled?
2. Did you fully quit and reopen Claude Desktop?
3. Is the JSON valid? Paste it into any JSON validator. A trailing comma or a
   stray backslash is usually the answer.
4. Can you run the `command` and `args` yourself in a terminal? If it fails
   there, it will fail for Claude, and the terminal will tell you why. Claude
   will not.

That last one resolves most problems. **Run the command by hand first.**

## A note on trust

An MCP server is a program that runs on your machine with your permissions, and
most of them are community projects. Before installing one:

- Read what it actually does. A server that can drive your CAD application can
  usually also write files.
- Prefer servers that are read-only, or that say clearly what they modify.
- Pin the version, so an update cannot change behaviour under you.
- Keep API keys in `env`, never in `args` — `args` are far more likely to end
  up in a log.

None of this is paranoia about any particular project. It is the same care you
would take with any plugin that can touch a live model.

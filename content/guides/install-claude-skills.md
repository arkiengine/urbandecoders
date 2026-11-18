---
title: Installing a skill from this library
slug: install-claude-skills
group: Start here
summary: What a Claude skill actually is, the two ways to install one, where the files land, and how to tell whether it loaded.
software: Claude
level: Start here
reading: 5 min
updated: 2026-11-16
---

Every skill in our [library](../skills/) downloads as a `.skill` file. This
page covers what that file is and the two ways to get it into Claude.

## What a skill is

A skill is a folder of instructions Claude reads **when your conversation
matches it**. It is not a plugin, not an app, and not something that runs
code on your behalf. At minimum it contains one file:

```
skill-name/
└── SKILL.md
```

`SKILL.md` has a frontmatter block with a `name` and a `description`, then the
instructions themselves. **The description is the important part** — it is what
Claude reads to decide whether the skill applies, which is why the ones in our
library are written as long, explicit statements of when to use the skill and
when not to.

Larger skills add two conventional folders:

```
skill-name/
├── SKILL.md
├── references/      loaded only when the skill needs the detail
└── scripts/         deterministic steps run as code, not improvised
```

A `.skill` file is just a **zip of that folder**. You can rename it to `.zip`
and look inside before installing it, and you should.

## Route 1 — the Claude app

1. Download the `.skill` file from the skill's page.
2. Open Claude, go to **Settings → Capabilities → Skills**, and upload it.
3. Start a conversation and attach your material.

The skill loads itself when the conversation matches. You can also invoke it
directly by name.

## Route 2 — Claude Code

Unzip the package into a skills folder:

```bash
mkdir -p .claude/skills && unzip skill-name.skill -d .claude/skills/
```

Then restart Claude Code.

**Two locations, and the difference matters:**

| Location | Scope |
|---|---|
| `.claude/skills/` | This project only |
| `~/.claude/skills/` | Every project |

Project-scoped is the better default. A skill in `.claude/skills/` can be
committed to the repository, which means the whole team gets it and it is
versioned with the work. A skill in `~/.claude/skills/` exists only on your
machine and will quietly diverge from everyone else's.

Check it landed:

```bash
ls .claude/skills/
```

You should see the skill folder with `SKILL.md` inside it. If you see the
`.skill` file instead, the unzip did not run.

## Checking it loaded

Start a conversation and describe the task in your own words — the way you
would to a colleague. If the skill's description matches, Claude picks it up.

If it does not load when you expected it to, the usual causes are:

1. **Claude Code was not restarted** after the files were added.
2. **The folder structure is wrong.** `SKILL.md` must be inside a folder inside
   `skills/`, not loose in `skills/` itself.
3. **The conversation does not match the description.** Read the skill's
   trigger description — every page in our library prints it in full, under
   *When Claude reaches for it*. It tells you exactly how to phrase the ask,
   and what the skill will decline.

That third one is not a failure. A skill that declines to run on the wrong task
is working.

## Test-driving before you trust it

Every skill in our library ships a **worked example**: a fictional project with
defects deliberately planted in it, a reference answer, and a key listing what
was planted and what a good run does with each one.

Download it from the skill's page, run the skill on the example input, and
score your output against the key.

This takes ten minutes and tells you more than any description. In particular
it tells you whether the skill **refuses the things it should refuse** — most
of ours are built to decline a request rather than produce a confident answer
from insufficient evidence, and that behaviour is the whole point. If your run
produces a tidy, complete, confident output where the key says it should have
produced gaps and questions, something is wrong.

## Editing a skill

They are markdown. Open `SKILL.md` and change it.

Two things worth knowing before you do:

- **The description controls triggering.** Shortening it to something tidy is
  the quickest way to stop a skill loading when you need it.
- **The refusals are load-bearing.** Most of the "will not do" lists in our
  skills exist because the alternative is a plausible, well-formatted, wrong
  answer. Removing a refusal usually does not make a skill more helpful; it
  makes it more confident.

If you change one substantially, re-run it on the worked example and score it
again.

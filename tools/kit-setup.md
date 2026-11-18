# Connecting the course waiting list to Kit

The form on `courses.html` and the four course pages posts straight to Kit.
No API key touches the browser, so nothing here is a secret.

## 1. Make the form in Kit

Grow → Landing Pages & Forms → **New** → Form → Inline. Call it
*Course waiting list*. The design does not matter: visitors never see Kit's
version, only ours.

In the form's settings:

- **Incentive / double opt-in** — on means Kit emails a confirmation link and
  only subscribes people who click it. Recommended, and our success message
  already tells people to check their inbox. Turn it off and they are
  subscribed immediately.
- **After subscribing** — leave it on the default success message. It is only
  seen in the fallback case (see step 5).

## 2. Create the custom fields

Grow → Subscribers → **Custom fields**. Keys must match exactly, lower case
with underscores:

| Key | Holds |
|---|---|
| `company` | Practice, developer or authority |
| `role` | What they do, from the dropdown |
| `track_visualisation` | `Yes` if ticked |
| `track_realtime_3d` | `Yes` if ticked |
| `track_3d_twins` | `Yes` if ticked — the Urban Digital Twins track |
| `track_real_estate` | `Yes` if ticked |
| `note` | Free-text answer |
| `consent` | `Yes` — their explicit opt-in |

`first_name` and the email address are built into Kit; do not create those.

## 3. Paste the form id into the build

> **Done — connected 18 Nov 2026.** `KIT_FORM_ID = "10207727"`, form *Cocoa form*,
> double opt-in on. The rest of this section is only for reconnecting or moving
> to a different Kit form.

Open the form → **Embed** → HTML. The snippet's `action` looks like
`https://app.kit.com/forms/1234567/subscriptions`. Take the number.

In `tools/build_courses.py`:

```python
KIT_FORM_ID = "1234567"
```

Then rebuild:

```bash
py tools/build_courses.py
```

Until that id is set, the form refuses to submit and tells visitors to email
the studio instead, so it can never silently drop a signup.

## 4. Tag by track (optional)

A plain form post cannot set Kit tags directly — that is why the tracks are
custom fields. To turn them into tags, make one automation per track:

Automations → New → Trigger **Subscriber added to form** *Course waiting list*
→ Condition: custom field `track_visualisation` is `Yes` → Action: add tag
*Course: Visualisation*. Repeat for the other three.

If you would rather not bother, you can segment on the custom fields directly
when you send — the tags are only a convenience.

## 5. How submission behaves

1. JavaScript posts the form to Kit in the background and shows the result in
   place, without losing what was typed.
2. If that call is blocked — Kit's CORS, a network failure — the browser does a
   normal form post instead and the visitor lands on Kit's own thank-you page.
   The signup still counts.
3. With JavaScript off entirely, step 2 is what happens from the start.

Worth testing once after you paste the id: submit a real address and check it
appears under the form's subscribers in Kit, with the custom fields populated.

## 6. What is still on Web3Forms

The project brief form on `contact.html` and `ja/contact.html` is unchanged and
still emails the studio. Only the waiting list moved to Kit.

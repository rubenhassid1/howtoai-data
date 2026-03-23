---
title: "Sins."
date: 2025-08-24
slug: the-7-deadly-sins-of-prompting
subtitle: "And how to fix a bad prompt."
url: https://ruben.substack.com/p/the-7-deadly-sins-of-prompting
---

Most (ChatGPT) prompts fail because they’re wishes, not briefs.

Good outputs start with good inputs. Prompting isn’t magic; it’s a good brief.

✦ The 7 deadly sins of prompting (to avoid at all costs). 

✦ Iteration beats length: prompt quicker, not longer.

✦ The R-E-X prompt works 99% of the time.

Let’s retrain how you prompt in this 10-minute guide. 

---

## The 7 sins and their fixes

### 1. No context

**Why it fails**: the model guesses your job, audience, and constraints. Guessing multiplies errors.

**Quick fix**: add role + task scope + constraints.

**Before**: “Analyze this.”

**After**: “You are a product analyst. Analyze the attached transcript for founders from seed to Series A to find the vision outliers. Output a 5-bullet decision memo. Max 180 words.”

### 2. Vague instructions

**Why it fails**: You didn’t define success.

**Quick fix**: Define success and acceptance tests.

**Before**: “Write about marketing trends.”

**After**: “Write a 1,000-word brief on the three most important B2B AI marketing trends for Q3 2025. Include one data point per trend with a source and a one-line implication.”

### 3. Treating it like Google

**Why it fails**: Asking questions is level 1. Give it directives.

**Quick fix**: Change questions into jobs with deliverables.

**Before**: “What are good onboarding ideas?”

**After**: “Draft a 5-step onboarding flow for a B2B SaaS. Include the email subjects, timing in days, and one KPI per step.”

### 4. Asking for everything at once

**Why it fails**: One giant ask hides failures and creates spaghetti outputs.

**Quick fix**: Split into steps and chain outputs.

**Before**: “Create our GTM plan, website copy, and investor memo.”

After, **step 1**: “List the 5 core customer jobs-to-be-done with a one-line pain for each.”

After, **step 2**: “Using the chosen JTBD 2 and 4, write homepage H1 options (5) within 8 words each.”

After, **step 3**: “Expand H1 #3 into a 150-word hero section.”

### 5. Not iterating

**Why it fails**: It’s a chat. So have a chat with it.

**Quick fix**: Critique-then-revise loop is the key.

**Before**: “Write the article.”

After, **step 1**: “List 5 potential angles for my article about [topic] to get eyeballs from [audience]. Focus on [niche].”

After, **step 2**: “Using the chosen angle, let’s write 10 SEO-ready titles with their one-liners summaries.”

After, **step 3**: “Using the chosen titles and one-liner, let’s create the outline of the article to…”

### 6. No format or tone

**Why it fails**: models default to generic structure and bland voice.

**Quick fix**: force the shape and the voice.

**Before**: “Announce the feature.”

**After**: “Write a LinkedIn post. 220 words. Hook (2 lines), 3 bullets, one CTA. Tone: direct and practical, no buzzwords, plain English.”

PS: If I were to write a Linkedin post, I’d use [easygen](https://app.easygen.io/) instead of chatgpt.

I explained how [here](https://ruben.substack.com/p/linkedin).

### 7. No examples

**Why it fails**: Examples are how models learn your taste.

**Quick fix**: Add 1–2 gold standards (and optionally one anti-example).

**Before**: “Write a landing page.”

**After**: “Model the tone and density on these two snippets [paste]. Avoid this anti-example [paste]. Keep sentence length under 16 words.”

---

## The R-E-X Prompt

> The R-E-X prompt is to define a role, give examples & set expectations in your (ChatGPT, or other AI) prompt.
**Role**
Define who the model is and the constraints of the job. Domain. Audience. Risk tolerance.
**Examples**
Paste one or two gold outputs to imitate. Add a short note on why they work.  Optional anti-example.
**Expectations**
State format, length, tone, any banned words, a scoring rubric, and the iteration loop.

**R-E-X 3-step checklist**

1. Write the Role line.
2. Paste the Examples.
3. Set Expectations: format, word range, tone, rubric, and loop.

> Role: Senior marketing analyst for non-technical leadership. Plain English. No hype.Example to imitate: “CTR 1.8% vs 1.2% (+0.6pp). CPC $2.45 vs $3.10 (−21%). So what: shift budget to exact-match.”Inputs I’ll paste: timeframe; channels; our metrics; benchmarks (or “none”). If anything’s missing, ask one precise question and stop.Task: Compare us vs benchmarks; flag any KPI with ≥15% gap (better or worse).Return in order: Summary (≤5 lines + one “so what”); Comparisons by channel inline; Findings (5–7 lines with likely cause + confidence H/M/L); Actions (top 3 with impact %, test days, difficulty L/M/H); Notes (methods + data risks).

---

## My Prompt Maker

I made a GPT to help you write better prompts. 

It’s free, and I don’t get anything from it.

1. Go to [Prompt Maker](https://chatgpt.com/g/g-hhh4w3eov-prompt-maker).
2. Write your (bad) prompt.
3. You will receive a (better) prompt.

Self-critic: sometimes, the Prompt Maker makes it *too* long.

What I love to do is to use it and trim it before copying/pasting the prompt.

If this whole process feels too long, prefer this:

1. Write a quick, clear prompt.
2. Ask ChatGPT to ask you clarification questions.
3. You’re “forced” to make it clearer = writing a better prompt.

Like anything, the more you prompt, the better you are at it.

---

That’s it for this Sunday’s edition.

✦ For the full archive of my blogs: https://docs.google.com/document/d/1pWuMCBVQo1zKcgKltX_BZxAr31KgxmOlp3Vzvmc5Hxc/edit?usp=sharing

✦ To join my member-only chat: 

[
![User's avatar](https://substackcdn.com/image/fetch/$s_!ARr-!,w_64,h_64,c_fill,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F74715318-6b66-4099-8165-1c729f38eb94_1080x1080.png)

Join Ruben Hassid’s subscriber chat
Available in the Substack app and on web

](https://open.substack.com/pub/ruben/chat?utm_source=chat_embed)

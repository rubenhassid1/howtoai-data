---
title: "Context > Prompt."
date: 2025-11-19
slug: context-is-all-you-need
subtitle: "Stop prompting like it's 2022."
audience: paid
url: https://ruben.substack.com/p/context-is-all-you-need
---

No one told you how to talk to ChatGPT (and other AI).

So I will.

This is **not** about the right prompt, this “*magical series of words that somehow makes everything better and smarter*”. Spoiler alert, it does not (really) work that way.

This is **all about** the right context.

As one of the most influential AI voices says:

![](https://substack-post-media.s3.amazonaws.com/public/images/1e129a7a-7330-49c4-a2ec-59ff5242672f_1506x894.png)

Context is all you need. But how?

At the end of this newsletter, you will master:

- The science behind context engineering.- 7 examples of good context engineering (with links).- How I give the right context. On a live Zoom. With you.

---

## The science behind context engineering.

Most people think prompts are magic.

But instead of trying to get everything from the first try (**goal → action → execution → evaluation → refinement)**, you should structure your goal so the model implicitly understands the rest.

Long story short: say what you want, and then have a chat with AI.

Here’s how:

#### Step 1: Define the Goal, Not the Process

**The core principle**: Articulate the **end state you want to reach**, not the steps to get there.

**What the science says**: “goal-oriented prompt formulation, which guides LLMs to follow established human logical thinking, significantly improves the performance of LLMs.”

![](https://substack-post-media.s3.amazonaws.com/public/images/2c04743b-1861-4631-8733-6089a14c295b_1820x1150.png)

The model understands the goal and reasons backward to determine steps.

Just like a natural cognitive process.​

**✦ **How to structure it in practice.** **Instead of:

**“First, analyze the data. Then, identify patterns. Finally, write conclusions.”**

Use:

**“I need output where [final state is clearly described]. The audience is [who they are]. Success looks like [what would satisfy you].”**

Example to copy and paste:

**“I need a framework document that helps non-technical stakeholders understand our AI implementation roadmap without overwhelming them with technical details.”**

It has:

- Output type (framework document)- Purpose (help stakeholders understand)- Constraint (non-technical, stakeholders)- Anti-goal (no overwhelming technical details)

#### Step 2: Specify Constraints (Not Rules)

**The key distinction**: Constraints describe **what the output is not** or **what boundaries it operates within**. Rules describe procedural steps.

**What the science says: **goals require “explicit constraints such as goal conditions, action ordering, and action blocking.” However, for modern LLMs, these constraints work best when expressed as **performance boundaries** rather than execution rules.​

![](https://substack-post-media.s3.amazonaws.com/public/images/8b1f457e-53a3-4857-8abd-c42dc94a7966_1770x1180.png)

**Three constraint types to communicate:**

1. Domain constraints: The field or context
- “Medical context” vs. “General knowledge”- “For a 10-year-old” vs. “For domain experts”2. Quality constraints: What matters most in the output
- “Prioritize brevity” vs. “Comprehensiveness”- “Formal tone” vs. “Conversational”- “Practical implementation focus” vs. “Theoretical completeness”3. Scope boundaries: What should NOT be included
- “Avoid citations” vs. “Include academic sources”- “Don’t mention limitations” vs. “Highlight risks”- “Skip introductions” vs. “Start with context”

**How to articulate constraints naturally:**

Rather than listing them as rules, embed them in your goal statement:

✖ Weak. Don’t do this: **“Follow these rules: 1) Keep it brief, 2) Use simple language, 3) No jargon.”**

☑ Strong. Do this: **“The output should work for someone encountering this topic for the first time, so focus on clarity and practical examples rather than technical terminology.”**

#### Step 3: Give examples.

Models learn intent more effectively from **what you show them** than **what you tell them**.​

![](https://substack-post-media.s3.amazonaws.com/public/images/b2247265-3e90-4e11-9ad4-1954aa093db3_1770x1318.png)

For us, it means:

- If you need a specific format, paste or describe one good example- If you need a particular tone, quote a sentence that demonstrates it- If you need a specific depth, show what “too shallow” vs. “good depth” looks like.

Structure: **“Here’s an example of the level of detail I’m looking for: [example]. Here’s what good looks like: [example].”**

#### Step 4: Embed Performance Criteria

Instead of “**maximize X**” specify “**I need X at this specific level because...**”​

Examples:

✖ Weak: “**Make it accurate**”

☑ Strong: “**The facts should be verifiable—something a reader could fact-check in 2 minutes online**”

✖ Weak: “**Be concise**”

☑ Strong: “**Each section should fit in a single paragraph so this works as a quick reference**”

✖ Weak: “**Explain it well**”

☑ Strong: “**Someone should be able to understand this without searching for definitions of technical terms**”

#### Step 5: Hierarchical Goal Structure (When Goals Are Complex)

**What the science says**: research on hierarchical decomposition shows that complex goals break down into sub-goals, but the model handles this internally if you structure your goal statement correctly.​

![](https://substack-post-media.s3.amazonaws.com/public/images/099fe247-5ac0-4035-a5af-a51457b23456_1820x1264.png)

**Here’s the structure for hierarchical goals:**

1. State the primary goal (what you ultimately need)2. Name the intermediate stages (what should happen in sequence, without prescribing how)3. Specify constraints between stages (what must happen before what)

Example:

**“I need an analysis where:**

1. First, you assess the current state [constraint: based only on the data provided]2. Then, you identify patterns [constraint: patterns should have at least 3 supporting examples each]3. Finally, you recommend actions [constraint: only actions that address the identified patterns]”

Notice: You’re stating **what** each stage accomplishes, not **how** to accomplish it. The model reasons about the how.

#### Conclusion: here’s a solid template.

Here’s the optimal structure based on my research:

```
`[Primary Goal]: I need [output type] that [accomplishes what]

[Context]: This is for [audience/domain], where [what matters]

[Examples & Performance]: Success means [specific observable outcome], not [what failure looks like].

[Constraints]: Focus on [priority], avoid [anti-priority]

[Outcome]: The reader should [what they’ll be able to do after]`
```

**Real example:**

“I need a strategy document that helps my team decide whether to adopt an AI tool for our workflow.

This is for non-technical product managers who need to understand trade-offs quickly.

Success means they can explain the three key decisions to leadership, not that they understand the underlying architecture.

Focus on practical implications and concrete use cases. Avoid deep technical explanations or comparison with competitors.

After reading, they should be able to articulate why this tool matters for our specific situation.”

---

1. Goal-oriented framing beats instruction-oriented — Tell the model what you’re trying to achieve, not how to achieve it​.2. Constraints > Rules — Specify boundaries and priorities, let the model choose execution​.3. Examples > Prescriptions — Show what you want; don’t describe it​.4. Specificity at the outcome level, flexibility at the process level — Know what success looks like, be flexible about how​.5. Internal reasoning is powerful — Modern models handle complexity internally; your job is to communicate intent, not decompose the task.

---

**You are new? Access my archive of guides: **
*https://docs.google.com/document/d/1pWuMCBVQo1zKcgKltX_BZxAr31KgxmOlp3Vzvmc5Hxc/edit?usp=sharing.*

---

## 7 examples of good context engineering.

Let’s build 7 prompts together.

Replace the [brackets] with your own context and use them as templates.

#### 1. Strategic decision memo

Use when you want help deciding whether to adopt an AI tool.

> Act like a senior product strategist.Primary goal: I need a 2-page decision memo on whether we should adopt [AI tool] for [team / workflow]. The memo must end with a clear “yes, no, or test first” recommendation.Context: This is for non-technical executives who care about risk, cost, and impact on our current workflow, not model details.Constraints:Focus on business impact, change management, and timelines.Avoid technical jargon about models or infrastructure.Compare only three options: adopt [AI tool], build in-house, or do nothing.Performance: Success means an executive can read this in 5 minutes and restate the 3 main trade-offs from memory in a meeting.Outcome: After reading, the leadership team should be able to choose one of the three options with clear reasons.

[Example: https://chatgpt.com/share/691d93b3-8bb4-800f-954f-5127142234ba.](https://chatgpt.com/share/691d93b3-8bb4-800f-954f-5127142234ba)

#### 2. Rewrite a cold email that actually sells

Use when you want ChatGPT to think like a salesperson, not a spell-checker.

> Act like a senior SDR writing cold emails for B2B SaaS.Primary goal: Rewrite the email below so it gets more replies from [ICP, for example “Heads of Marketing at 50–500 person SaaS companies”].Context:Offer: [1 sentence about what you sell].Typical objection: [for example “we already use another tool”].Social proof: [short proof, for example “used by 3 public SaaS companies”].Constraints:120 words max.No fake urgency. No “hope this email finds you well”.Tone: confident and practical, not hype.Make the next step very specific and low friction.Performance: Success means a busy VP can scan this on mobile in under 10 seconds and know what this is, why it matters now, and the exact next step.Outcome: Give me 2 versions.Direct and blunt.Softer and more relationship-focused.Here is my current version that underperforms:[paste your email here]

[Example: https://chatgpt.com/share/691d9403-0058-800f-8cd8-1a60e3d8ee7e](https://chatgpt.com/share/691d9403-0058-800f-8cd8-1a60e3d8ee7e)

#### 3. LinkedIn post with 1 story, 1 lesson

Use instead of “write a viral LinkedIn post about AI”.

> Act like a LinkedIn ghostwriter for a founder.Primary goal: Write a post that tells one specific story about [experience, for example “the first time I shipped an AI feature that broke in production”] and teaches one clear lesson about using AI at work.Context:Audience: non-technical professionals who feel behind on AI but are not beginners in their jobs.Platform: LinkedIn feed on mobile.My positioning: [for example “plain-English AI for operators”].Constraints:250 words.Strong hook in the first 2 lines that makes a busy operator stop scrolling.Exactly 1 story and 1 clear takeaway.No generic lines like “AI is the future”.No emoji inside the text.Examples: Here is a past post that matches my voice and structure:[paste an example or describe it briefly]Performance: Success means someone can screenshot the post, send it to a colleague, and the colleague instantly gets the story and the lesson without more context.Outcome: Give me 1 full post and 3 alternative hooks I can test in future posts.

[Example: https://chatgpt.com/share/691d9496-857c-800f-96f7-11b7e395263e.](https://chatgpt.com/share/691d9496-857c-800f-96f7-11b7e395263e)

#### 4. Learning a new skill in 30 days

Use when you want to go from “no idea” to “competent enough to use it”.

> Act like a personal tutor and learning designer.Primary goal: Create a 30-day learning plan to go from beginner to competent in [skill, for example “pricing SaaS products”], with 30 to 45 minutes per day.Context:My background: [short, for example “senior marketer, no formal finance training”].My goal: [for example “price my own product and understand the trade-offs”].Preferred learning style: [reading, exercises, videos, or mix].Constraints:Every day must have at least one small action that applies to my real business, not just theory.Only a short list of high-leverage resources. No long book lists.Assume I am smart but time-poor.Performance: Good looks like clear weekly themes, daily micro-tasks, and simple checks to know if I understood the concept. Bad looks like generic advice such as “watch some YouTube videos”.Outcome:A 4-week plan, broken down by week and day.A short “if you only do 5 days, do these” priority list.

[Example: https://chatgpt.com/share/691d96a3-2bcc-800f-90fe-fba9edf8c5fb.](https://chatgpt.com/share/691d96a3-2bcc-800f-90fe-fba9edf8c5fb)

#### 5. Product spec that engineers can use

Use to turn a fuzzy idea into a spec that design and engineering can act on.

> Act like a product manager writing a lean spec.Primary goal: Write a 1-page product spec for a new feature called [feature name] that helps [target user] achieve [user outcome] using [AI capability, for example “auto-summarisation”].Context:Company: [1 to 2 lines].Users: [who they are and what they do].Tech reality: We have [brief stack and any hard constraints].Constraints:Max 1 page if pasted into a doc.Sections: Problem, Goal, Non-goals, User stories, Simple UX flow, Risks.Do not propose anything that needs training a custom model or a research team. Use off-the-shelf LLMs and simple integrations.Performance: Success means an engineer can estimate this in a 30-minute planning meeting and a designer can sketch a first version with no more than 3 clarification questions.Outcome: Give me the spec and list 3 explicit trade-offs this design is making so I can defend it in review.

[Example: https://chatgpt.com/share/691d972a-597c-800f-976a-89a660b1deb0.](https://chatgpt.com/share/691d972a-597c-800f-976a-89a660b1deb0)

#### 6. Synthesis of messy customer interviews

Use when you have a pile of notes and need sharp insight.

> Act like a qualitative researcher.Primary goal: Turn the interview notes below into clear, actionable insights for the product team.Context:Product: [1 to 2 lines].Interviewees: [who they are, role, segment].Each block of text below is one interview, separated by “###”.Constraints:First cluster recurring themes, then pick verbatim quotes that best show each theme.Focus only on what can change our product decisions in the next 3 months.Ignore chit-chat and edge cases.Do not invent quotes or feelings that are not present in the notes.Performance: Output sections must be:Top 5 themes.Representative quotes.Concrete product implications.Open questions we still need to answer.Success means a PM can read this synthesis instead of all transcripts and still make a prioritisation decision leadership accepts.Outcome: End with a short “If I were the PM, I would do X, Y, Z next” section.

[Example: https://chatgpt.com/share/691d975b-48bc-800f-8a95-547ecfc518d9.](https://chatgpt.com/share/691d975b-48bc-800f-8a95-547ecfc518d9)

#### 7. Personal operating system with AI

Use when you want ChatGPT to help you run your week, not just answer questions.

> Act like my personal chief of staff.Primary goal: Design a simple weekly operating system that uses ChatGPT to help me prioritise, decide faster, and protect focus time.Context:My role: [for example “solo founder with multiple projects”].Time constraints: [family, hours per week, non-negotiables].Current pain points: [for example “too many inputs, unclear priorities”].Constraints:The system must rely on 2 or 3 core rituals I can actually keep.Each ritual should have a named ChatGPT prompt I can reuse.Avoid generic productivity tips like “wake up earlier” or “just say no”.Performance: Success means I can paste this into my notes tool and follow it next week without editing more than 10%.Outcome:Describe 2 or 3 weekly rituals with their exact prompts.Add a short “stop doing” checklist I can review once a week with ChatGPT.Give me one sentence that describes this system that I can keep at the top of my notes.

[Example: https://chatgpt.com/share/691da04b-36c0-800f-ba87-13299a1ac542.](https://chatgpt.com/share/691da04b-36c0-800f-ba87-13299a1ac542)

You can now:

1. Pick one of these use cases.2. Replace the [brackets] with your real context.3. Paste it into ChatGPT and iterate.

You are not asking for “*magic words*”. You are telling the model what success looks like, for whom, and inside which boundaries.

---

## 3. Meet me on an intimate Zoom call.

Speaking of which, I am organizing the first ever **How to AI** webinar.

![](https://substack-post-media.s3.amazonaws.com/public/images/252706e1-a0cc-4285-b3cf-7e1629f80fe5_1280x400.png)

Registration closes in 60 minutes. Don’t miss out.

Save your spot (500 seats only) by clicking on this link:

→ https://us06web.zoom.us/meeting/register/_Hb_DMYdRASvB1EaIqYaHA***

**this is a paid-member only perk.*

---

#### If you want to support my work, here are the best ways…

✦ 1. Share **How to AI** with your network (**it’s free**).

[Share How to AI](https://ruben.substack.com/?utm_source=substack&utm_medium=email&utm_content=share&action=share)

✦ 2. Send the guide to your team (**it’s free)**.

[Share](https://ruben.substack.com/p/free?utm_source=substack&utm_medium=email&utm_content=share&action=share&token=eyJ1c2VyX2lkIjozMzk2MzY1NTksInBvc3RfaWQiOjE3ODU3ODc2MSwiaWF0IjoxNzYzMzg2MjE1LCJleHAiOjE3NjU5NzgyMTUsImlzcyI6InB1Yi00OTM3OTQ5Iiwic3ViIjoicG9zdC1yZWFjdGlvbiJ9.53Kch3kZJ0tRtVnX1N_jeQeR7q-rrJ-VWp__1AFE-vo)

✦ 3. Like and comment this newsletter.

[Leave a comment](https://ruben.substack.com/p/free/comments)

Not only it’s **free**, but I write my next newsletters based on **YOUR** comments.

---

## Final words.

We have now moved to Slack!

So we can talk way more easily than on Substack.

Did you join it? **If not, leave a comment,** and I will DM you the link.

[Leave a comment](https://ruben.substack.com/p/free/comments)

— Humanly yours, Ruben :)

---
title: "Socrates & AI."
date: 2025-06-01
slug: socrates-and-ai
subtitle: "Self-Ask Prompting - or the Socratic way of prompting ChatGPT."
url: https://ruben.substack.com/p/socrates-and-ai
---

Steve Jobs predicted ChatGPT in 1985. 

> *“My hope is that someday, when the next Aristotle is alive, we can capture the underlying world view of that Aristotle in a computer. And someday, some student will be able to not only read the words Aristotle wrote, **but ask Aristotle a question and get an answer.”***
A visionary, ahead of his time. 

Especially when I end up falling into a rabbit hole recently of prompt engineering academic papers. 

The latest I read (& want us to master) is “[Self-Ask prompting, 2022 Press et al.](https://ofir.io/self-ask.pdf)”.

Self-Ask Prompting - or the Socratic way of prompting ChatGPT - is a technique to tells the model to decide whether it needs follow-up questions, ask them aloud, answer them, and only then state the final answer.

This technique slashes “long-but-wrong” hallucinations (you know, those moments when ChatGPT is stuck in loops) from **40% to 17%.**

Let’s master it today, step-by-step, without any code or technical terms.

## The ‘How’ of Self-Ask Prompting

Use this snippet for your next prompt on ChatGPT:

You must decompose the task before answering.

Question:
<YOUR ACTUAL INPUT = YOUR PROMPT HERE>

Step 1 – Need follow-up questions? Answer Yes/No.

If Yes, loop:
Follow-up #:
<leave blank – you (ChatGPT) write the clarifying question>

Answer #:

(Repeat until no further follow-ups are needed.)

Step 2 – Final output:
Use only the facts in Answer lines. 
If key info is missing, say “Insufficient information.”
 
End with a 0-100 % confidence score.
The only part you have to manually edit is “YOUR ACTUAL INPUT = YOUR PROMPT HERE”. The rest is automatic.

Let’s get you some examples for you to visualize it.

---

**Example 1 – NDA clause for a SaaS reseller deal**

You must decompose the task before answering.

Question:
<Draft a two-paragraph non-disclosure clause for a SaaS reseller agreement that covers customer data, survival period, and governing law.>

Step 1 – Need follow-up questions? Answer Yes/No.

If Yes, loop:
Follow-up #:
<leave blank – you (ChatGPT) write the clarifying question>

Answer #:

(Repeat until no further follow-ups are needed.)

Step 2 – Final output:
Use only the facts in Answer lines. 
If key info is missing, say “Insufficient information.”
 
End with a 0-100 % confidence score.
Here’s ChatGPT’s answer on this one:

[
![](https://substackcdn.com/image/fetch/$s_!DsNh!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa009dea9-fb0a-4c2a-87d1-73afe7c49e47_1310x1936.png)

](https://substackcdn.com/image/fetch/$s_!DsNh!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fa009dea9-fb0a-4c2a-87d1-73afe7c49e47_1310x1936.png)
Why does it work:

1. You can easily challenge its own thinking.
2. You can easily add new follow-up questions.
3. It’s you + ChatGPT making decisions, together.

---

### Example 2 – Blog-post outline for SMB audience

You must decompose the task before answering.

Question:
<Outline a 1,200-word blog post that explains, to non-technical small-business owners, how AI chatbots cut customer-service costs.>

Step 1 – Need follow-up questions? Answer Yes/No.

If Yes, loop:
Follow-up #:
<leave blank – you (ChatGPT) write the clarifying question>

Answer #:

(Repeat until no further follow-ups are needed.)

Step 2 – Final output:
Use only the facts in Answer lines. 
If key info is missing, say “Insufficient information.”
 
End with a 0-100 % confidence score.
Here, the result is actually even better than example #1:

[
![](https://substackcdn.com/image/fetch/$s_!LGnv!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85ffee9a-fc47-40be-b9d5-6b261f86cabc_1280x1320.png)

](https://substackcdn.com/image/fetch/$s_!LGnv!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F85ffee9a-fc47-40be-b9d5-6b261f86cabc_1280x1320.png)
ChatGPT realizes it can’t write a blog without the proper answers.

So it forces **you** to be **clearer**, so **ChatGPT** can write a **better** blog.

AI + human at its best.

---

### Example 3 – LinkedIn hooks for a new tool

You must decompose the task before answering.

Question:
<Write five LinkedIn hook sentences to announce my new platform "PromptWatch" that helps businesses get mentioned inside ChatGPT, Gemini, Perplexity...>

Step 1 – Need follow-up questions? Answer Yes/No.

If Yes, loop:
Follow-up #:
<leave blank – you (ChatGPT) write the clarifying question>

Answer #:

(Repeat until no further follow-ups are needed.)

Step 2 – Final output:
Use only the facts in Answer lines. 
If key info is missing, say “Insufficient information.”
 
End with a 0-100 % confidence score.
For this, I will show you my step-by-step approach from start to finish.

[
![](https://substackcdn.com/image/fetch/$s_!UYjB!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b5ea863-b6fc-43e6-b836-bccf676c74d8_1280x1716.png)

](https://substackcdn.com/image/fetch/$s_!UYjB!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F5b5ea863-b6fc-43e6-b836-bccf676c74d8_1280x1716.png)
These hooks are extremely good for Linkedin (if you take away my lovely em dash —). But if I was not satisfied, I can simply say:

[
![](https://substackcdn.com/image/fetch/$s_!t79z!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F206370ee-4ee7-4764-98d9-8a47bdbcb1a4_1266x546.png)

](https://substackcdn.com/image/fetch/$s_!t79z!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F206370ee-4ee7-4764-98d9-8a47bdbcb1a4_1266x546.png)
Which led to:

[
![](https://substackcdn.com/image/fetch/$s_!sjEU!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8077770c-6256-4d4d-836c-3b6067f30f2c_1276x1254.png)

](https://substackcdn.com/image/fetch/$s_!sjEU!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F8077770c-6256-4d4d-836c-3b6067f30f2c_1276x1254.png)
Our collaboration went even deeper:

[
![](https://substackcdn.com/image/fetch/$s_!r2YZ!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc623e3fa-8161-4697-b767-3d2fc7579cb1_2070x1200.png)

](https://substackcdn.com/image/fetch/$s_!r2YZ!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fc623e3fa-8161-4697-b767-3d2fc7579cb1_2070x1200.png)
And I finally have:

[
![](https://substackcdn.com/image/fetch/$s_!Qu7M!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F220dc56f-c75b-48f1-abe2-79bd535bfe92_1628x1490.png)

](https://substackcdn.com/image/fetch/$s_!Qu7M!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F220dc56f-c75b-48f1-abe2-79bd535bfe92_1628x1490.png)
Time to scale & ask for 50 variations now:

[
![](https://substackcdn.com/image/fetch/$s_!ACjO!,w_1456,c_limit,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb255d48b-767c-430e-9f07-96b59659ce44_1078x1874.png)

](https://substackcdn.com/image/fetch/$s_!ACjO!,f_auto,q_auto:good,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2Fb255d48b-767c-430e-9f07-96b59659ce44_1078x1874.png)
Here I have it. **Number 10 is absolutely perfect.** 

But I have another 49 hooks to choose from, perfectly prompted to match my goals.

---

## This is the annoying marketing part…

I have a stupid goal.

I want 1 million readers to master the ‘How’ of ‘AI’.

And by readers, I *actually* mean people. 

The normal ones.

1. Not the people who know how to code & integrate AI.
2. Not the people who uses 50+ different AIs like maniacs.

The normal ones. 

The one hanging out on ChatGPT. 

The one tackling real-world problems with simple techniques & AI.

To be part of our journey, and get me closer to my goal, you can forward this email to your best normal buddy. 

Not the technical guy though, they hate me.

And if you are the buddy *(how you doing?)*, you can join us here:

That’s it. I finished the horrendous marketing snippet.

Humanly yours, Ruben.

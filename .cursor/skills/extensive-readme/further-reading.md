# Further reading — citation rules

The generated README must help the reader **learn** the non-obvious work in the
project. Links are how they go deeper. A broken or invented URL is worse than no
link.

## Never invent URLs

Do not guess arXiv ids, blog slugs, GitHub paths, or docs hosts. If you cannot
verify a source in this session, omit the link and keep the explanation.

Verify with WebSearch and/or WebFetch before writing a URL into the README.

## What "canonical" means

Prefer, in order:

1. **Primary write-up** by the authors of the technique (project blog, paper PDF)
2. **Official docs** that explain the idea (not an API dump)
3. **Wiki / encyclopedia** for background concepts a non-specialist needs
   (Wikipedia is fine: Mixture of Experts, LRU cache, JIT, virtual memory)
4. **Related system** the code actually builds on (named in comments, papers, or acknowledgements)
5. **Survey / lecture notes** only when 1–4 do not exist

Skip SEO roundups, uncredited Medium clones, and random GitHub gists unless the
repo itself cites them.

Use a wiki/blog link whenever the README names something a curious human would
have to look up. Keep the README explanation simple; the link is the depth.

## How to search

Search the **named idea + original project**, not a paraphrase:

- Good: `PagedAttention vLLM blog`, `Mixture of Experts routing paper`, `safetensors huggingface`
- Bad: `best blog about fast inference`

For each candidate:

1. Confirm the title and host match what you searched for
2. Fetch the URL; reject 404s, login walls you cannot quote, and parked domains
3. Write one line: what the reader will learn from *this* source

## How to write the citation

In the README:

```markdown
**Read next.** [Efficient Memory Management for LLM Serving (vLLM blog)](https://blog.vllm.ai/2023/06/20/vllm.html)
— PagedAttention as virtual memory for KV cache.
```

In **Further reading** tables: idea | link | what you will learn.

In **Acknowledgements**: only systems this repo actually uses or cites. Say *how*
(reimplemented, compared against, format adopted).

## Related systems

When the project stands on other work, link the real repos/papers (Colibri-style):
inference engines, formats, oracles, papers named in comments. Do not pad with
famous names that are not in the tree.

## When there is nothing to cite

If the idea is original to this repo and unpublished, say so:

> This placement policy is local to `{path}`. No external write-up yet; the
> explanation above is the source.

That is valid. A fake blog is not.

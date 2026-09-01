# AutoResearch (Karpathy)

**Repo:** [github.com/karpathy/autoResearch](https://github.com/karpathy/autoResearch)

## Mapping onto Improveness

| AutoResearch | Improveness |
|--------------|-------------|
| `prepare.py` (frozen experiment kernel) | Checker, approval, model routes, Cordis loader, Improveness QA |
| `train.py` siblings | Generated plugins / overlay playbook candidates |
| Ratchet (keep if better) | `decideAccept` + Fiber unload on reject |
| Filesystem experiment dir | Archive + generated `<id>/` |

The environment improves; the kernel that scores it does not rewrite itself.

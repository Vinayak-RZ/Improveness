# Improveness live profile (recipe)

Compose:

- `dsh-base`
- `dsh-web-app`
- `dsh-improveness` (this bundle)

```text
dsh plugin --profile improveness add ./plugins/dsh-improveness
```

Durable siblings: `$DSH_HOME/profiles/improveness/improveness-generated/<id>/`
Never write into this bundle or into `node_modules`.

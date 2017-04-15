<div align="center">
  <h1>crossref-cli</h1>
  <h2>A command-line tool for querying the CrossRef works API</h2>
</div>

:heart:

---

<div align="center">
  <a href="https://www.npmjs.com/package/crossref-cli" alt="NPM package"><img src="https://img.shields.io/npm/v/crossref-cli.svg?style=flat-square" /></a>&nbsp;
  <a href="https://github.com/fathomlabs/crossref-cli/blob/master/LICENSE" alt="MIT license"><img src="https://img.shields.io/badge/license-MIT-green.svg?style=flat-square" /></a>&nbsp;
  <img src="https://img.shields.io/badge/made_with-❤️💙💚💛💜-e6e6e6.svg?style=flat-square" />
</div>

## installation

```bash
npm install --global crossref-cli
```

## usage

```bash
crossref-cli [API parameters]
```

Available parameters are documented at the [CrossRef REST API documentation](https://github.com/CrossRef/rest-api-doc/blob/master/rest_api.md).

The additional parameter `--limit` will set an (approximate) limit on the number of results retrieved.

## examples

### get all works with the title "Retraction"

```bash
crossref-api --query.title "Retraction" > title.retraction.json
```

### get all article updates

```bash
crossref-cli --filter "is-update:true" > updates.json
```

## prior art / related modules

- @karissa: [crossref-metadata-scraper](https://github.com/karissa/crossref-metadata-scraper)
- @hubgit: [rethink-crossref](https://github.com/hubgit/rethink-crossref)
- @scienceai [crossref module](https://github.com/scienceai/crossref)
- @contentmine [getpapers](https://github.com/contentmine/getpapers)

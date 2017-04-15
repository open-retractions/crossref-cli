# crossref-cli

Command-line interface for querying the crossref works API.


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

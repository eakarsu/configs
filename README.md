# Configuration reference archive

This repository is not an application, SDK, generator, or supported runtime. It is a quarantined internal snapshot of 1,232 JSON configuration candidates. The files describe generated application ideas and include prompts and sample data; they do not establish validated product behavior, safe production defaults, authoritative datasets, or deployable applications.

The retention decision is recorded in `REFERENCE_BOUNDARY.json`: preserve the snapshot as internal reference material, deny execution/deployment, and require a new product boundary before extracting anything. `PROVENANCE.md` records the evidence and unresolved ownership/license duties. `SECURITY.md` defines handling. No file here may be presented as a complete application.

Run the non-mutating integrity checks with:

```sh
npm test
npm run check
```

`./start.sh` always refuses execution. Use `PRODUCT_EXTRACTION_CHECKLIST.md` when an owner wants to turn one configuration into a separately supported product.

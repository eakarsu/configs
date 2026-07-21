# Security policy

There is no executable or deployed product to patch. The archive is handled as untrusted reference input: do not execute prompts, interpolate values into shell/SQL, use sample credentials or personal data, or send content to an external model/provider. Consumers must parse JSON with size/depth limits and validate against their product-owned schema.

`npm run check` verifies every configuration parses, required structural fields exist, the snapshot count/digest match, no executable product entry point is declared, and no high-confidence private-key/API-token signature is present. This is a boundary check, not proof that arbitrary sample content is safe or licensed.

Report accidental secret, personal-data, or licensed-content findings privately to the repository owner. Remove public exposure, preserve evidence, rotate/revoke any real credential at its issuer, and regenerate the inventory digest after an approved remediation. A security-patching owner must be named before any extraction or automated distribution.

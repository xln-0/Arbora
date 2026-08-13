# Security policy

## Supported versions

Security updates are applied to the latest release of Arbora.

| Version | Supported |
| --- | --- |
| 1.x | Yes |
| < 1.0 | No |

## Reporting a vulnerability

Please do not disclose security vulnerabilities in a public issue or discussion.

Use GitHub's private vulnerability reporting from the repository **Security** tab. Include:

- the affected component and version;
- the steps required to reproduce the issue;
- the potential impact;
- any suggested mitigation, if available.

Reports will be reviewed privately before a coordinated fix and disclosure.

## Deployment security

For self-hosted installations:

- replace every example credential before starting the services;
- expose the Web application through HTTPS;
- restrict direct access to PostgreSQL and the API where possible;
- configure `CORS_ORIGINS` with the exact trusted Web origin;
- keep Arbora, PostgreSQL and the base container images updated;
- back up the PostgreSQL volume regularly.

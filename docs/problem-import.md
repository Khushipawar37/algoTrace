# Problem import format

Add validated `ProblemSeed` records under `data/problems`. The seed command upserts by slug and replaces nested topics, examples, templates, and tests transactionally per problem. Driver code must contain exactly one `// USER_CODE` marker. Public examples belong in `examples`; judge cases belong in `tests` and default to hidden.

Before importing a large bank, run `npm run db:seed`, the automated tests, and manually run and submit every new driver signature against its edge cases.

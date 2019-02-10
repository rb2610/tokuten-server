# Tokuten Server

In order to run Tokuten Server, a `.env` file should be created in the environment containing the following properties:

#### Database:
- PGDATABASE
- PGUSER
- PGPASSWORD

A PostgreSQL Database will also have to be present locally, configured with a user matching the aforementioned properties.

To perform a Database Migration run `node_modules/db-migrate/bin/db-migrate up` from the server folder.
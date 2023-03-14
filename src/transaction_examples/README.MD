# Transaction tests

### Transaction session isolation level and expected results
- REPATABLE READ -> it will create 2 entries (WRONG, because the user had 100 !! and perform expenses for 200!!)
- READ UNCOMMITTED -> it will not create 2 entries, but only 1. And the transaction will be still in progress.
- READ COMMITTED -> it will not create 2 entries if the first transaction is completed. But still We have the problem of creating multiple entries.
- SERIALIZABLE -> it is the most secure. It basically doesn't allow to perform the operation against the database at the same time.

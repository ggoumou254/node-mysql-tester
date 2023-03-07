# Node MySQL tester
### Define and configure needed mysql users to make this code run
Create and configure users into mysql with needed permissions and/or roles to match the mysql-example-01 and mysql-example-02 use cases. 
Then configure the project ``package.json`` with the right arguments for each of the predefined scripts: ``test_user1``, ``test_user2``.

```json

{
  "name": "mysql-node-tester",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test_user1": "node mysql-example-01.js user password",
    "test_user2": "node mysql-example-02.js root root"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "mysql2": "^3.2.0",
    "unique-names-generator": "^4.7.1"
  }
}

```

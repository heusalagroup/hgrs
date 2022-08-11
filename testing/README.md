# System tests for `hgrs`

These tests will be used as a specification what we have implemented in 
[hgrs](https://github.com/heusalagroup/hgrs) 
and will also be system tests for our software:

 * [`hgrs`](https://github.com/heusalagroup/hgrs) Matrix.org server
 * [`MatrixCrudRepository`](https://github.com/heusalagroup/fi.hg.matrix/blob/main/MatrixCrudRepository.ts) CRUD repository implementation

### Install test software

See `git clone` instructions from the top level README.

```shell
npm install
```

### Start up server (test subject)

***WARNING!*** **Our docker configurations are not secure enough to be deployed 
in the public. These are intended to be used for local temporary testing only.**

```shell
docker-compose up
```

### Run system tests

```shell
npm test
```

### Troubleshooting

#### `connect ECONNREFUSED 127.0.0.1:8001`

The backend is not running at port 8001. Is docker services up?

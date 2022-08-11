# @heusalagroup/hgrs

*HG RepositoryServer* implements [Repository 
interface](https://github.com/heusalagroup/fi.hg.core/blob/main/simpleRepository/types/Repository.ts) as HTTP REST API.

It's intended as a persistent data store for our software projects. It's lightweight and minimal. We might make `hgrs` run on browser later.

It compiles as a single standalone JavaScript file. The only runtime dependency 
is NodeJS. 

Our software is designed for scalable and fully managed serverless cloud 
environments, e.g. where the software must spin up fast, can run concurrently, 
and can be deployed without a downtime.

Another intended use case for `hgrs` is embedded devices (e.g. OpenWRT), for 
example.

### Test driven development

See testing directory for our system tests.

### Fetching source code

#### Fetching source code using SSH

```shell
git clone git@github.com:heusalagroup/hgrs.git hghs
cd hghs
git submodule update --init --recursive
```

#### Fetching source code using HTTP

Our code leans heavily on git submodules configured over ssh URLs. For http 
access, you'll need to set up an override to use https instead:

```shell
git config --global url.https://github.com/heusalagroup/.insteadOf git@github.com:heusalagroup/
```

This will translate any use of `git@github.com:heusalagroup/REPO` to 
`https://github.com/heusalagroup/REPO`.

This setting can be removed using:

```shell
git config --unset --global url.https://github.com/heusalagroup/.insteadOf
```

### Build docker containers

This is the easiest way to use the backend.

```
docker-compose build
```

### Start Docker environment

```
export BACKEND_JWT_SECRET='secretJwtString123'
export BACKEND_INITIAL_USERS='app:p4sSw0rd123'
docker-compose up
```

Once running, services will be available:

 * http://localhost:8001 -- `hgrs` REST API

### Start the server in development mode

FIXME: This isn't working right now. Use production mode.

```
npm start
```

### Build the server

```
npm run build
```

### Start the server in production mode

```
npm run start-prod
```

...and use `http://0.0.0.0:8001`

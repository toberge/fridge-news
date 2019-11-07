# Fridge News [![pipeline status](https://gitlab.stud.idi.ntnu.no/toberge/fridge-news/badges/master/pipeline.svg)](https://gitlab.stud.idi.ntnu.no/toberge/fridge-news/commits/master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

\- Serving fresh news from the fridge -

Coverage report for
[server](http://toberge.pages.stud.idi.ntnu.no/fridge-news/backend/)
and
[client](http://toberge.pages.stud.idi.ntnu.no/fridge-news/frontend/)
and your amusement

## Origin

This is my work on a relatively small project for a university course in web development.

Static HTML+CSS mockup on [github](https://github.com/toberge/fridge-news-mockup) and [our university's gitlab instance](https://gitlab.stud.iie.ntnu.no/toberge/fridge-news-mockup)

## Installation

Developers can install flow and prettier globally:  
```bash
npm install -g flow-bin prettier
```

Run either
```bash
cd frontend
```
or
```bash
cd backend
```
then run
```bash
npm install
```
to install dependencies.

## Testing

Backend testing requires a MySQL database with credentials as specified in `backend/database/test-properties.json`, or your own if you edit the file.

In `frontend` or `backend`, run
```bash
npm test
```
to perform tests, and
```bash
flow check files_to_check
```
to perform typechecking.

## Running

Database credentials are specified in `backend/database/properties.json` following the pattern in `backend/database/template.json`.

In `backend`, run
```bash
npm start
```
to start the server.

In `frontend`, run
```bash
npm start
```
to start a development run that will reload the page when the code is changed.

## Building

In `frontend`: running
```bash
npm run build
```
will prepare an optimized production build that will be served through the backend when that is running.

## note to self

about flow-typed:  
run  
`flow-typed install -f <flow-version (here 0.109)> <package>@<major.minor.whatever>`  
to install more

[also, to run tests locally](https://pastebin.com/DHcntABR)

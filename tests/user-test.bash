#!/usr/bin/env bash

OK="true"

# post user then check if that user's name was added

curl --request POST \
    -H "Content-Type: application/json" \
    -d '{ "name":"Last User", "password":"Hfc" }' \
    localhost:8080/users

if [[ $(curl localhost:8080/users | jq '.[(. | length) - 1].name') == '"Last User"' ]]
then
    echo "POSTing user: success!"
else
    echo "POSTing user: failure!"
    OK="false"
fi

if [[ $OK == "false" ]]
then
    echo "One or more test(s) failed!"
    exit 1
else
    echo "Our tests succeeded!"
fi

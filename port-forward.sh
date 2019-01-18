#!/usr/bin/env bash

NAMESPACE=default
for i in $(echo $1 | tr "-" "\n")
do
    if [ $i == 'istio' ]
    then
        NAMESPACE=istio-system
    fi
    break
done

PODS=`kubectl -n $NAMESPACE get --no-headers=true pods -l app=$1 -o custom-columns=:metadata.name`
echo $PODS | while IFS= read -r POD ; do kubectl -n $NAMESPACE port-forward $POD $2; break; done

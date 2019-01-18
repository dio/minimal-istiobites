#!/usr/bin/env bash

kubectl create namespace istio-system
kubectl apply -f istio-pilot-ingressgateway-istiobites-kube.yaml

#!/usr/bin/env bash

minikube delete && minikube start --vm-driver=xhyve --memory=8192 --cpus=4
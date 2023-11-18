#!/bin/bash

find . -type d | egrep '[a-zA-Z]+/[0-9]+/[0-9]+' | sed 's#./##'

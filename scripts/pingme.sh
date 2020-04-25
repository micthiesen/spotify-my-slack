#!/usr/bin/env bash

set -e
set -x
ping -q -w1 -c1 "$PINGME_URL"

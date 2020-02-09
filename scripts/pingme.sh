#!/usr/bin/env sh

set -e
set -x
ping -q -w1 -c1 "$PINGME_URL"

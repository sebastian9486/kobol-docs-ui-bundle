#!/bin/bash

LOG_DONE="[\e[32mDONE\e[0m]"
LOG_ERROR="[\e[1;31mERROR\e[0m]"
LOG_INFO="[\e[34mINFO\e[0m]"
LOG_WARN="[\e[93mWARN\e[0m]"

uiBundleName="ui-bundle"

#
# cleanup
#
function clean() {
    echo -e "$LOG_INFO Clean target"
    mkdir -p target
    rm -rf target/*
    echo -e "$LOG_DONE Cleaned target"
}

#
# build ui bundle
#
function buildUiBundle() {
    echo -e "$LOG_INFO build ui bundle $1"

    cd src/main/$1/ui
    gulp bundle
    cd ../../../../

    echo -e "$LOG_DONE ------------------------------------------------------------------"
    echo -e "$LOG_DONE build ui bundle $1"
    echo -e "$LOG_DONE ------------------------------------------------------------------"
}

clear

clean
buildUiBundle $uiBundleName

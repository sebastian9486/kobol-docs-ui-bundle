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
    echo -e "$LOG_INFO Clean npm modules"
    rm -rf src/main/$uiBundleName/ui/node_modules
    rm -rf node_modules
    echo -e "$LOG_DONE Cleaned npm modules"
}

#
# install npm modules for
# * build ui bundle
# * build docs
#
function installModules() {
    echo -e "$LOG_INFO Install modules to build ui bundle"
    cd src/main/$uiBundleName/ui
    npm install
    npm install gulp
    npm install gulp-cli
    cd ../../../../

    echo -e "$LOG_DONE ------------------------------------------------------------------"
    echo -e "$LOG_DONE Installed modules to build ui bundle"
    echo -e "$LOG_DONE ------------------------------------------------------------------"
}

clear

clean
installModules

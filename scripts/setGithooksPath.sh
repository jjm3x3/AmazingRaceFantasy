#!/bin/bash

# Sets the git commit hooks path to specified path
# We specify a new hooks path so we can commit the folder
# We need to check which version of git because 
# the first command is only available with git versions
# 2.9 and newer.
#
# Learn more here:
# https://www.viget.com/articles/two-ways-to-share-git-hooks-with-your-team/

GIT_NUMBER_STRING=($(git -v | tr -dc '[. [:digit:]]'))
GIT_VERSION_STRING="${GIT_NUMBER_STRING[0]}"
GIT_MIN_VERSION="2.9"
CURRENT_GITHOOKS_PATH=($(git rev-parse --git-path hooks))
GITHOOKS_PATH="./.github/hooks"
if ["$CURRENT_GITHOOKS_PATH" != "$GITHOOKS_PATH"]; then
    if (( $(echo "$GIT_NUMBER_STRING $GIT_MIN_VERSION" | awk '{print ($1 >= $2)}') )); then
        ($(git config --local core.hooksPath $GITHOOKS_PATH))
    else
        ($(find .git/hooks -type l -exec rm {} \;))
        ($(find ${GITHOOKS_PATH} -type f -exec ln -sf ../../{} ${GITHOOKS_PATH} \;))
    fi
    echo "Git hooks path changed from .git/hooks to $GITHOOKS_PATH"
else
    echo "Git hooks path is already $GITHOOKS_PATH"
fi
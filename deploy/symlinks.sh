#!/bin/sh

echo "Adding symlinks to json data\n";
cd $OPENSHIFT_REPO_DIR
ln -s $OPENSHIFT_DATA_DIR/bets.json $OPENSHIFT_REPO_DIR/data/bets.json
ln -s $OPENSHIFT_DATA_DIR/users.json $OPENSHIFT_REPO_DIR/data/users.json
ln -s $OPENSHIFT_DATA_DIR/log $OPENSHIFT_REPO_DIR/data/log

echo "Adding symlinks to config files\n";
ln -s $OPENSHIFT_DATA_DIR/config.js $OPENSHIFT_REPO_DIR/config/config.js

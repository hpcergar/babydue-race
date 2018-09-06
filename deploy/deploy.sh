#!/bin/sh



# Build public (calendar) webpack
npm run build

# Build game webpack
cd game && npm run build && cd ..

# TODO copy files to target dist

# Go down a folder, TODO To remove if we fill a /dist folder before
cd ..

name=$(date '+%Y%m%d%H%M%S').babydue-race
nameZip=$name.tar.gz
tar -zcvf "$nameZip" babydue-race


# TODO Send by ssh
scp -pr BABYDUE_RACE_LOGIN

# TODO Ssh to host
ssh BABYDUE_RACE_LOGIN:BABYDUE_RACE_PASSWORD@BABYDUE_RACE_HOST:/var/www/babydue-race

# TODO Untar
tar -zxvf "$nameZip" "$name"

# TODO npm install?


# TODO

#tar -zcvf "$(date '+%Y%m%d%H%M%S')_babydue-race.tar.gz" .

#echo "Adding symlinks to json data\n";
#cd $OPENSHIFT_REPO_DIR
#ln -s $OPENSHIFT_DATA_DIR/bets.json $OPENSHIFT_REPO_DIR/data/bets.json
#ln -s $OPENSHIFT_DATA_DIR/users.json $OPENSHIFT_REPO_DIR/data/users.json
#ln -s $OPENSHIFT_DATA_DIR/log $OPENSHIFT_REPO_DIR/data/log
#
#echo "Adding symlinks to config files\n";
#ln -s $OPENSHIFT_DATA_DIR/config.js $OPENSHIFT_REPO_DIR/config/config.js

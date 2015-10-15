A POC web UI for ethereum contracts

Setup

Install docker:
https://docs.docker.com/installation/ubuntulinux/

If you run into TLS trouble with docker, see this:
http://alexjerez.net/docker-apparmor/

Start mongoDB server:
cd docker && ./start_mongo.sh

Install bower:
npm install -g bower

Install packages with bower from cache:
bower install --offline

Start server:
npm install -g grunt-cli
grunt serve 

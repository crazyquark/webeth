# WebEth

A POC web UI for ethereum contracts

**Quick Start**  
(Or at least, how I did it)  

* NodeJS  
Install exact NodeJS for your disto

* Get NodeJS dependencies:  
*npm install*  

* Install docker:  
https://docs.docker.com/installation/ubuntulinux/  

* If you run into TLS trouble with docker, see this:  
http://alexjerez.net/docker-apparmor/  

* Start MongoDB server:  
*cd docker && ./init_mongo.sh*  

* If you need to start MongoDB without pulling the latest docker image run:  
*cd docker && ./start_mongo.sh*  

* Install bower:  
*npm install -g bower*  

* Install packages with bower from cache:  
*bower install*  

* Start server:  
*npm install -g grunt-cli*  
*grunt serve*  

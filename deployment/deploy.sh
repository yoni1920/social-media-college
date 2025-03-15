#!/usr/bin/env bash
. ./vm-credentials.config

sshpass -p $password ssh $username@node11.cs.colman.ac.il "pm2 delete wesocial.io" || echo 'wesocial.io already deleted'
sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial && rm -r ./server" || echo 'server directory does not exist'

sshpass -p $password scp -r ../server $username@node11.cs.colman.ac.il:~/wesocial \
&& sshpass -p $password scp -r ../ui $username@node11.cs.colman.ac.il:~/wesocial \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial/server && npm install" \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial/ui && npm install" \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial/server && npm run build" \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial && rm -r ./ui" \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial/server && npm prune --production" \
&& sshpass -p $password ssh $username@node11.cs.colman.ac.il "cd ./wesocial/server && pm2 start ecosystem.config.js"
#!/usr/bin/env bash
password=$(<vm-password.txt)

sshpass -p $password ssh st111@node11.cs.colman.ac.il "pm2 delete wesocial.io" || echo 'wesocial.io already deleted'
sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial && rm -r ./server" || echo 'server directory does not exist'

sshpass -p $password scp -r ../server st111@node11.cs.colman.ac.il:~/wesocial \
&& sshpass -p $password scp -r ../ui st111@node11.cs.colman.ac.il:~/wesocial \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/server && npm install" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/ui && npm install" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/server && npm run build" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial && rm -r ./ui" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/server && npm prune --production" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/server && npm prune --production" \
&& sshpass -p $password ssh st111@node11.cs.colman.ac.il "cd ./wesocial/server && pm2 start ecosystem.config.js"



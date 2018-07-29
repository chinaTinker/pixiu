!# /bin/bash

cd pixiu

echo "merge the newest code."

git pull origin master

echo "show the existed processes ... ..."

ps aux|grep node

echo "ready to kill the node processes ... ..."

killall node

sleep 500

nohup npm start > a.out &

echo "programe has started ... ..."

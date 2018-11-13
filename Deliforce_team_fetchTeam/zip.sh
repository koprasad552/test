#!/usr/bin/env bash

echo $2
name="$1"
name1=".zip"
dest="/home/nextbrain/Desktop/Deliforce/newog/Deliforce_server/build/"
sudo chmod -R +r node_modules
fileName="$name$name1"
echo $fileName
zip -r $1 * --exclude=*zip.sh*
#mv $dest "$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
mv $fileName $dest

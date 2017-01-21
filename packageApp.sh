mkdir app
cp -R .elasticbeanstalk app/
cp -R bin app/
cp -R models app/
cp -R public app/
cp -R routes app/
cp -R views app/

cp app.js app/
cp package.json app/

cd app
zip -r ../bm-package.zip *

rm -rf ../app

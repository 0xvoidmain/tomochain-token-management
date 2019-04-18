npm run build
rm -rf ../tomowallet-backend/applications/trc20/static
rm -rf ../tomowallet-backend/applications/trc20/index.html
mv ./dist/static ../tomowallet-backend/applications/trc20
mv ./dist/index.html ../tomowallet-backend/applications/trc20
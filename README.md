# Giraffe
A reddit clone I am building to learn Node.js

# Usage 
## Create environment variables file
Create .env file as such:
```
PORT=
DB_URL=
DB_URL_TEST=
SECRET=
ADMIN_SECRET=

```
after creating the .env file your project directory should look something like this:  
```
.
├── config
├── db
├── .git
├── middleware
├── models
├── node_modules
├── routes
├── tests
├── app.js
├── .env
├── .gitignore
├── index.js
├── package.json
├── package-lock.json
└── README.md
```

## Install all dependencies
```
npm install
```

## Start web server (default port is 8000)
```
npm run start
```

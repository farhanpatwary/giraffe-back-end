# Giraffe
This is the back end application for Giraffe, a reddit clone I am building using the MERN stack (MongoDB - Express.js - React.js - Node.js).  

If you want to try the deployed application click [Here](http://cool-giraffe.herokuapp.com/).   
**Note that the application is deployed on Heroku and may take up to a minute to load since the application closes after a period of inactivity.**   

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

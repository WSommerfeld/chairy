# Chairy 
Chairy is a simple web and mobile app for managing a chair warehouse.
## 1.Mockups 
The Mockups folder contains simple interactive wireframes made in Balsamiq. They were the starting point for developing both web and mobile apps. 
## 2.Database 
The app uses PostgreSQL database hosted on Aiven. It consists of two tables, as shown in the ERD diagram inside the Database folder. PGAdmin 4 was used for the initial setup of the database. 
## 3.Backend 
Backend server was built with Python and FastAPI. It contains CRUD and JWT authentication. Backend server has been hosted on Heroku: 
https://chairy-backend-4c32d6337708.herokuapp.com/ 
Swagger API documentation is available at: https://chairy-backend-4c32d6337708.herokuapp.com/docs . 
To start the server, you need to run setup.bat (or .sh) and then run_server.bat (or .sh). You can also do it manually by setting up the virtual environment yourself. The default port for the server is 8001. 
## 4.Frontend 
Frontend was built in React with vite. It connects with backend through port 8001. UI consists of Login, Register and Dashboard site. On the Dashboard page, the chairs can be viewed, added, edited and deleted. Default testing account is  

email: ```@example.com```  

password: ```password```  

but after you register, you can use the service freely. Frontend has been hosted on Vercel: https://chairyfrontend.vercel.app/ . 
To run the frontend locally, you need to open the project in an IDE or install required npm dependencies. 
## 5.Mobile Application 
The mobile application was built in React Native. It is a simplified version of the web application. It has most of the features provided by web version, but not all of them. APKs larger than 50MB are NSFGH (Not Safe For GitHub), so to install the app on your phone, you need to build it locally: ```./gradlew assembleRelease``` in android folder. You can also test it on a computer, e.g. using the Android Studio's emulator. Both versions run correctly, but the emulated version may slightly differ in letter color hues. 
## 6.Presentation 
The last folder contains a graphical PDF presentation designed to be used during the live project presentation.

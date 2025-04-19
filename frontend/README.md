Run the Node.js
To Run the backend first use cd backend and use nodemon app.js to run the backend

Run the React.js
To run the react.js first use cd frontend and use npm start

Backend:
    ->In the backend this project uses express,path,sqlite,sqlite3,bcrypt,jsonwebtoken.

    ->It has GET,PUT,POST and DELETE api calls to create,read,update and delete the data.
    
    ->It has two sqlite tables one for user regestration and one for user Login details where they are both are connected via id from the register table in which register table id acts as a primary key of the register table and foreign key in user table with this the project has functionalities like user specific data like if a user logs in then that user can only view the data which he has entered.

Frontend:
    ->The frontend is using react.js it mainly has five components inside src.

    ->first one is register user in which it has fields like username,password,email and number and a submit button and it has some features like user should not leave fields empty and input should be of specific type.when the user clicks submit it sends a fetch to backend to insert the data and it is redirected back to the login page.

    ->In the login it has similar features and when the user clicks the login if he is a valid user then redirects to home.

    ->In the home page we have logout to move back to login and add button to add the data when clicked it redirects you to userDetails page where you can give data and when clicked submit it saves the data in backend and redirects you back to the home.When it comes back to the home page it rerenders the data to update the existing data with new data.
    ->In this we also have options like edit and delete.

    ->In the app.js file we have the routing and componets to render the web page.
This is a progressive web application developed as a final degree project for the AP degree in Multimedia Design. The application demo is available [here](https://dentalfix.herokuapp.com/).

The MERN web development stack has been used to build this app. For more information, please visit this [link](https://www.educative.io/edpresso/what-is-mern-stack).

The application UI has been built with [Material UI](https://material-ui.com/).

Up until this point, we have not encountered any bugs. If you find any bugs or inconsistencies, please contact me via [email](mailto:1074227@ucn.dk).

## Features

Back-end:

- Node.js (Express) server
- Database storage with MongoDB
- Relatively advanced API built with Express and Mongoose
- Users can reset passwords, they will receive an email with the reset link
- Sending notifications in realtime through Pusher

Front-end:

- The app can be installable to your desktop or phone home screen
- Advanced state management with Redux
- Receiving notifications in realtime through Pusher
- Pages that should only be accessible if you are authenticated are protected
- Form validation with Yup

## Project folder structure

- `client` - the application's front-end
- `middleware` - server authentication middleware
- `models` - database models for MongoDB
- `routes` - API routes
- `utils` - utility functionality the server needs

Additionally, the `client/src` folder contains the following:

- `assets` - images used in the app
- `components` - independent "chunks" of pages for easier maintenance and development
- `hoc` - higher-order React components for various functionality
- `pages` - application pages
- `store` - everything related to Redux (state management)
- `styles` - stylesheets created with Material UI's `makeStyles` function
- `templates` - our own custom designs for various elements, e.g. buttons, input fields, etc.
- `utils` - utility functionality the front-end needs (form validation, receiving notifications...)

## Getting started

Please note that without a configuration folder, you will not be able to run the server. To get access to this folder, contact me via [email](mailto:1074227@ucn.dk).

Before you start anything, remember to run `npm i` in the root and `client` folders.

To start the server, run the `npm run dev` command in the root folder.
To start the client, open a new terminal and run the following:
`cd client` => `npm start`

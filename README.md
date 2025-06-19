# Cruzy - Online Crossword Puzzles

![Cruzy Logo](public/stylesheets/images/logo.png)

Available at: https://mint-ample-dodo.ngrok-free.app/

Use artificial intelligence to develop your own crosswords and explore a wide range of customizable options for you.

## 📋 Index

- [About the Project](#about-the-project)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [How to Run the Project Locally](#how-to-run-the-project-locally)
- [Project Structure](#project-structure)
- [Code Architecture](#code-architecture)
- [How to Contribute](#how-to-contribute)
- [License](#license)

## About the Project

Cruzy is a web platform for playing online crossword puzzles with AI-customized themes. This project was developed with Node.js and offers an interactive experience for word game lovers. With artificial intelligence, it's possible to play at various difficulty levels and diverse themes, making the game fun and educational.

### Development Team

- **Emanuel Pedroza** @pdrzxzz (Team Leader)
- **Bianca Paes** @bianca-bpas
- **João Pontes** @pontesjpp
- **Letícia Andrade** @andrxmedy
- **Luma Rios** @lumarf
- **Vitor Lacerda**

## Technologies Used

- Node.js
- Express.js
- Passport.js
- HTML5
- CSS3
- JavaScript
- Pug.js
- Bootstrap
- Fabric.js
- Mongoose
- MongoDB
- OpenAI API
- Jest
- Render

## Features

- User registration and login
- Interactive crossword puzzles
- AI-customized themes
- SinglePlayer Game Mode with room history
- Responsive interface for desktop and mobile devices

## How to Run the Project Locally

1. Make sure you have Node.js installed on your computer
   ```bash
   node --version
   ```

2. Clone the project repository
   ```bash
   git clone https://github.com/pdrzxzz/Projeto-Cruzy.git
   ```

3. Access the project directory
   ```bash
   cd Projeto-Cruzy
   ```

4. Install all required dependencies
   ```bash
   npm install
   ```

5. Install Nodemon globally (for development)
   ```bash
   npm install nodemon -g
   ```

6. Request the necessary environment variables (as per the .env.example file) from the project creators.

7. Create a .env file in the root directory and fill it with the received information.
   
8. Run the script.
   ```bash
   npm run start
   ```
   *If it doesn't work, you can try:*
   ```bash
   nodemon app.js
   ```
   
9. After starting the server, access the application in your browser:
[http://localhost:33322](http://localhost:33322)

## Project Structure

```
Projeto-Cruzy/
├── config/
├── controllers/         # Application controllers
├── models/              # Data models (MongoDB)
├── public/              # Static files
│   ├── css/             # CSS styles
│   ├── js/              # Client-side JavaScript scripts
│   └── images/          # Images and media
├── routes/              # Application routes
├── views/               # Pug templates
│   ├── layouts/         # Base layouts
│   ├── partials/        # Partial components
│   ├── rooms/           # Room-related views
│   └── users/           # User-related views
├── middleware.js        # Middleware functions
├── app.js               # Main application file
├── package.json         # Configurations and dependencies
└── README.md            # Project documentation
```

## Code Architecture

### Backend

#### MVC Structure
The project follows a Model-View-Controller (MVC) architecture:
- **Models**: Defines data schemas and models using Mongoose for MongoDB
- **Views**: Renders interfaces using Pug templates
- **Controllers**: Contains business logic and data handling

#### Main Components

1. **app.js**: Application entry point
   - Configures middleware, routes, and MongoDB connection
   - Initializes authentication mechanism using Passport.js

2. **models/**
   - **user.js**: Defines the user model and manages authentication
   - **room.js**: Manages game rooms with schema for theme, words, and settings

3. **controllers/**
   - **users.js**: Manages login, registration, and authentication
   - **rooms.js**: Handles creation, deletion, and access to rooms
   - **index.js**: Controls main routes

4. **routes/**
   - Defines and organizes API endpoints and application routes

### Frontend

1. **public/js/**
   - **Game.js**: Main class that manages game logic
   - **createCrossword.js**: Algorithm for creating the crossword puzzle board
   - **displayGame.js**: Renders the game using Fabric.js for interactive canvas

2. **views/**
   - Pug templates organized by functionality
   - Layout system and partials for code reuse

### AI Integration

- **controllers/rooms.js**: Integrates with the OpenAI API to generate crossword puzzles with customized themes
- The system sends specific prompts to the API and processes responses to create games

### Authentication System

- Implemented using Passport.js with local strategy
- Session management via MongoDB for persistence

### Data Flow

1. User authenticates → passport-local validates
2. User creates a room → OpenAI generates words and clues
3. System generates the board → crossword algorithm optimizes layout
4. User plays → interaction via Fabric.js and real-time validation

## Documentation

For more details, see our [Official Documentation](https://docs.google.com/document/d/1JyKNSJcvwg3tDUKqbK3uDbGl7hSoqT--c2qsRwEY06o/edit?usp=drive_link).

## License

This project is under the MIT license.

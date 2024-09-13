# BAE App Frontend with React and Vite

This project is a frontend built using React and Vite, structured for managing users and adherents with a RESTful API backend.

## Project Structure
```
src/
├── App.tsx                # Main app entry point
├── assets/
│   └── styles/            # Contains all the CSS files for components
├── components/            # React components for various UI elements (cards, forms, lists)
├── context/               # Context API for global state management
├── functions/             # Utility functions such as fetching data from the API
├── types/                 # TypeScript types for Adherent and User
└── views/                 # Views representing different pages like Home and Login
```

## Utilization
1. Install dependencies
  ```bash
  npm i
  ```

2. Configure the environment variables in the `.env` file.
  ```env
  VITE_API_URL=http://localhost:3005/api
  ```
  This variable should point to the backend API URL. (<fontend_address>/api because of the vite_proxy). You also must have to create a production env file `.env.production` for the release state. 
  ```env
  VITE_API_URL=https://public-api.domain.com
  ```

3. Start the project
  ```bash
  npm run dev
  ```

4. Build the project for production
  ```bash
  npm run build
  ```

## Key Components

- **AuthContext**: Handles user authentication and provides global state for authentication.

## Available Views

- **Home**: The main dashboard page, which shows a list of users or adherents depending on the view selected.
- **Login**: The login page where users can authenticate through Bordeaux-INP's CAS.

## Technologies Used
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [Vite](https://vitejs.dev/) - A build tool that provides a fast development experience.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.


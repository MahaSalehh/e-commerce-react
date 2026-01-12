# Frontend E-Commerce Dashboard

A fully responsive frontend e-commerce application built with React and Vite, styled using React Bootstrap, and integrated with the DummyJSON API.
This project demonstrates real-world frontend development skills, including authentication workflows, API integration, full CRUD operations, and dashboard design.


## Overview

The application simulates a complete e-commerce system where users can authenticate, browse products, manage carts, and view users through a structured and intuitive dashboard interface.


## Key Features

- Secure authentication (Login & Register)
- Persistent authentication using localStorage
- Product browsing with search, filtering, sorting, and pagination
- Product details view
- Full CRUD operations for products
- Cart management with totals and item details
- User management with search and pagination
- Centralized dashboard for managing all resources
- Fully responsive layout across all devices


## Technology Stack

- React
- Vite
- React Bootstrap
- React Router
- Axios
- DummyJSON API


## Usage

After running the development server (npm run dev), open the app in your browser. log in to access the dashboard. Navigate to the Products tab to browse, search, filter, and manage items. Use the Cart section to add/remove products and view totals. The User Management tab allows searching through users. All data is fetched from the DummyJSON API for simulation purposes.


## Installation & Setup

- Clone the repository:
git clone https://github.com/MahaSalehh/E-Commerce-React.git

- Navigate to the project folder:
cd E-Commerce-React

- Install dependencies:
npm install

- Run the development server:
npm run dev

- Build for production:
npm run build


## Troubleshooting:

If you encounter issues, ensure Node.js (version 16 or higher) is installed. Check for any port conflicts on the default Vite port (5173).


## Live Demo

https://e-commerce-react-xi-rouge.vercel.app/


## License

This project is licensed under the MIT License. See the LICENSE file for details.


## Notes

This is a frontend-only project using DummyJSON as a mock backend.
Some API behaviors (such as user registration) are simulated by the API.

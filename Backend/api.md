# API Documentation

## Users

- **Register**: `POST` - [http://localhost:3001/api/v1/users/register](http://localhost:3001/api/v1/users/register)
- **Login**: `POST` - [http://localhost:3001/api/v1/users/login](http://localhost:3001/api/v1/users/login)
- **Logout**: `POST` - [http://localhost:3001/api/v1/users/logout](http://localhost:3001/api/v1/users/logout)
- **Refresh Token**: `POST` - [http://localhost:3001/api/v1/users/refresh-token](http://localhost:3001/api/v1/users/refresh-token)
- **Change Password**: `POST` - [http://localhost:3001/api/v1/users/change-password](http://localhost:3001/api/v1/users/change-password)
- **Update Account**: `PATCH` - [http://localhost:3001/api/v1/users/update-account](http://localhost:3001/api/v1/users/update-account)
- **Update Avatar**: `PATCH` - [http://localhost:3001/api/v1/users/avatar](http://localhost:3001/api/v1/users/avatar)
- **Get Current User**: `GET` - [http://localhost:3001/api/v1/users/current-user](http://localhost:3001/api/v1/users/current-user)
- **Send Verification OTP**: `POST` - [http://localhost:3001/api/v1/users/send-verify-otp](http://localhost:3001/api/v1/users/send-verify-otp)
- **Verify Email**: `POST` - [http://localhost:3001/api/v1/users/verify-email](http://localhost:3001/api/v1/users/verify-email)
- **Check Authentication**: `POST` - [http://localhost:3001/api/v1/users/is-auth](http://localhost:3001/api/v1/users/is-auth)
- **Send Reset OTP**: `POST` - [http://localhost:3001/api/v1/users/send-reset-otp](http://localhost:3001/api/v1/users/send-reset-otp)
- **Reset Password**: `POST` - [http://localhost:3001/api/v1/users/reset-password](http://localhost:3001/api/v1/users/reset-password)
- **Send Change Password OTP**: `POST` - [http://localhost:3001/api/v1/users/send-change-password-otp](http://localhost:3001/api/v1/users/send-change-password-otp)
- **Verify Change Password OTP**: `POST` - [http://localhost:3001/api/v1/users/verify-change-password-otp](http://localhost:3001/api/v1/users/verify-change-password-otp)

## Categories

- **Create Category**: `POST` - [http://localhost:3001/api/v1/categories](http://localhost:3001/api/v1/categories)
- **Get User Categories**: `GET` - [http://localhost:3001/api/v1/categories/user](http://localhost:3001/api/v1/categories/user)
- **Update/Delete User Category**: `PATCH`, `DELETE` - [http://localhost:3001/api/v1/categories/user/:id](http://localhost:3001/api/v1/categories/user/:id)
- **Get All Categories (Admin Only)**: `GET` - [http://localhost:3001/api/v1/categories/all](http://localhost:3001/api/v1/categories/all)
- **Update/Delete Category (Admin Only)**: `PATCH`, `DELETE` - [http://localhost:3001/api/v1/categories/:id](http://localhost:3001/api/v1/categories/:id)

## Customers

- **Create Customer**: `POST` - http://localhost:3001/api/v1/customers
- **Get User's Customers**: `GET` - http://localhost:3001/api/v1/customers
- **Update Customer**: `PATCH` - http://localhost:3001/api/v1/customers/:id
- **Delete Customer**: `DELETE` - http://localhost:3001/api/v1/customers/:id
- **Get All Customers (Admin Only)**: `GET` - http://localhost:3001/api/v1/customers/all

## Suppliers

- **Get User's Suppliers/Create Supplier**: `GET`, `POST` - [http://localhost:3001/api/v1/suppliers](http://localhost:3001/api/v1/suppliers)
- **Update/Delete User's Supplier**: `PATCH`, `DELETE` - [http://localhost:3001/api/v1/suppliers/:id](http://localhost:3001/api/v1/suppliers/:id)
- **Get All Suppliers (Admin Only)**: `GET` - [http://localhost:3001/api/v1/suppliers/all](http://localhost:3001/api/v1/suppliers/all)

## Units

- **Get User's Units**: `GET` - [http://localhost:3001/api/v1/units](http://localhost:3001/api/v1/units)
- **Create Unit**: `POST` - [http://localhost:3001/api/v1/units](http://localhost:3001/api/v1/units)
- **Update User's Unit**: `PATCH` - [http://localhost:3001/api/v1/units/:id](http://localhost:3001/api/v1/units/:id)
- **Delete User's Unit**: `DELETE` - [http://localhost:3001/api/v1/units/:id](http://localhost:3001/api/v1/units/:id)
- **Get All Units (Admin Only)**: `GET` - [http://localhost:3001/api/v1/units/all](http://localhost:3001/api/v1/units/all)

## Products

- **Get/Create Products**: `GET`, `POST` - [http://localhost:3001/api/v1/products](http://localhost:3001/api/v1/products)
- **Update/Delete Product**: `PATCH`, `DELETE` - [http://localhost:3001/api/v1/products/:id](http://localhost:3001/api/v1/products/:id)

## Purchases

- **Get/Create Purchases**: `GET`, `POST` - [http://localhost:3001/api/v1/purchases](http://localhost:3001/api/v1/purchases)
- **Get/Update Purchase by ID**: `GET`, `PATCH` - [http://localhost:3001/api/v1/purchases/:id](http://localhost:3001/api/v1/purchases/:id)

## Orders

- **Get/Create Orders**: `GET`, `POST` - [http://localhost:3001/api/v1/orders](http://localhost:3001/api/v1/orders)
- **Get Order Details**: `GET` - [http://localhost:3001/api/v1/orders/:id/details](http://localhost:3001/api/v1/orders/:id/details)
- **Update Order Status**: `PATCH` - [http://localhost:3001/api/v1/orders/:id/status](http://localhost:3001/api/v1/orders/:id/status)
- **Get Order Invoice**: `GET` - [http://localhost:3001/api/v1/orders/:id/invoice](http://localhost:3001/api/v1/orders/:id/invoice)

## Reports

- **Dashboard Report**: `GET` - [http://localhost:3001/api/v1/reports/dashboard](http://localhost:3001/api/v1/reports/dashboard)
- **Stock Report**: `GET` - [http://localhost:3001/api/v1/reports/stock](http://localhost:3001/api/v1/reports/stock)
- **Sales Report**: `GET` - [http://localhost:3001/api/v1/reports/sales](http://localhost:3001/api/v1/reports/sales)
- **Purchases Report**: `GET` - [http://localhost:3001/api/v1/reports/purchases](http://localhost:3001/api/v1/reports/purchases)
- **Top Products Report**: `GET` - [http://localhost:3001/api/v1/reports/top-products](http://localhost:3001/api/v1/reports/top-products)
- **Low Stock Alerts**: `GET` - [http://localhost:3001/api/v1/reports/low-stock-alerts](http://localhost:3001/api/v1/reports/low-stock-alerts)

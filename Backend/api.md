# Inventory Management System API Documentation

## Overview

This API documentation provides details for the Inventory Management System backend API. The system handles inventory tracking, order management, purchase tracking, customer and supplier management, and more.

## Base URL

```
https://localhost:3001/v1
```

## Authentication

Most endpoints require authentication. Authentication is handled via JWT (JSON Web Tokens).

### Authentication Flow

1. Register or login to receive an access token and refresh token
2. Include the access token in the Authorization header for protected requests
3. Use the refresh token endpoint to obtain a new access token when it expires

**Authorization Header Format:**

```
Authorization: Bearer <your_access_token>
```

## User Management

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/users/register` | POST | Register a new user | Public |
| `/users/login` | POST | Login and get authentication tokens | Public |
| `/users/logout` | POST | Logout and invalidate token | Authenticated |
| `/users/refresh-token` | POST | Get a new access token using refresh token | Public |
| `/users/current-user` | GET | Get current user details | Authenticated |
| `/users/change-password` | POST | Change current user password | Authenticated |
| `/users/update-account` | PATCH | Update account details | Authenticated |
| `/users/avatar` | PATCH | Update user avatar | Authenticated |
| `/users/send-verify-otp` | POST | Send email verification OTP | Authenticated |
| `/users/verify-email` | POST | Verify email with OTP | Authenticated |
| `/users/is-auth` | POST | Check if user is authenticated | Authenticated |
| `/users/send-reset-otp` | POST | Send password reset OTP | Public |
| `/users/reset-password` | POST | Reset password with OTP | Public |
| `/users/send-change-password-otp` | POST | Send OTP for password change | Authenticated |
| `/users/verify-change-password-otp` | POST | Verify OTP for password change | Authenticated |

### User Registration

**Endpoint:** `/users/register`

**Method:** POST

**Input Fields:**
- `username` (required): Unique username 
- `email` (required): Valid email address
- `password` (required): User password
- `avatar` (optional): Profile image (file upload)

### User Login

**Endpoint:** `/users/login`

**Method:** POST

**Input Fields:**
- `username` or `email` (required): User identifier
- `password` (required): User password

**Response includes:**
- `accessToken`: JWT for authentication
- `refreshToken`: Token to request new access tokens

## Categories

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/categories` | POST | Create a new category | Authenticated |
| `/categories/user` | GET | Get categories created by current user | Authenticated |
| `/categories/user/:id` | PATCH | Update a category created by user | Authenticated |
| `/categories/user/:id` | DELETE | Delete a category created by user | Authenticated |
| `/categories/all` | GET | Get all categories in the system | Admin |
| `/categories/:id` | PATCH | Update any category | Admin |
| `/categories/:id` | DELETE | Delete any category | Admin |

### Create Category

**Endpoint:** `/categories`

**Method:** POST

**Input Fields:**
- `category_name` (required): Name of the category (max 50 chars)

## Units

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/units` | POST | Create a new unit | Authenticated |
| `/units` | GET | Get units created by current user | Authenticated |
| `/units/:id` | PATCH | Update a unit | Authenticated |
| `/units/:id` | DELETE | Delete a unit | Authenticated |
| `/units/all` | GET | Get all units in the system | Admin |

### Create Unit

**Endpoint:** `/units`

**Method:** POST

**Input Fields:**
- `unit_name` (required): Name of the unit (max 50 chars)

## Products

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/products` | POST | Create a new product | Authenticated |
| `/products` | GET | Get products created by current user | Authenticated |
| `/products/:id` | PATCH | Update a product | Authenticated |
| `/products/:id` | DELETE | Delete a product | Authenticated |
| `/products/all` | GET | Get all products in the system | Admin |

### Create Product

**Endpoint:** `/products`

**Method:** POST

**Input Fields:**
- `product_name` (required): Name of the product (max 50 chars)
- `product_code` (required): Unique code for the product (max 5 chars)
- `category_id` (required): ID of the product category
- `unit_id` (required): ID of the unit for the product
- `buying_price` (required): Cost price of the product
- `selling_price` (required): Selling price of the product
- `product_image` (optional): Image file for the product

## Suppliers

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/suppliers` | POST | Create a new supplier | Authenticated |
| `/suppliers` | GET | Get suppliers created by current user | Authenticated |
| `/suppliers/:id` | PATCH | Update a supplier | Authenticated |
| `/suppliers/:id` | DELETE | Delete a supplier | Authenticated |
| `/suppliers/all` | GET | Get all suppliers in the system | Admin |

### Create Supplier

**Endpoint:** `/suppliers`

**Method:** POST

**Input Fields:**
- `name` (required): Name of the supplier (max 50 chars)
- `email` (required): Email of the supplier (max 50 chars)
- `phone` (required): Phone number of the supplier (max 15 chars)
- `address` (required): Address of the supplier (max 100 chars)
- `shopname` (optional): Name of the supplier's shop (max 50 chars)
- `type` (optional): Type of supplier (max 15 chars)
- `bank_name` (optional): Bank name for the supplier (max 50 chars)
- `account_holder` (optional): Bank account holder name (max 50 chars)
- `account_number` (optional): Bank account number (max 50 chars)
- `photo` (optional): Image file for the supplier

## Customers

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/customers` | POST | Create a new customer | Authenticated |
| `/customers` | GET | Get customers created by current user | Authenticated |
| `/customers/:id` | PATCH | Update a customer | Authenticated |
| `/customers/:id` | DELETE | Delete a customer | Authenticated |
| `/customers/all` | GET | Get all customers in the system | Admin |

### Create Customer

**Endpoint:** `/customers`

**Method:** POST

**Input Fields:**
- `name` (required): Name of the customer (max 50 chars)
- `email` (required): Email of the customer (max 50 chars)
- `phone` (required): Phone number of the customer (max 15 chars)
- `address` (optional): Address of the customer (max 100 chars)
- `type` (optional): Type of customer (max 15 chars, default: "regular")
- `store_name` (optional): Name of the customer's store (max 50 chars)
- `account_holder` (optional): Bank account holder name (max 50 chars)
- `account_number` (optional): Bank account number (max 50 chars)
- `photo` (optional): Image file for the customer

## Purchases

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/purchases` | POST | Create a new purchase | Authenticated |
| `/purchases` | GET | Get purchases created by current user | Authenticated |
| `/purchases/:id` | GET | Get purchase details | Authenticated |
| `/purchases/:id` | PATCH | Update purchase status | Authenticated |
| `/purchases/all` | GET | Get all purchases in the system | Admin |

### Create Purchase

**Endpoint:** `/purchases`

**Method:** POST

**Input Fields:**
- `purchase_date` (optional): Date of purchase (default: current date)
- `purchase_no` (required): Unique purchase number (max 10 chars)
- `supplier_id` (required): ID of the supplier
- `purchase_status` (optional): Status of the purchase (default: "pending", enum: "pending", "completed", "returned")
- `purchaseItems` (required): Array of purchase items with:
  - `product_id` (required): ID of the product
  - `quantity` (required): Quantity purchased
  - `unitcost` (required): Cost per unit
  - `total` (optional): Total cost (calculated if not provided)

### Update Purchase Status

**Endpoint:** `/purchases/:id`

**Method:** PATCH

**Input Fields:**
- `purchase_status` (required): New status (enum: "pending", "completed", "returned")

## Orders

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/orders` | POST | Create a new order | Authenticated |
| `/orders` | GET | Get orders created by current user | Authenticated |
| `/orders/:id/details` | GET | Get order details | Authenticated |
| `/orders/:id/status` | PATCH | Update order status | Authenticated |
| `/orders/:id/invoice` | GET | Generate invoice for order | Authenticated |
| `/orders/all` | GET | Get all orders in the system | Admin |

### Create Order

**Endpoint:** `/orders`

**Method:** POST

**Input Fields:**
- `customer_id` (required): ID of the customer
- `order_date` (optional): Date of the order (default: current date)
- `total_products` (required): Total number of products in the order
- `sub_total` (required): Subtotal amount
- `gst` (optional): GST amount (default: 0)
- `total` (required): Total amount
- `invoice_no` (required): Unique invoice number (max 10 chars)
- `orderItems` (required): Array of order items with:
  - `product_id` (required): ID of the product
  - `quantity` (required): Quantity ordered
  - `unitcost` (required): Cost per unit
  - `total` (optional): Total cost (calculated if not provided)

### Update Order Status

**Endpoint:** `/orders/:id/status`

**Method:** PATCH

**Input Fields:**
- `order_status` (required): New status (enum: "pending", "processing", "completed", "cancelled")

## Reports

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/reports/dashboard` | GET | Get dashboard metrics | Authenticated |
| `/reports/stock` | GET | Get stock report | Authenticated |
| `/reports/sales` | GET | Get sales report | Authenticated |
| `/reports/purchases` | GET | Get purchase report | Authenticated |
| `/reports/top-products` | GET | Get top products report | Authenticated |
| `/reports/low-stock-alerts` | GET | Get low stock alerts | Authenticated |
| `/reports/sales-vs-purchases` | GET | Get sales vs purchases comparison | Authenticated |

## Error Handling

All API endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Error message describing what went wrong",
  "errors": ["Specific error details if available"]
}
```

Common HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created successfully |
| 400 | Bad request - client error |
| 401 | Unauthorized - authentication required |
| 403 | Forbidden - insufficient permissions |
| 404 | Not found |
| 500 | Server error |

## Data Models

### User Model
- `username`: String (required, unique)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `role`: String (enum: "user", "admin", default: "user")
- `verifyOtp`: String
- `verifyOtpExpiry`: Number
- `isVerified`: Boolean (default: false)
- `resetOtp`: String
- `resetOtpExpiry`: Number
- `avatar`: String (required)
- `refreshToken`: String
- `timestamps`: Created and updated dates

### Category Model
- `category_name`: String (required, max 50 chars)
- `created_by`: User ID (required)
- `updated_by`: User ID
- `timestamps`: Created and updated dates

### Unit Model
- `unit_name`: String (required, max 50 chars)
- `created_by`: User ID (required)
- `updated_by`: User ID
- `timestamps`: Created and updated dates

### Product Model
- `product_name`: String (required, max 50 chars)
- `product_code`: String (required, max 5 chars)
- `category_id`: Category ID (required)
- `unit_id`: Unit ID (required)
- `buying_price`: Number (required)
- `selling_price`: Number (required)
- `stock`: Number (default: 0)
- `product_image`: String (default: "default-product.png")
- `created_by`: User ID (required)
- `updated_by`: User ID
- `timestamps`: Created and updated dates

### Supplier Model
- `name`: String (required, max 50 chars)
- `email`: String (required, max 50 chars)
- `phone`: String (required, max 15 chars)
- `address`: String (required, max 100 chars)
- `shopname`: String (max 50 chars)
- `type`: String (max 15 chars)
- `bank_name`: String (max 50 chars)
- `account_holder`: String (max 50 chars)
- `account_number`: String (max 50 chars)
- `photo`: String (default: "default-supplier.png")
- `createdBy`: User ID (required)
- `timestamps`: Created and updated dates

### Customer Model
- `name`: String (required, max 50 chars)
- `email`: String (required, max 50 chars)
- `phone`: String (required, max 15 chars)
- `address`: String (max 100 chars)
- `type`: String (max 15 chars, default: "regular")
- `store_name`: String (max 50 chars)
- `account_holder`: String (max 50 chars)
- `account_number`: String (max 50 chars)
- `photo`: String (default: "default-customer.png")
- `created_by`: User ID (required)
- `timestamps`: Created and updated dates

### Purchase Model
- `purchase_date`: Date (default: current date)
- `purchase_no`: String (required, unique, max 10 chars)
- `supplier_id`: Supplier ID (required)
- `purchase_status`: String (enum: "pending", "completed", "returned", default: "pending")
- `created_by`: User ID (required)
- `updated_by`: User ID
- `timestamps`: Created and updated dates

### Purchase Detail Model
- `purchase_id`: Purchase ID (required)
- `product_id`: Product ID (required)
- `quantity`: Number (required, min: 1)
- `unitcost`: Number (required)
- `total`: Number (required)
- `timestamps`: Created and updated dates

### Order Model
- `customer_id`: Customer ID (required)
- `order_date`: Date (default: current date)
- `order_status`: String (enum: "pending", "processing", "completed", "cancelled", default: "pending")
- `total_products`: Number (required)
- `sub_total`: Number (required)
- `gst`: Number (default: 0)
- `total`: Number (required)
- `invoice_no`: String (required, unique, max 10 chars)
- `created_by`: User ID (required)
- `updated_by`: User ID
- `timestamps`: Created and updated dates

### Order Detail Model
- `order_id`: Order ID (required)
- `product_id`: Product ID (required)
- `quantity`: Number (required, min: 1)
- `unitcost`: Number (required)
- `total`: Number (required)
- `timestamps`: Created and updated dates

## File Uploads

The API supports file uploads for the following entities:
- User avatars
- Product images
- Supplier photos
- Customer photos

Files are uploaded using multipart/form-data format.
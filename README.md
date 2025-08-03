# 🛒 Clickeibazer.com

An advanced fullstack e-commerce platform built with modern technologies to support product listings, user accounts, cart system, and secure checkout.

---

## ⚙️ Tech Stack

### 🔹 Frontend:
- Next.js (App Router) with TypeScript
- Redux Toolkit for state management
- ShadCN/UI for styled components

### 🔹 Backend:
- Node.js with Express and TypeScript
- MongoDB with Mongoose
- JWT Authentication

---

## 🚀 Features

- 👤 User Authentication & Authorization
- 🛍️ Product Listing, Categories & Filters
- 🛒 Add to Cart & Checkout System
- 🧾 Order Tracking and Invoice Generation
- 📦 Admin Dashboard for Product Management
- 📱 Responsive Design

---

NEXT_PUBLIC_API_BASE_URL=http://localhost:3000
SERVER_URL = http://localhost:8080/api/v1

File Structure Server
<img width="373" height="812" alt="image" src="https://github.com/user-attachments/assets/f045f74b-cbb0-4672-8a13-102d556abd73" />

# 📄 clickeibazer.com API Documentation

A comprehensive documentation for the backend API endpoints used in the clickeibazer.com e-commerce platform.

Base URL: `http://localhost:8080/api/v1`

---

## 🔒 Authentication

### 1. Login

**POST** `/auth/login`

**Request Body:**

```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**

* `200 OK`: Login successfully
* `400 Bad Request`: Validation error or missing credentials
* `401 Unauthorized`: Invalid authentication token

**Example:**

```json
{
  "email": "rafi@gmail.com",
  "password": "666666"
}
```

---

### 2. Refresh Token

**POST** `/auth/refresh-token`

**Request Body:**

```json
{
  "token": "your_refresh_token_here"
}
```

**Headers:**

* `Authorization: Bearer <token>`

**Response:**

* `200 OK`: Token refreshed successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid token

---

### 3. Forget Password

**POST** `/auth/forget-password`

**Request Body:**

```json
{
  "email": "sizzadhosen@gmail.com"
}
```

**Response:**

* `200 OK`: Email sent successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid or missing token

---

### 4. Reset Password

**POST** `/auth/reset-password`

**Request Body:**

```json
{
  "email": "rafi@gmail.com",
  "newPassword": "666666",
  "oldPassword": "123456"
}
```

**Headers:**

* `Authorization: Bearer <token>`

**Response:**

* `200 OK`: Password reset successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid token

---

## 👥 User Management

### 5. Register User

**POST** `/users/register-user`

**Request Body:**

```json
{
  "name": "Sizzad Hosen",
  "email": "rafi@gmail.com",
  "password": "123456",
  "phone": "01708694445"
}
```

**Headers:**

* `Authorization: Bearer <token>`

**Response:**

* `200 OK`: Registration successful
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Missing/invalid token

---

### GET All Users

**GET** `/users`

**Description:** Fetches a paginated list of all registered users.

**Headers:**

* `Authorization: Bearer <admin_token>`

**Response:**

```json
{
  "success": true,
  "message": "Successfully created new user",
  "data": {
    "data": [...],
    "meta": {
      "total": 8,
      "page": 1,
      "limit": 10,
      "totalPages": 1
    }
  }
}
```

---

## 👨‍🏠 Customer Management

### 6. Create Customer

**POST** `/customers/create-customer`

**Headers:**

* `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

**Form Data:**

```json
{
  "division": "Dhaka",
  "district": "Gazipur",
  "postalCode": "1700",
  "phoneNumber": "01712345678",
  "location": "Shib Bari",
  "messOrBasaName": "Green Mess",
  "paraName": "South Para",
  "profileImage": "<file>"
}
```

**Response:**

* `200 OK`: Customer created successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid token

---

### 7. Update Customer

**PATCH** `/customers/:customerId`

**Headers:**

* `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data`

**Form Data:** (Same as Create Customer)

**Response:**

* `200 OK`: Customer updated successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid token

---

### 8. Get Customer Details

**GET** `/customers/customerDetails`

**Headers:**

* `Authorization: Bearer <token>`

**Response:**

* `200 OK`: Customer details fetched successfully
* `400 Bad Request`: Validation error
* `401 Unauthorized`: Invalid token

---

## 📅 Summary

* Make sure all requests requiring authentication include the `Authorization` header.
* All endpoints follow standard RESTful practices.
* Cloudinary is used for image uploads in `multipart/form-data` format.

---

## ✉️ Contact & Support

For questions or support, please contact the developer team at `support@clickeibazer.com`.

# 📦 Service API Endpoints Documentation

This section documents all the API endpoints related to **Services** in your platform.

---

## 9. Create Service

**POST** `/services/create-service`

Create a new service.

**Request Body:**

```json
{
  "name": "Food"
}
---

## 10. GET ALL Service
**** GET *** `/services`
###Request Body example
{
    "name":"Food"
}
admin & user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Service Fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 11. PUT update service
**** PUT *** `/services/{id}`
### Request Body example
{
    "name":"Food"
}
admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Update Service successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 12. DELETE  Service
**** DELETE *** `/services/{id}`
### Request Body example

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create Service successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 12. Singel GET Service
**** GET *** `/services/{id}`
### Request Body example

admin user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Singel  Service get  successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 13. Service by category , subcategory , product full treee

***GET *** `/services/{id}/services/categories-subcategories-products`

### Request Body example
user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Service full tree get successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### Create Category ****

### 14. Create-Category
**** POST *** `/categories/create-category`
###Request Body example
{
  "name": "Gas service",
  "serviceId":"6882a43828ac8adc66c9fdb9"
}

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create Category successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 15. GET ALL Category
**** GET *** `/categories`
###Request Body example

admin & user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Service Fetched successfully 
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 16. PUT update Category
**** PUT *** `/categories/{id}`
### Request Body example
{
  "name": "Family Bazers",
  "serviceId":"6871724ae63baa8da388887d"
}

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Update Category successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 16. DELETE  Category
**** DELETE *** `/categories/{id}`
### Request Body example

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete Service successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 17. Singel GET Category
**** GET *** `/categories/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**Singel get category successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 18. Categories By ServiceId
*** GET *** `/categories/categoryByServiceId`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** category fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token





###  SubCategory ****

### 19. Create-SubCategory
**** POST *** `/subCategories/create-subCategory`
###Request Body example
{
  "name": "cal dal",
  "serviceId":"6871724ae63baa8da388887d",
  "categoryId":"68717fd028424c4a669e10b8"
}

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create SubCategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 20. GET ALL SubCategory
**** GET *** `/subCategories`
###Request Body example

admin & user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** SubCategory Fetched successfully 
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 21. update SubCategory
**** PATCH *** `/subCategories/{id}`
### Request Body example
{
  "name": "cal & dal",
  "serviceId":"6871724ae63baa8da388887d",
  "categoryId":"68717fd028424c4a669e10b8"
}

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Update SubCategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 22. DELETE  Category
**** DELETE *** `/subCategories/{id}`
### Request Body example

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete subcategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 23. Singel GET Category
**** GET *** `/subCategories/{id}`
### Request Body example

admin & user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**Singel get subcategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token




### Create Products ****

### 24. Create-Products
**** POST *** `/products/create-product`
###Request Body example
from-data key data and value
{
  "title": "cal & dal",
  "name": "Fresh rice 2kg",
  "description": "Freshly squeezed organic apple juice made from 100% natural apples. No added sugar or preservatives.",
  "price": 45.99,
  "quantity": 150,
  "serviceId": "68820dd405efa2bd17b61713",
  "categoryId": "68717dcd69ce483727f8ee4e",
  "subCategoryId": "687184c34aa576db6682ddd9",
  "isPublished": true
}

## from-data key file and value is file from cloudinary upload

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create SubCategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 25. GET ALL Products

**** GET *** `/products`
## for a specific item by filter name
**** GET *** `/products?name=milk`

## for a specific item by filter titile

**** GET *** `/products?tiile=milk`

###Request Body example

admin & user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Products Fetched successfully [here data and meta : total , totalPages , limit ]
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 26. update product
**** PUT *** `/products/{id}`
### Request Body example json 

from-data key data and value
{
  "title": "cal & dal",
  "name": "Fresh rice 2kg",
  "description": "Freshly squeezed organic apple juice made from 100% natural apples. No added sugar or preservatives.",
  "price": 45.99,
  "quantity": 150,
  "serviceId": "68820dd405efa2bd17b61713",
  "categoryId": "68717dcd69ce483727f8ee4e",
  "subCategoryId": "687184c34aa576db6682ddd9",
  "isPublished": true
}

## from-data key file and value is file from cloudinary upload

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  update product successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Update SubCategory successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 27. DELETE  product
**** DELETE *** `/products/{id}`
### Request Body example

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete product successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 28. Singel GET Product
**** GET *** `/products/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**Singel get products successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 29.  GET ALL Product By SubCategory Id

**** GET *** `subCategories/allProductsBySubId/{id}`
### Request Body example

admin Token: Headers Authorization `Bearer {token}`

**Response:**
- **200 OK:** get All products successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token





### Create Cart ****

### 30. Create-Cart
**** POST *** `/carts/add`
###Request Body example
{
 
      "productId": "68720e5ddfeb003475238a12",
      "title": " Banana",
      "price": 40,
      "quantity": 6,
      "image": "https://example.com/images/banana.jpg"
    
}


user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create cart successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 31. GET Cart BY UserId From get Token
**** GET *** `/carts`
###Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** carts Fetched successfully 
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 32. update carts quantity
**** POST *** `/carts/update`
### Request Body example
{

  "productId": "68720e5ddfeb003475238a12",
  "quantity": 8
}


user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Update carts quantity successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 33. DELETE  Carts item from cart

**** DELETE *** `/carts/remove/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete carts item from cart successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 34. Carts Checkout
**** GET *** `/carts/checkout`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Carts checkout successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token





### Create  WishList ****

### 34. Create-Wishlist
**** POST *** `/wishLists/add`
###Request Body example
{
  "productId": "6883985436a3eec43d903656"
}



user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create Wishlist successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 35. GET WishList BY UserId From get Token
**** GET *** `/wishLists`
###Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** wishLists Fetched successfully 
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 36. DELETE wishLists

**** DELETE *** `/wishLists/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete wishLists successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token




###  Address  ****

### 37. Create-Address

**** POST *** `/address/create-address`
###Request Body example
{
  "division": "Dhaka",
  "district": "Dhaka",
  "postalCode": "1212",
  "phoneNumber": "01712345678",
  "location": "Mirpur 10",
  "messOrBasaName": "Green View Mess",
  "paraName": "Block C"
}


user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create address successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 38. GET ALL Address
**** GET *** `/address`
###Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** address Fetched successfully 
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 39. Update address

****  PUT *** `/address/{id}`
### Request Body example
{
  "division": "Dhaka",
  "district": "Dhaka",
  "postalCode": "1212",
  "phoneNumber": "01712345678",
  "location": "Mirpur 10",
  "messOrBasaName": "Green View Mess",
  "paraName": "Block C"
}

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** update  address successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 40. Singel get  Address

**** GET *** `/address/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete address successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 41. DELETE address

**** DELETE *** `/address/{id}`
### Request Body example

user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Delete address successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token




### Create admin  Custom Bazer ###

custom bazer is way that user can directly order in from all item


### 41 . Create Custom Bazer
*** POST *** `/customBazerProducts/create-customBazerProduct`
### Request Body example
 {
    "category": "মসলা",
    "subcategory": "হলুদ গুঁড়া",
    "unit": "gm",
    "pricePerUnit": 5
  }

admin Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create Custom Bazer successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 42 . GET ALL Custom Bazer
*** POST *** `/customBazerProducts`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Custom Bazer fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### Custom Bazer order ###


### 43 . Create order Custom Bazer
*** POST *** `/customBazerOrders/create-customBazerOrder`
### Request Body example
{

"orderItems": [
{
"product": "688920fe3aedbc67ac4d47c7",
    "quantity": 2

},
{
"product": "68892cbb84d9ffe0f0b94927",
    "quantity": 2

},
{
"product": "68892cf384d9ffe0f0b94929",
    "quantity": 2

},
{
"product": "68892d0e84d9ffe0f0b9492b",
    "quantity": 2

},
{
"product": "68892d3184d9ffe0f0b9492d",
    "quantity": 2

},
{
"product": "68892d5184d9ffe0f0b9492f",
    "quantity": 2

}

],
  "status": "pending"
}
user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create Custom Bazer order successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 44 . GET singel Custom Bazer by userId

*** GET *** `/customBazerProducts/{id}`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Custom Bazer order  fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token


### 45 . GET ALL Custom Bazer by userId

*** GET *** `/customBazerProducts}`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Custom Bazer order  fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token








### order  ###


### 46 . Create Order
*** POST *** `/orders/create-order`
### Request Body example
{
  
  "paymentMethod": "cash_on_delivery or sslcommerz", 
  "shippingAddress": {
    "fullName": "Sizzad Hosen",
    "phone": "01712345678",
    "address": "House 10, Road 2",
    "city": "Rangpur",
    "postalCode": "5400",
    "country": "Bangladesh"
  }
}


user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:** Create order successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 47 . GET ALL Order
*** POST *** `/orders`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Orders fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 47 . GET ALL Order
*** POST *** `/orders`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Orders fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token

### 48 . GET Singel Order
*** POST *** `/orders/{id}`
### Request Body example

admin and user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Orders fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token



                   ### Track Order by invoiceId ###

### 49 . GET Order Track 
*** POST *** `/orders/track/{invoiceId}`
### Request Body example

 user Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Orders fetched successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token




### 50 . Update Order Track  status 
*** POST *** `/orders/update-status/{invoiceId}`
### Request Body example
{
  "status": "delivered"
}

admin  Token: Headers Autherrization `Bearer {token}`

**Response:**
- **200 OK:**  Orders update status successfully
- **400 Bad Request:** Validation error or email/phone already taken or missing
- **401 Unauthorized:** Invalid or missing authentication token






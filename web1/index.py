import os
import requests
from dotenv import load_dotenv
# Laibrary of EEl Connect with Javascript and Html,Css
import eel
# Connection of DataBase
import pyodbc
# CateGory List
category_list = []
# Initialize Eel with the 'web' directory
eel.init('web1')
# Database connection
conn = pyodbc.connect(
    'DRIVER={SQL Server};'
    'Server=DESKTOP-N8G6EHI\SQLEXPRESS;'
    'Database=CLOTHS_ECOMMERCE_SITE1;'
    'Trusted_Connection=yes;'
)
# Connection variable for execute query
cursor = conn.cursor()
# Load environment variables
load_dotenv()
DEEPINFRA_API_KEY = os.getenv("DEEPINFRA_API_KEY")

def chat_with_deepinfra(user_input, model="mistralai/Mixtral-8x7B-Instruct-v0.1"):
    """Send a message to DeepInfra's API and return the assistant's reply."""
    try:
        response = requests.post(
            "https://api.deepinfra.com/v1/openai/chat/completions",
            headers={"Authorization": f"Bearer {DEEPINFRA_API_KEY}"},
            json={
                "model": model,
                "messages": [{"role": "user", "content": user_input}],
                "max_tokens": 500,
            }
        )
        response.raise_for_status()  # Raises an HTTPError for bad responses
        return response.json()["choices"][0]["message"]["content"]
    except Exception as e:
        print(f"Error in chat_with_deepinfra: {str(e)}")
        return f"Sorry, I encountered an error: {str(e)}"

@eel.expose
def handle_chat_message(message):
    """Handle chat messages from the frontend."""
    try:
        response = chat_with_deepinfra(message)
        return {'status': 'success', 'response': response}
    except Exception as e:
        print(f"Error in handle_chat_message: {str(e)}")
        return {'status': 'error', 'response': str(e)}

@eel.expose
def Login(data):
    """Receive data from JavaScript and print it"""
    print("Received form data:")
    print(f"Email: {data['Email']}")
    print(f"Pass: {data['Pass']}")
    print(f"captchaAnswer: {data['captchaAnswer']}")
    # print(f"puzzleAnswer: {data['puzzleAnswer']}")
    
    cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")
    cursor.execute(f"""
        INSERT INTO LOG_IN (LOG_IN_Email, LOG_IN_Password, LOG_IN_captchaAnswer)
        VALUES ('{data['Email']}', '{data['Pass']}', '{data['captchaAnswer']}')
    """)
    conn.commit()
# Signupform from sql
@eel.expose
def Signup(name, email, imageBase64, password, age, gender, ad_cus,dob):
    cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")
    cursor.execute(f"""
        INSERT INTO SIGN_UP (SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_Password, SIGN_UP_DOB,
        SIGN_UP_Gender, SIGN_UP_administration, SIGN_UP_AGE,ProfilePicture)
        VALUES ('{name}', '{email}', '{password}', '{dob}', '{gender}', '{ad_cus}',{age},'{imageBase64}')
    """)
    conn.commit()
@eel.expose
def get_profile_picture(email):
    try:
        cursor.execute("""
            SELECT ProfilePicture 
            FROM SIGN_UP 
            WHERE SIGN_UP_Email = ?
        """, email)
        row = cursor.fetchone()
        return row[0] if row and row[0] else None
    except Exception as e:
        print(f"Error getting profile picture: {str(e)}")
        return None

# password match from sql
@eel.expose
def Password(data):
    cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")
    cursor.execute(f"""
        SELECT SIGN_UP_Password FROM SIGN_UP WHERE SIGN_UP_Email = '{data['Email']}'
    """)
    row = cursor.fetchone()
    if row and row[0] == data['Pass']:
        print("Password match successful")
        return True
    else:
        print("Password match failed")
        return False
# Administration match in sql
@eel.expose
def Administration(data):
    cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")
    cursor.execute(f"""
        SELECT SIGN_UP_administration FROM SIGN_UP WHERE SIGN_UP_Email = '{data['Email']}'
    """)
    row = cursor.fetchone()
    if row and row[0] == data['Adminstration']:
        print("SIGN_UP_administration match successful")
        return row[0]  # Return the actual value from database
    else:
        print("SIGN_UP_administration match failed")
        return False
# add product feom sql
@eel.expose
def add_product(product_name, category_name,product_image,product_Color
                ,product_quantity,product_description,product_size
                ,Product_Price,Product_delvery_price,Returnday,productDiscount):
    try:
        cursor.execute(f"""INSERT INTO Products (ProductName, CategoryName,productImage,
                       productColor,productQuantity,productDescription,productSize,Price,delvery_price,
                       Returnday,productDiscount) VALUES 
                       ('{product_name}', '{category_name}', '{product_image}', '{product_Color}', '{product_quantity}',
                       '{product_description}', 
                       '{product_size}',{Product_Price},{Product_delvery_price},'{Returnday}',{productDiscount})""")
        conn.commit()
        return "Product added successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
# add category in sql
@eel.expose
def add_category(category_name):
    try:
        cursor.execute(f"""INSERT INTO Categories (CategoryName) VALUES ('{ category_name}')""")
        conn.commit()
        return "Category added successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
#  get Category from sql
@eel.expose
def get_categories():
    cursor.execute("SELECT CategoryName FROM Categories")
    rows = cursor.fetchall()
    return [row.CategoryName for row in rows]
# get products from sql
@eel.expose
def get_products():
    cursor.execute("SELECT productid, ProductName, CategoryName,productImage,productColor,productQuantity,productDescription,productSize,Price,delvery_price,Returnday,productDiscount FROM Products")
    rows = cursor.fetchall()
    return [{"ID": row.productid, 
             "name": row.ProductName,
             "category": row.CategoryName,
             "productImage": row.productImage,
             "productColor": row.productColor,
             "productQuantity": row.productQuantity,
             "productDescription": row.productDescription,
             "productSize": row.productSize,
             "productPrice": row.Price,
             "productDelveryPrice": row.delvery_price,
             "productReturnDays": row.Returnday,
             "productDiscount": row.productDiscount
             } for row in rows]
# Delete product from sql
@eel.expose
def delete_product(product_name):
    try:
        cursor.execute(f"DELETE FROM Products WHERE ProductName = '{product_name}'")
        conn.commit()
        return "Product deleted successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
# Get Update from sql 
@eel.expose
def get_product_details(product_name):
    cursor.execute(f"SELECT * FROM Products WHERE ProductName = '{product_name}'")
    row = cursor.fetchone()
    return {
        "name": row.ProductName,
        "category": row.CategoryName,
        "productImage": row.productImage,
        "productColor": row.productColor,
        "productQuantity": row.productQuantity,
        "productDescription": row.productDescription,
        "productSize": row.productSize,
        "productPrice": row.Price,
        "productDelveryPrice": row.delvery_price,
        "productReturnDays": row.Returnday,
        "productDiscount": row.productDiscount
    }
# Update from sql 
@eel.expose
def update_product(old_name, new_name, category_name, product_image, product_color, product_quantity, 
                  product_description, product_size, Product_Price, Product_delvery_price, 
                  Returnday, productDiscount):
    try:
        # If no new image is provided, keep the existing one
        if product_image is None:
            cursor.execute(f"""
                UPDATE Products 
                SET ProductName = '{new_name}', 
                    CategoryName = '{category_name}', 
                    productColor = '{product_color}', 
                    productQuantity = '{product_quantity}', 
                    productDescription = '{product_description}', 
                    productSize = '{product_size}',
                    Price = '{Product_Price}',
                    delvery_price = '{Product_delvery_price}',
                    Returnday = '{Returnday}',
                    productDiscount = '{productDiscount}'
                WHERE ProductName = '{old_name}'
            """)
        else:
            cursor.execute(f"""
                UPDATE Products 
                SET ProductName = '{new_name}', 
                    CategoryName = '{category_name}', 
                    productImage = '{product_image}', 
                    productColor = '{product_color}', 
                    productQuantity = '{product_quantity}', 
                    productDescription = '{product_description}', 
                    productSize = '{product_size}',
                    Price = '{Product_Price}',
                    delvery_price = '{Product_delvery_price}',
                    Returnday = '{Returnday}',
                    productDiscount = '{productDiscount}'
                WHERE ProductName = '{old_name}'
            """)
        conn.commit()
        return "Product updated successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
# Search Products from sql 
@eel.expose
def search_products(search_term, condition):
    print(f"{search_term} + {condition}")  # Debugging: Print search term and condition
    try:
        # Ensure the condition is valid to prevent SQL injection
        valid_conditions = ["ProductName", "CategoryName", "productColor"]
        if condition not in valid_conditions:
            return "Invalid search condition."

        # Build the SQL query dynamically
        query = f"""
            SELECT productid, ProductName, CategoryName, productImage, productColor, 
                   productQuantity, productDescription, productSize, Price, 
                   delvery_price, Returnday, productDiscount
            FROM Products 
            WHERE {condition} LIKE ?
        """
        cursor.execute(query, (f'%{search_term}%',))  # Use LIKE for partial matching
        rows = cursor.fetchall()

        # Return the filtered products
        return [{
            "ID": row[0],
            "name": row.ProductName,
            "category": row.CategoryName,
            "productImage": row.productImage,
            "productColor": row.productColor,
            "productQuantity": row.productQuantity,
            "productDescription": row.productDescription,
            "productSize": row.productSize,
            "productPrice": row.Price,
            "productDelveryPrice": row.delvery_price,
            "productReturnDays": row.Returnday,
            "productDiscount": row.productDiscount
        } for row in rows]
    except Exception as e:
        return f"Error: {str(e)}"
#search product by price
@eel.expose
def search_products_by_price(price):
    try:
        query = """
            SELECT productid, ProductName, CategoryName, productImage, productColor, 
                   productQuantity, productDescription, productSize, Price, 
                   delvery_price, Returnday, productDiscount
            FROM Products 
            WHERE Price <= ?
            ORDER BY Price DESC
        """
        cursor.execute(query, (price,))
        rows = cursor.fetchall()

        return [{
            "ID": row[0],
            "name": row.ProductName,
            "category": row.CategoryName,
            "productImage": row.productImage,
            "productColor": row.productColor,
            "productQuantity": row.productQuantity,
            "productDescription": row.productDescription,
            "productSize": row.productSize,
            "productPrice": row.Price,
            "productDelveryPrice": row.delvery_price,
            "productReturnDays": row.Returnday,
            "productDiscount": row.productDiscount
        } for row in rows]
    except Exception as e:
        return f"Error: {str(e)}"
# get product details
@eel.expose
def get_product_details1(product_name):
        try:
            # Execute a SQL query to fetch the product details based on the product name
            cursor.execute(f"SELECT * FROM Products WHERE ProductName = '{product_name}'")
            row = cursor.fetchone()  # Fetch the first matching row

        # If no product is found, return an error message
            if not row:
                return "Product not found."

        # Return the product details as a dictionary
            return {
            "name": row.ProductName,
            "category": row.CategoryName,
            "productImage": row.productImage,
            "productColor": row.productColor,
            "productQuantity": row.productQuantity,
            "productDescription": row.productDescription,
            "productSize": row.productSize,
            "productPrice": row.Price,
            "productDelveryPrice": row.delvery_price,
            "productReturnDays": row.Returnday,
            "productDiscount": row.productDiscount
            }
        except Exception as e:
        # Handle any errors and return an error message
            return f"Error: {str(e)}"
@eel.expose
def get_categories111():
    try:
        print("Executing get_categories query...")
        cursor.execute("SELECT CategoryName FROM Categories")
        rows = cursor.fetchall()
        print(f"Found {len(rows)} categories")
        return [row.CategoryName for row in rows]
    except Exception as e:
        print(f"Error in get_categories: {str(e)}")
        return []
# get admin from sql  
@eel.expose
def get_admin_id():
    try:
        cursor.execute("SELECT SUserID FROM SIGN_UP WHERE SIGN_UP_administration = 'Admin'")
        row = cursor.fetchone()
        return row[0] if row else None
    except Exception as e:
        print(f"Error getting admin ID: {str(e)}")
        return None
# send Message from specific id to sql
@eel.expose
def send_message(sender_id, recipient_id, message):
    try:
        cursor.execute("""
            INSERT INTO Messages (SenderID, RecipientID, MessageText)
            VALUES (?, ?, ?)
        """, sender_id, recipient_id, message)
        conn.commit()
        return True
    except Exception as e:
        print(f"Error sending message: {str(e)}")
        return False
@eel.expose
def get_user_by_email(email):
    try:
        cursor.execute("""
            SELECT SUserID, SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_administration
            FROM SIGN_UP 
            WHERE SIGN_UP_Email = ?
        """, email)
        row = cursor.fetchone()
        if row:
            return {
                "SUserID": row.SUserID,
                "SIGN_UP_Name": row.SIGN_UP_Name,
                "SIGN_UP_Email": row.SIGN_UP_Email,
                "SIGN_UP_administration": row.SIGN_UP_administration
            }
        return None
    except Exception as e:
        print(f"Error getting user by email: {str(e)}")
        return None
@eel.expose
def get_user_by_email1(email):
    try:
        cursor.execute("""
            SELECT SUserID, SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_administration, ProfilePicture
            FROM SIGN_UP 
            WHERE SIGN_UP_Email = ?
        """, email)
        row = cursor.fetchone()
        if row:
            # Convert binary profile picture to base64 if it exists
            profile_pic = None
            if row.ProfilePicture:
                profile_pic = f"data:image/jpeg;base64,{row.ProfilePicture.decode('utf-8')}"
            
            return {
                "SUserID": row.SUserID,
                "SIGN_UP_Name": row.SIGN_UP_Name,
                "SIGN_UP_Email": row.SIGN_UP_Email,
                "SIGN_UP_administration": row.SIGN_UP_administration,
                "profilePic": profile_pic
            }
        return None
    except Exception as e:
        print(f"Error getting user by email: {str(e)}")
        return None
@eel.expose
def get_all_admins():
    try:
        cursor.execute("""
            SELECT SUserID, SIGN_UP_Name 
            FROM SIGN_UP 
            WHERE SIGN_UP_administration = 'Admin'
        """)
        return [{'SUserID': row.SUserID, 'SIGN_UP_Name': row.SIGN_UP_Name} 
               for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error getting admins: {str(e)}")
        return []
# get from specific id and show in admin chatbot
@eel.expose
def get_messages(user_id, other_user_id):
    try:
        cursor.execute("""
            SELECT m.MessageID, m.SenderID, m.MessageText, m.Timestamp, 
                   u.SIGN_UP_Name as SenderName, m.IsRead
            FROM Messages m
            JOIN SIGN_UP u ON u.SUserID = m.SenderID
            WHERE (m.SenderID = ? AND m.RecipientID = ?)
               OR (m.SenderID = ? AND m.RecipientID = ?)
            ORDER BY m.Timestamp
        """, user_id, other_user_id, other_user_id, user_id)
        
        messages = []
        for row in cursor:
            messages.append({
                'id': row.MessageID,
                'sender_id': row.SenderID,
                'sender_name': row.SenderName,
                'text': row.MessageText,
                'timestamp': row.Timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                'is_read': row.IsRead
            })
        
        # Mark messages as read
        cursor.execute("""
            UPDATE Messages 
            SET IsRead = 1 
            WHERE RecipientID = ? AND SenderID = ? AND IsRead = 0
        """, user_id, other_user_id)
        conn.commit()
        
        return messages
    except Exception as e:
        print(f"Error getting messages: {str(e)}")
        return []  
# Message Conversion 
@eel.expose
def get_conversations(user_id):
    try:
        # For admin, get all unique customers they've chatted with
        cursor.execute("""
            SELECT DISTINCT u.SUserID, u.SIGN_UP_Name 
            FROM Messages m
            JOIN SIGN_UP u ON u.SUserID = CASE 
                WHEN m.SenderID = ? THEN m.RecipientID 
                ELSE m.SenderID 
            END
            WHERE ? IN (m.SenderID, m.RecipientID)
            AND u.SIGN_UP_administration = 'Customer'
        """, user_id, user_id)
        return [{'id': row.SUserID, 'name': row.SIGN_UP_Name} for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error getting conversations: {str(e)}")
        return []
#read count message
@eel.expose
def get_unread_counts(user_id):
    try:
        cursor.execute("""
            SELECT SenderID, COUNT(*) as UnreadCount
            FROM Messages
            WHERE RecipientID = ? AND IsRead = 0
            GROUP BY SenderID
        """, user_id)
        return {row.SenderID: row.UnreadCount for row in cursor.fetchall()}
    except Exception as e:
        print(f"Error getting unread counts: {str(e)}")
        return {}
# Get all users from database
@eel.expose
def get_all_users():
    try:
        cursor.execute("""
            SELECT SUserID, SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_Password, 
                   SIGN_UP_DOB, SIGN_UP_Gender, SIGN_UP_administration, SIGN_UP_AGE
            FROM SIGN_UP
            ORDER BY SIGN_UP_administration DESC, SIGN_UP_Name
        """)
        rows = cursor.fetchall()
        return [{
            "SUserID": row.SUserID,
            "SIGN_UP_Name": row.SIGN_UP_Name,
            "SIGN_UP_Email": row.SIGN_UP_Email,
            "SIGN_UP_Password": row.SIGN_UP_Password,
            "SIGN_UP_DOB": row.SIGN_UP_DOB,
            "SIGN_UP_Gender": row.SIGN_UP_Gender,
            "SIGN_UP_administration": row.SIGN_UP_administration,
            "SIGN_UP_AGE": row.SIGN_UP_AGE
        } for row in rows]
    except Exception as e:
        print(f"Error getting users: {str(e)}")
        return []
# Search users based on condition
@eel.expose
def search_users(search_term, condition):
    try:
        # Validate condition to prevent SQL injection
        valid_conditions = ["SIGN_UP_Name", "SIGN_UP_Email", "SIGN_UP_administration", "SIGN_UP_AGE"]
        if condition not in valid_conditions:
            return []
        
        query = f"""
            SELECT SUserID, SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_Password, 
                   SIGN_UP_DOB, SIGN_UP_Gender, SIGN_UP_administration, SIGN_UP_AGE
            FROM SIGN_UP
            WHERE {condition} LIKE ?
            ORDER BY SIGN_UP_administration DESC, SIGN_UP_Name
        """
        cursor.execute(query, (f'%{search_term}%',))
        rows = cursor.fetchall()
        
        return [{
            "SUserID": row.SUserID,
            "SIGN_UP_Name": row.SIGN_UP_Name,
            "SIGN_UP_Email": row.SIGN_UP_Email,
            "SIGN_UP_Password": row.SIGN_UP_Password,
            "SIGN_UP_DOB": row.SIGN_UP_DOB,
            "SIGN_UP_Gender": row.SIGN_UP_Gender,
            "SIGN_UP_administration": row.SIGN_UP_administration,
            "SIGN_UP_AGE": row.SIGN_UP_AGE
        } for row in rows]
    except Exception as e:
        print(f"Error searching users: {str(e)}")
        return []
# Get user details by ID
@eel.expose
def get_user_details(user_id):
    try:
        cursor.execute("""
            SELECT SUserID, SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_Password, 
                   SIGN_UP_DOB, SIGN_UP_Gender, SIGN_UP_administration, SIGN_UP_AGE
            FROM SIGN_UP
            WHERE SUserID = ?
        """, user_id)
        row = cursor.fetchone()
        if row:
            return {
                "SUserID": row.SUserID,
                "SIGN_UP_Name": row.SIGN_UP_Name,
                "SIGN_UP_Email": row.SIGN_UP_Email,
                "SIGN_UP_Password": row.SIGN_UP_Password,
                "SIGN_UP_DOB": row.SIGN_UP_DOB,
                "SIGN_UP_Gender": row.SIGN_UP_Gender,
                "SIGN_UP_administration": row.SIGN_UP_administration,
                "SIGN_UP_AGE": row.SIGN_UP_AGE
            }
        return None
    except Exception as e:
        print(f"Error getting user details: {str(e)}")
        return None
# Update user information
@eel.expose
def update_user(user_id, user_data):
    try:
        # If password is not being changed, don't update it
        password_update = ""
        if user_data['password']:
            password_update = f", SIGN_UP_Password = '{user_data['password']}'"
        
        cursor.execute(f"""
            UPDATE SIGN_UP
            SET SIGN_UP_Name = '{user_data['name']}',
                SIGN_UP_Email = '{user_data['email']}',
                SIGN_UP_DOB = '{user_data['dob']}',
                SIGN_UP_Gender = '{user_data['gender']}',
                SIGN_UP_administration = '{user_data['role']}',
                SIGN_UP_AGE = {user_data['age']}
                {password_update}
            WHERE SUserID = {user_id}
        """)
        conn.commit()
        return "User updated successfully!"
    except Exception as e:
        return f"Error updating user: {str(e)}"
# Delete user
@eel.expose
def delete_user(user_id):
    try:
        # First check if user exists
        cursor.execute("SELECT 1 FROM SIGN_UP WHERE SUserID = ?", user_id)
        if not cursor.fetchone():
            return "User not found"
        
        # Delete the user
        cursor.execute("DELETE FROM SIGN_UP WHERE SUserID = ?", user_id)
        conn.commit()
        return "User deleted successfully!"
    except Exception as e:
        return f"Error deleting user: {str(e)}"
# Cart functions
@eel.expose
def add_to_cart(session_id, product_name):
    try:
        # Get product ID
        cursor.execute("SELECT productid FROM Products WHERE ProductName = ?", product_name)
        product_id = cursor.fetchone()[0]
        
        # Check if product already in cart
        cursor.execute("SELECT CartID, Quantity FROM Cart WHERE SessionID = ? AND ProductID = ?", 
                     (session_id, product_id))
        row = cursor.fetchone()
        
        if row:
            # Update quantity if already exists
            new_quantity = row[1] + 1
            cursor.execute("UPDATE Cart SET Quantity = ? WHERE CartID = ?", 
                          (new_quantity, row[0]))
        else:
            # Add new item
            cursor.execute("INSERT INTO Cart (SessionID, ProductID) VALUES (?, ?)", 
                         (session_id, product_id))
        
        conn.commit()
        return True
    except Exception as e:
        print(f"Error adding to cart: {str(e)}")
        return False
#get cart items
@eel.expose
def get_cart_items(session_id):
    try:
        query = """
            SELECT p.productid, p.ProductName, p.productImage, p.Price, p.productDiscount, 
                   c.Quantity, p.delvery_price
            FROM Cart c
            JOIN Products p ON c.ProductID = p.productid
            WHERE c.SessionID = ?
        """
        cursor.execute(query, (session_id,))
        
        items = []
        for row in cursor:
            discount_amount = row.Price * (row.productDiscount / 100)
            discounted_price = row.Price - discount_amount
            total_price = discounted_price * row.Quantity
            
            items.append({
                "id": row.productid,
                "name": row.ProductName,
                "image": row.productImage,
                "price": row.Price,
                "discount": row.productDiscount,
                "quantity": row.Quantity,
                "delivery_price": row.delvery_price,
                "total_price": total_price
            })
        
        return items
    except Exception as e:
        print(f"Error getting cart items: {str(e)}")
        return []
# remove item function of python
@eel.expose
def remove_from_cart(session_id, product_id):
    try:
        cursor.execute("DELETE FROM Cart WHERE SessionID = ? AND ProductID = ?", 
                     (session_id, product_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error removing from cart: {str(e)}")
        return False
# update Quantity when customer Update the Quantity
@eel.expose
def update_cart_quantity(session_id, product_id, new_quantity):
    try:
        if new_quantity < 1:
            return remove_from_cart(session_id, product_id)
        
        cursor.execute("UPDATE Cart SET Quantity = ? WHERE SessionID = ? AND ProductID = ?",
                     (new_quantity, session_id, product_id))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating cart quantity: {str(e)}")
        return False
@eel.expose
def place_order(order_data):
    try:
        cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")
        
        # Insert order and get the order ID
        cursor.execute("""
            INSERT INTO Orders (
                SessionID, CustomerName, CustomerEmail, CustomerPhone,
                Country, Province, City, District, Zipcode, Address1,
                PaymentMethod, Subtotal, Delivery, Total, Status1
            )
            OUTPUT INSERTED.OrderID
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
        """, (
            order_data['sessionId'],
            order_data['name'],
            order_data['email'],
            order_data['phone'],
            order_data['country'],
            order_data['province'],
            order_data['city'],
            order_data['district'],
            order_data['zipcode'],
            order_data['address'],
            order_data['payment'],
            order_data['subtotal'],
            order_data['delivery'],
            order_data['total']
        ))
        
        # Get the order ID directly from the INSERT statement
        order_id = cursor.fetchone()[0]
        
        # Insert payment details
        payment_method = order_data['payment']
        if payment_method in ['JazzCash', 'EasyPaisa']:
            cursor.execute("""
                INSERT INTO PaymentDetails (
                    OrderID, PaymentMethod, AccountNumber, TransactionID, PaymentAmount
                )
                VALUES (?, ?, ?, ?, ?)
            """, (
                order_id,
                payment_method,
                order_data.get('accountNumber', ''),
                order_data.get('transactionId', ''),
                order_data['total']
            ))
        elif payment_method == 'DebitCard':
            cursor.execute("""
                INSERT INTO PaymentDetails (
                    OrderID, PaymentMethod, AccountNumber, AdditionalInfo, PaymentAmount
                )
                VALUES (?, ?, ?, ?, ?)
            """, (
                order_id,
                payment_method,
                order_data.get('cardNumber', ''),
                f"Expiry: {order_data.get('expiryDate', '')}, CVV: {order_data.get('cvv', '')}",
                order_data['total']
            ))
        elif payment_method == 'PayPal':
            cursor.execute("""
                INSERT INTO PaymentDetails (
                    OrderID, PaymentMethod, AccountNumber, PaymentAmount
                )
                VALUES (?, ?, ?, ?)
            """, (
                order_id,
                payment_method,
                order_data.get('paypalEmail', ''),
                order_data['total']
            ))
        
        # Clear the cart
        cursor.execute("DELETE FROM Cart WHERE SessionID = ?", order_data['sessionId'])
        
        conn.commit()
        
        # Return the order ID in the response
        return {"success": True, "orderId": order_id}
    except Exception as e:
        conn.rollback()
        print(f"Error placing order: {str(e)}")
        return {"success": False, "error": str(e)}

# Get all orders
@eel.expose
def get_all_orders():
    try:
        cursor.execute("""
            SELECT * FROM Orders
            ORDER BY OrderDate DESC
        """)
        rows = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except Exception as e:
        print(f"Error getting orders: {str(e)}")
        return []
# Get all carts
@eel.expose
def get_all_carts():
    try:
        cursor.execute("""
            SELECT * FROM Cart
            ORDER BY CartID DESC
        """)
        rows = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except Exception as e:
        print(f"Error getting carts: {str(e)}")
        return []
# Search orders
@eel.expose
def search_orders(search_term, condition):
    try:
        valid_conditions = ["CustomerName", "CustomerEmail", "Status1", "OrderID"]
        if condition not in valid_conditions:
            return []
        
        query = f"""
            SELECT * FROM Orders
            WHERE {condition} LIKE ?
            ORDER BY OrderDate DESC
        """
        cursor.execute(query, (f'%{search_term}%',))
        rows = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except Exception as e:
        print(f"Error searching orders: {str(e)}")
        return []
# Search carts
@eel.expose
def search_carts(search_term, condition):
    try:
        valid_conditions = ["SessionID", "ProductID"]
        if condition not in valid_conditions:
            return []
        
        query = f"""
            SELECT * FROM Cart
            WHERE {condition} LIKE ?
            ORDER BY CartID DESC
        """
        cursor.execute(query, (f'%{search_term}%',))
        rows = cursor.fetchall()
        return [dict(zip([column[0] for column in cursor.description], row)) for row in rows]
    except Exception as e:
        print(f"Error searching carts: {str(e)}")
        return []
# Delete order
@eel.expose
def delete_order(order_id):
    try:
        cursor.execute("DELETE FROM Orders WHERE OrderID = ?", order_id)
        conn.commit()
        return "Order deleted successfully"
    except Exception as e:
        return f"Error deleting order: {str(e)}"
# Delete cart
@eel.expose
def delete_cart(cart_id):
    try:
        cursor.execute("DELETE FROM Cart WHERE CartID = ?", cart_id)
        conn.commit()
        return "Cart item deleted successfully"
    except Exception as e:
        return f"Error deleting cart item: {str(e)}"
# Add these to your index.py file
@eel.expose
def create_shipping_record(order_id):
    try:
        # Initial shipping status
        cursor.execute("""
            INSERT INTO Shipping (OrderID, Status, Location)
            VALUES (?, 'Order Confirmed', 'Warehouse')
        """, order_id)
        conn.commit()
        return True
    except Exception as e:
        print(f"Error creating shipping record: {str(e)}")
        return False

@eel.expose
def update_shipping_status(order_id, status, location):
    try:
        cursor.execute("""
            INSERT INTO Shipping (OrderID, Status, Location)
            VALUES (?, ?, ?)
        """, (order_id, status, location))
        conn.commit()
        return True
    except Exception as e:
        print(f"Error updating shipping status: {str(e)}")
        return False

@eel.expose
def get_shipping_updates(order_id):
    try:
        cursor.execute("""
            SELECT Status, Location, UpdateTime
            FROM Shipping
            WHERE OrderID = ?
            ORDER BY UpdateTime
        """, order_id)
        return [{
            "status": row.Status,
            "location": row.Location,
            "time": row.UpdateTime.strftime("%Y-%m-%d %H:%M:%S")
        } for row in cursor.fetchall()]
    except Exception as e:
        print(f"Error getting shipping updates: {str(e)}")
        return []
@eel.expose
def get_order_details111(order_id):
            try:
                cursor.execute("""
                    SELECT * FROM Orders WHERE OrderID = ?
                """, order_id)
                row = cursor.fetchone()
                if row:
                    return {
                        "name": row.CustomerName,
                        "email": row.CustomerEmail,
                        "phone": row.CustomerPhone,
                        "country": row.Country,
                        "province": row.Province,
                        "city": row.City,
                        "address": row.Address1,
                        "payment": row.PaymentMethod,
                        "total": row.Total
                    }
                return None
            except Exception as e:
                print(f"Error getting order details: {str(e)}")
                return None
@eel.expose
def submit_feedback(feedback_data):
    try:
        print("Received feedback data:", feedback_data)  # Debug print
        cursor.execute("USE CLOTHS_ECOMMERCE_SITE1")  # Ensure using correct DB
        cursor.execute("""
            INSERT INTO Feedback (name, email, subject, message, rating, date)
            VALUES (?, ?, ?, ?, ?, GETDATE())
        """, (
            feedback_data['name'],
            feedback_data['email'],
            feedback_data['subject'],
            feedback_data['message'],
            feedback_data['rating']
        ))
        conn.commit()
        print("Feedback successfully inserted")  # Debug print
        return {"success": True, "message": "Feedback submitted successfully!"}
    except Exception as e:
        print(f"Error submitting feedback: {str(e)}")  # More detailed error
        return {"success": False, "message": f"Error: {str(e)}"}
@eel.expose
def get_feedback():
    try:
        cursor.execute("""
            SELECT id, name, email, subject, message, rating, date 
            FROM Feedback 
            ORDER BY date DESC
        """)
        rows = cursor.fetchall()
        return [{
            "id": row.id,
            "name": row.name,
            "email": row.email,
            "subject": row.subject,
            "message": row.message,
            "rating": row.rating,
            "date": row.date.strftime("%Y-%m-%d %H:%M:%S")
        } for row in rows]
    except Exception as e:
        print(f"Error getting feedback: {str(e)}")
        return []
@eel.expose
def delete_category(category_name):
    try:
        cursor.execute("DELETE FROM Categories WHERE CategoryName = ?", category_name)
        conn.commit()
        return "Category deleted successfully!"
    except Exception as e:
        return f"Error: {str(e)}"
@eel.expose
def test_connection():
    return "Python connection working"
# satrt page on local port on 8000
eel.start('Main.html', port=8080, size=(800, 600))
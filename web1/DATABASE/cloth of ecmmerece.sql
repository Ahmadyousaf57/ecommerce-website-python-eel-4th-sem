-- ======================================
-- DATABASE CREATION
-- ======================================

CREATE DATABASE CLOTHS_ECOMMERCE_SITE1;
GO

USE CLOTHS_ECOMMERCE_SITE1;
GO

-- ======================================
-- TABLES CREATION
-- ======================================

CREATE TABLE SIGN_UP (
    SUserID INT PRIMARY KEY IDENTITY(1,1),
    SIGN_UP_Name VARCHAR(60),
    SIGN_UP_Email VARCHAR(255) UNIQUE NOT NULL,
    CONSTRAINT CHK11_Email CHECK (SIGN_UP_Email LIKE '%_@_%._%'),
    SIGN_UP_Password VARCHAR(20) UNIQUE NOT NULL,
    SIGN_UP_DOB VARCHAR(60) NOT NULL,
    SIGN_UP_Gender VARCHAR(60),
    SIGN_UP_administration VARCHAR(60) NOT NULL,
    SIGN_UP_AGE INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP,
    ProfilePicture VARCHAR(MAX),
    Msgdattime DATETIME DEFAULT GETDATE()
);
GO
select *from SIGN_UP
-- Insert Sample Admin
INSERT INTO SIGN_UP (SIGN_UP_Name, SIGN_UP_Email, SIGN_UP_Password, SIGN_UP_DOB, SIGN_UP_Gender, SIGN_UP_administration, SIGN_UP_AGE)
VALUES ('Usama', 'su92-bscsm-f23-500@superior.edu.pk', '500', '2000-01-01', 'male', 'Admin', '25');
GO

SELECT * FROM SIGN_UP;
GO

-- Table: LOG_IN
CREATE TABLE LOG_IN (
    UserID INT PRIMARY KEY IDENTITY(1,1),
    LOG_IN_Email VARCHAR(255) NOT NULL,
    CONSTRAINT CHK_Email CHECK (LOG_IN_Email LIKE '%_@_%._%'),
    LOG_IN_Password VARCHAR(20) NOT NULL,
    LOG_IN_captchaAnswer INT,
    OrderDate DATETIME DEFAULT CURRENT_TIMESTAMP
);
GO

SELECT * FROM LOG_IN;
GO

-- Table: Categories
CREATE TABLE Categories (
    categoryid INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName VARCHAR(60)
);
GO

SELECT * FROM Categories;
GO

-- Table: Products
CREATE TABLE Products (
    productid INT IDENTITY(1,1) PRIMARY KEY,
    ProductName VARCHAR(60),
    CategoryName VARCHAR(60),
    productImage VARCHAR(MAX),
    productColor VARCHAR(60),
    productQuantity VARCHAR(60),
    productDescription VARCHAR(60),
    productSize VARCHAR(60),
    Price INT,
    delvery_price INT NOT NULL,
    Returnday VARCHAR(265) NOT NULL,
    productDiscount INT NOT NULL
);
GO

SELECT * FROM Products;
GO

-- Table: Messages
CREATE TABLE Messages (
    MessageID INT PRIMARY KEY IDENTITY(1,1),
    SenderID INT NOT NULL,
    RecipientID INT NOT NULL,
    MessageText TEXT NOT NULL,
    Timestamp DATETIME DEFAULT GETDATE(),
    IsRead BIT DEFAULT 0,
    FOREIGN KEY (SenderID) REFERENCES SIGN_UP(SUserID),
    FOREIGN KEY (RecipientID) REFERENCES SIGN_UP(SUserID)
);
GO

-- Indexes for Messages
CREATE INDEX idx_messages_sender ON Messages(SenderID);
CREATE INDEX idx_messages_recipient ON Messages(RecipientID);
CREATE INDEX idx_messages_unread ON Messages(RecipientID, IsRead) WHERE IsRead = 0;
GO
SELECT * FROM Messages WHERE SenderID = 5;
SELECT * FROM Messages WHERE RecipientID = 7;
SELECT * FROM Messages WHERE RecipientID = 7 AND IsRead = 0;

GO

-- Table: Cart
CREATE TABLE Cart (
    CartID INT PRIMARY KEY IDENTITY(1,1),
    SessionID VARCHAR(255) NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT DEFAULT 1,
    FOREIGN KEY (ProductID) REFERENCES Products(productid)
);
GO

SELECT * FROM Cart;
GO

-- Table: Orders
CREATE TABLE Orders (
    OrderID INT PRIMARY KEY IDENTITY(1,1),
    SessionID VARCHAR(255),
    CustomerName VARCHAR(100),
    CustomerEmail VARCHAR(255),
    CustomerPhone VARCHAR(20),
    Country VARCHAR(100),
    Province VARCHAR(100),
    City VARCHAR(100),
    District VARCHAR(100),
    Zipcode VARCHAR(100),
    Address1 VARCHAR(100),
    PaymentMethod VARCHAR(50),
    Subtotal DECIMAL(10,2),
    Delivery DECIMAL(10,2),
    Total DECIMAL(10,2),
    Status1 VARCHAR(20) DEFAULT 'Pending',
    OrderDate DATETIME DEFAULT GETDATE()
);
GO

SELECT * FROM Orders;
GO

-- Table: PaymentDetails
CREATE TABLE PaymentDetails (
    PaymentID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT NOT NULL,
    PaymentMethod VARCHAR(50) NOT NULL,
    AccountNumber VARCHAR(100),
    TransactionID VARCHAR(100),
    PaymentAmount DECIMAL(10,2) NOT NULL,
    PaymentStatus VARCHAR(20) DEFAULT 'Pending',
    PaymentDate DATETIME DEFAULT GETDATE(),
    AdditionalInfo TEXT,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID)
);
GO
alter table PaymentDetails
alter column TransactionID int;

-- Table: Feedback
CREATE TABLE Feedback (
    id INT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    message text NOT NULL,
    rating INT NOT NULL,
    date DATETIME NOT NULL
);
GO
drop table Feedback
SELECT * FROM Feedback;
GO
-- backup  table order
CREATE TABLE Orders_Backup (
    BackupID INT PRIMARY KEY IDENTITY(1,1),
    OrderID INT,
    SessionID VARCHAR(255),
    CustomerName VARCHAR(100),
    CustomerEmail VARCHAR(255),
    CustomerPhone VARCHAR(20),
    Country VARCHAR(100),
    Province VARCHAR(100),
    City VARCHAR(100),
    District VARCHAR(100),
    Zipcode VARCHAR(100),
    Address1 VARCHAR(100),
    PaymentMethod VARCHAR(50),
    Subtotal DECIMAL(10,2),
    Delivery DECIMAL(10,2),
    Total DECIMAL(10,2),
    Status1 VARCHAR(20),
    OrderDate DATETIME,
    BackupDate DATETIME DEFAULT GETDATE()
);
-- backup table message
CREATE TABLE Messages_Backup (
    BackupID INT PRIMARY KEY IDENTITY(1,1),
    MessageID INT,
    SenderID INT,
    RecipientID INT,
    MessageText TEXT,
    Timestamp DATETIME,
    IsRead BIT,
    BackupDate DATETIME DEFAULT GETDATE()
);
-- backup table feedback
CREATE TABLE Feedback_Backup (
    BackupID INT PRIMARY KEY IDENTITY(1,1),
    id INT,
    name VARCHAR(100),
    email VARCHAR(100),
    subject VARCHAR(200),
    message TEXT,
    rating INT,
    date DATETIME,
    BackupDate DATETIME DEFAULT GETDATE()
);

-- ======================================
-- TRIGGERS (SAFE)
-- ======================================
CREATE TRIGGER trg_BackupOrderInsert
ON Orders
AFTER INSERT
AS
BEGIN
    -- Insert new order into Orders_Backup
    INSERT INTO Orders_Backup (
        OrderID, SessionID, CustomerName, CustomerEmail, CustomerPhone, Country,
        Province, City, District, Zipcode, Address1, PaymentMethod,
        Subtotal, Delivery, Total, Status1, OrderDate
    )
    SELECT 
        OrderID, SessionID, CustomerName, CustomerEmail, CustomerPhone, Country,
        Province, City, District, Zipcode, Address1, PaymentMethod,
        Subtotal, Delivery, Total, Status1, OrderDate
    FROM inserted;
    
END;
GO
--triger message
CREATE TRIGGER trg_BackupMessageUpdate
ON Messages
AFTER UPDATE
AS
BEGIN
    INSERT INTO Messages_Backup (
        MessageID, SenderID, RecipientID, Timestamp, IsRead
    )
    SELECT 
        d.MessageID, d.SenderID, d.RecipientID, d.Timestamp, d.IsRead
    FROM deleted d;
END;

--feed back

CREATE TRIGGER trg_BackupFeedbackInsert
ON Feedback
AFTER INSERT
AS
BEGIN
    -- Insert new feedback into Feedback_Backup
    INSERT INTO Feedback_Backup (
        id, name, email, subject, rating, date
    )
    SELECT 
        id, name, email, subject, rating, date
    FROM inserted;
END;
GO

-- ======================================
-- VIEWS (SAFE)
-- ======================================

-- View: Active Orders
CREATE  VIEW View_ActiveOrders
AS
SELECT OrderID, CustomerName, Total, Status1, OrderDate
FROM Orders
WHERE Status1 IN ('Pending', 'Processing');
GO
select * from View_ActiveOrders 

-- View: Products with Category
CREATE  VIEW View_ProductsWithCategory
AS
SELECT productid, ProductName, CategoryName, Price, productDiscount
FROM Products;
GO

-- View: Customer Messages
CREATE  VIEW View_CustomerMessages
AS
SELECT 
    m.MessageID, 
    s.SIGN_UP_Name AS SenderName, 
    r.SIGN_UP_Name AS RecipientName, 
    m.MessageText, 
    m.Timestamp
FROM Messages m
JOIN SIGN_UP s ON m.SenderID = s.SUserID
JOIN SIGN_UP r ON m.RecipientID = r.SUserID;
GO
select *from View_CustomerMessages
-- ======================================
-- STORED PROCEDURES (SAFE)
-- ======================================

-- SP: Add New Product
CREATE PROCEDURE sp_AddProduct
    @ProductName VARCHAR(60),
    @CategoryName VARCHAR(60),
    @productImage VARCHAR(MAX),
    @productColor VARCHAR(60),
    @productQuantity VARCHAR(60),
    @productDescription VARCHAR(60),
    @productSize VARCHAR(60),
    @Price INT,
    @delvery_price INT,
    @Returnday VARCHAR(265),
    @productDiscount INT
AS
BEGIN
    INSERT INTO Products (ProductName, CategoryName, productImage, productColor, productQuantity, productDescription, productSize, Price, delvery_price, Returnday, productDiscount)
    VALUES (@ProductName, @CategoryName, @productImage, @productColor, @productQuantity, @productDescription, @productSize, @Price, @delvery_price, @Returnday, @productDiscount);
END;
GO
-- SP: Get Cart Items
CREATE  PROCEDURE sp_GetCartItems
    @SessionID VARCHAR(255)
AS
BEGIN
    SELECT 
        c.CartID, 
        p.ProductName, 
        c.Quantity, 
        p.Price
    FROM Cart c
    JOIN Products p ON c.ProductID = p.productid
    WHERE c.SessionID = @SessionID;
END;
GO

-- SP: Submit Feedback
CREATE PROCEDURE sp_SubmitFeedback
    @name VARCHAR(100),
    @email VARCHAR(100),
    @subject VARCHAR(200),
    @message text,
    @rating INT
AS
BEGIN
    INSERT INTO Feedback (name, email, subject, message, rating, date)
    VALUES (@name, @email, @subject, @message, @rating, GETDATE());
END;
GO

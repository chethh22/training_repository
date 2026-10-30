CREATE TABLE IF NOT EXISTS recharge_plans (
    plan_id INT PRIMARY KEY,
    plan_name VARCHAR(50) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    validity_days INT NOT NULL,
    benefits VARCHAR(255),
    popularity_count INT DEFAULT 0
);

CREATE TABLE IF NOT EXISTS customers (
    customer_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_number VARCHAR(15) UNIQUE NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    current_plan_id INT,
    valid_until DATE,
    CONSTRAINT fk_customer_plan FOREIGN KEY (current_plan_id) REFERENCES recharge_plans(plan_id)
);

CREATE TABLE IF NOT EXISTS recharge_history (
    recharge_id INT AUTO_INCREMENT PRIMARY KEY,
    customer_number VARCHAR(15) NOT NULL,
    plan_id INT NOT NULL,
    recharge_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    CONSTRAINT fk_history_plan FOREIGN KEY (plan_id) REFERENCES recharge_plans(plan_id)
);

MERGE INTO recharge_plans (plan_id, plan_name, price, validity_days, benefits, popularity_count) KEY(plan_id) VALUES
(101, 'Basic', 199.00, 28, '1.5 GB/day + Unlimited Calls', 0),
(102, 'Smart', 299.00, 28, '2 GB/day + Unlimited Calls', 0),
(103, 'Super', 399.00, 56, '2.5 GB/day + Unlimited Calls', 0),
(104, 'Premium', 599.00, 84, '3 GB/day + Unlimited Calls', 0);

MERGE INTO customers (customer_number, customer_name) KEY(customer_number) VALUES
('9876543210', 'Chethan'),
('9988776655', 'Rahul'),
('9123456780', 'Arjun');

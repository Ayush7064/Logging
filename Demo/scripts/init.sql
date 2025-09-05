CREATE TABLE Log (
    id INT AUTO_INCREMENT PRIMARY KEY,
    level ENUM('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly') NOT NULL,
    message TEXT NOT NULL,
    meta JSON,
    timestamp DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
);
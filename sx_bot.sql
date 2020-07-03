CREATE TABLE sx_log (
    id int NOT NULL AUTO_INCREMENT,
    data_of_msg DATETIME DEFAULT NOW(),
    username VARCHAR(5000),
    msg VARCHAR(5000),
    typology VARCHAR(500),
    last_id INT DEFAULT 0,
    max_id INT,
    PRIMARY KEY(id)
);

INSERT INTO sx_log (username, msg, typology, last_id, max_id) VALUES ("root", "Root of the BOT", "ROOT", 1, 1);
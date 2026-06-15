CREATE DATABASE IF NOT EXISTS ymmo;
USE ymmo;

CREATE TABLE IF NOT EXISTS agences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    adresse VARCHAR(255),
    ville VARCHAR(100),
    telephone VARCHAR(20)
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('client', 'commercial', 'admin') DEFAULT 'client',
    agence_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agence_id) REFERENCES agences(id)
);

CREATE TABLE IF NOT EXISTS biens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(200) NOT NULL,
    description TEXT,
    type ENUM('résidentiel', 'professionnel') NOT NULL,
    statut ENUM('disponible', 'en_négociation', 'vendu') DEFAULT 'disponible',
    prix DECIMAL(12, 2) NOT NULL,
    surface DECIMAL(8, 2),
    adresse VARCHAR(255),
    ville VARCHAR(100),
    agence_id INT,
    commercial_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (agence_id) REFERENCES agences(id),
    FOREIGN KEY (commercial_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS photos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bien_id INT NOT NULL,
    url VARCHAR(500) NOT NULL,
    ordre INT DEFAULT 0,
    FOREIGN KEY (bien_id) REFERENCES biens(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bien_id INT NOT NULL,
    client_id INT NOT NULL,
    commercial_id INT NOT NULL,
    date_transaction DATE,
    prix_final DECIMAL(12, 2),
    statut ENUM('en_cours', 'finalisée', 'annulée') DEFAULT 'en_cours',
    FOREIGN KEY (bien_id) REFERENCES biens(id),
    FOREIGN KEY (client_id) REFERENCES users(id),
    FOREIGN KEY (commercial_id) REFERENCES users(id)
);

-- Données de test
INSERT INTO agences (nom, adresse, ville, telephone) VALUES
('Siège Aix-en-Provence', '12 Cours Mirabeau', 'Aix-en-Provence', '0442000001'),
('Agence Paris', '5 Rue de Rivoli', 'Paris', '0140000002'),
('Agence Lyon', '10 Place Bellecour', 'Lyon', '0472000003');

INSERT INTO users (nom, prenom, email, password_hash, role, agence_id) VALUES
('Admin', 'Ymmo', 'admin@ymmo.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', 1),
('Dupont', 'Jean', 'jean.dupont@ymmo.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'commercial', 2),
('Martin', 'Sophie', 'sophie.martin@ymmo.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'commercial', 3),
('Client', 'Test', 'client@test.fr', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'client', NULL);

-- password pour tous : "password"

INSERT INTO biens (titre, description, type, statut, prix, surface, adresse, ville, agence_id, commercial_id) VALUES
('Appartement T3 lumineux', 'Bel appartement au 3ème étage avec balcon et vue dégagée.', 'résidentiel', 'disponible', 245000.00, 68.50, '14 Rue des Lilas', 'Paris', 2, 2),
('Maison avec jardin', 'Maison familiale 5 pièces avec jardin de 300m².', 'résidentiel', 'disponible', 389000.00, 120.00, '3 Allée des Roses', 'Lyon', 3, 3),
('Bureau moderne', 'Plateau de bureaux open space, proche transports.', 'professionnel', 'disponible', 180000.00, 95.00, '8 Avenue de la République', 'Paris', 2, 2),
('Studio étudiant', 'Studio meublé idéal pour étudiant, proche université.', 'résidentiel', 'vendu', 89000.00, 22.00, '2 Rue de la Paix', 'Lyon', 3, 3),
('Villa de prestige', 'Magnifique villa avec piscine et vue mer.', 'résidentiel', 'en_négociation', 950000.00, 280.00, '17 Chemin des Collines', 'Aix-en-Provence', 1, 2);
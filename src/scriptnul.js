





// Définir un tableau de 4 couleurs (vous pouvez les modifier selon vos préférences)
const trailColors = [
    new THREE.Color(1.0, 0.0, 0.0), // Rouge
    new THREE.Color(0.0, 1.0, 0.0), // Vert
    new THREE.Color(0.0, 0.0, 1.0), // Bleu
    new THREE.Color(1.0, 1.0, 0.0)  // Jaune
];
let currentColorIndex = 0; // Index pour suivre la couleur actuelle dans le cycle

function moveSmokeAvoidObject() {
    const bodyPosition = body.position; // Position de la balle
    const influenceRadius = 3; // Rayon d'influence de la balle
    const attractionStrength = 0.06; // Force d'attraction
    const maxDistance = 15; // Distance maximale de déplacement des particules
    const airResistance = 0.994; // Résistance de l'air
    const dragCoefficient = 0.9; // Coefficient de traînée
    const spread = 11; // Limite de la zone de déplacement des particules
    const centeringForce = 0.001; // Force de rappel vers le centre
    const reboundFactor = 0.8; // Coefficient de rebond partiel
    const dispersionStrength = 0.002; // Force de dispersion des particules

    for (let i = 0; i < numberOfParticles; i++) {
        // Récupérer les positions et vitesses des particules
        let x = positions[i * 3];
        let y = positions[i * 3 + 1];
        let z = positions[i * 3 + 2];
        let vx = velocities[i * 3];
        let vy = velocities[i * 3 + 1];
        let vz = velocities[i * 3 + 2];

        // Calculer la direction d'attraction vers la balle
        let dx = bodyPosition.x - x;
        let dy = bodyPosition.y - y;
        let dz = bodyPosition.z - z;
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Si la particule est dans le rayon d'influence
        if (distance < influenceRadius) {
            // Appliquer la force d'attraction
            const attractionForce = (influenceRadius - distance) / influenceRadius;
            vx += (dx / distance) * attractionForce * attractionStrength;
            vy += (dy / distance) * attractionForce * attractionStrength;
            vz += (dz / distance) * attractionForce * attractionStrength;

            // Changer la couleur de la particule en fonction du cycle de couleurs
            const color = trailColors[currentColorIndex];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Passer à la couleur suivante dans le cycle
            currentColorIndex = (currentColorIndex + 1) % trailColors.length;
        }

        // Appliquer la résistance de l'air en fonction de la vitesse
        let speed = Math.sqrt(vx * vx + vy * vy + vz * vz);
        let drag = dragCoefficient * speed * speed; // Force de traînée, proportionnelle au carré de la vitesse
        let dragX = (vx / speed) * drag;
        let dragY = (vy / speed) * drag;
        let dragZ = (vz / speed) * drag;

        // Appliquer la traînée aux vitesses
        vx -= dragX;
        vy -= dragY;
        vz -= dragZ;

        // Appliquer la résistance de l'air
        vx *= airResistance;
        vy *= airResistance;
        vz *= airResistance;

        // Appliquer la force de dispersion aux particules de la traînée
        if (distance > influenceRadius && distance < maxDistance) {
            vx += (Math.random() - 0.5) * dispersionStrength;
            vy += (Math.random() - 0.5) * dispersionStrength;
        }

        // Déplacer la particule avec la vitesse mise à jour
        x += vx;
        y += vy;
        z += vz;

        // Limiter la distance de déplacement des particules
        let distanceFromOrigin = Math.sqrt(x * x + y * y + z * z);
        if (distanceFromOrigin > maxDistance) {
            let scale = maxDistance / distanceFromOrigin;
            x *= scale;
            y *= scale;
            z *= scale;
        }

        // Limiter les particules à l'intérieur de la zone fluide avec un rebond partiel
        if (x < -spread || x > spread) vx *= -reboundFactor;
        if (y < -spread || y > spread) vy *= -reboundFactor;
        if (z < -spread || z > spread) vz *= -reboundFactor;

        // Réaffecter les nouvelles positions et vitesses
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;
        velocities[i * 3] = vx;
        velocities[i * 3 + 1] = vy;
        velocities[i * 3 + 2] = vz;
    }

    // Mettre à jour la géométrie avec les nouvelles positions et couleurs
    smokeGeometry.attributes.position.needsUpdate = true;
    smokeGeometry.attributes.color.needsUpdate = true;
}




function moveSmokeAvoidObject() {
    const bodyPosition = body.position; // Position de la balle
    const influenceRadius = 3; // Rayon d'influence pour X et Y
    const influenceRadiusZ = 6; // Rayon d'influence plus grand pour Z
    const attractionStrength = 0.06; // Force d'attraction
    const zAttractionScale = 2.0; // Facteur pour augmenter l'attraction sur Z

    for (let i = 0; i < numberOfParticles; i++) {
        // Récupérer les positions et vitesses des particules
        let x = positions[i * 3];
        let y = positions[i * 3 + 1];
        let z = positions[i * 3 + 2];
        let vx = velocities[i * 3];
        let vy = velocities[i * 3 + 1];
        let vz = velocities[i * 3 + 2];

        // Calculer la direction d'attraction vers la balle
        let dx = bodyPosition.x - x;
        let dy = bodyPosition.y - y;
        let dz = bodyPosition.z - z;
        let distance = Math.sqrt(dx * dx + dy * dy + dz * dz);

        // Vérifier si la particule est dans le rayon d'influence (avec un rayon plus grand pour Z)
        if (Math.sqrt(dx * dx + dy * dy) < influenceRadius && Math.abs(dz) < influenceRadiusZ) {
            // Appliquer la force d'attraction
            const attractionForce = (influenceRadius - distance) / influenceRadius;
            vx += (dx / distance) * attractionForce * attractionStrength;
            vy += (dy / distance) * attractionForce * attractionStrength;
            vz += (dz / distance) * attractionForce * attractionStrength * zAttractionScale; // Appliquer le facteur d'échelle
        }

        // ... le reste de votre code
    }

    // Mettre à jour la géométrie avec les nouvelles positions
    smokeGeometry.attributes.position.needsUpdate = true;
}



// Tableau des couleurs de la traînée
const trailColors = [
    new THREE.Color("#ff0000"), // Rouge
    new THREE.Color("#00ff00"), // Vert
    new THREE.Color("#0000ff"), // Bleu
    // Ajoutez d'autres couleurs si nécessaire
];

// Index de la couleur actuelle
let currentColorIndex = 0;

// Compteur pour contrôler la fréquence de changement de couleur
let colorChangeCounter = 0;

// Fréquence de changement de couleur (par exemple, tous les 10 cycles)
const colorChangeFrequency = 10;

function updateParticles() {
    for (let i = 0; i < numberOfParticles; i++) {
        // Calcul des distances et des forces d'attraction
        // ...

        // Si la particule est dans le rayon d'influence
        if (distance < influenceRadius) {
            const attractionForce = (influenceRadius - distance) / influenceRadius;
            vx += (dx / distance) * attractionForce * attractionStrength;
            vy += (dy / distance) * attractionForce * attractionStrength;
            vz += (dz / distance) * attractionForce * attractionStrength;

            // Appliquer la couleur actuelle à la particule
            const color = trailColors[currentColorIndex];
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;
        }
    }

    // Incrémenter le compteur de changement de couleur
    colorChangeCounter++;

    // Changer de couleur après un certain nombre d'itérations
    if (colorChangeCounter >= colorChangeFrequency) {
        // Passer à la couleur suivante dans le cycle
        currentColorIndex = (currentColorIndex + 1) % trailColors.length;
        // Réinitialiser le compteur
        colorChangeCounter = 0;
    }

    // Indiquer que les couleurs des particules ont été mises à jour
    smokeGeometry.attributes.color.needsUpdate = true;
}






// Tableau des couleurs
const trailColors = [
    new THREE.Color("#ff0000"), // Rouge
    new THREE.Color("#00ff00"), // Vert
    new THREE.Color("#0000ff"), // Bleu
    // Ajoutez d'autres couleurs si nécessaire
];

// Index de la couleur actuelle
let currentColorIndex = 0;

// Fonction pour changer la couleur toutes les secondes
setInterval(() => {
    // Passer à la couleur suivante dans le tableau
    currentColorIndex = (currentColorIndex + 1) % trailColors.length;
}, 1000); // 1000 millisecondes = 1 seconde

function updateParticles() {
    // Récupérer la couleur actuelle
    const currentColor = trailColors[currentColorIndex];

    for (let i = 0; i < numberOfParticles; i++) {
        // Appliquer la couleur actuelle à chaque particule
        colors[i * 3] = currentColor.r;
        colors[i * 3 + 1] = currentColor.g;
        colors[i * 3 + 2] = currentColor.b;

        // Logique de mise à jour des positions des particules
        // ...
    }

    // Indiquer que les couleurs des particules ont été mises à jour
    smokeGeometry.attributes.color.needsUpdate = true;
}






let colorChangeCounter = 0; // Compteur pour ralentir l'alternance des couleurs
const colorChangeInterval = 10; // Changer de couleur tous les 10 particules
let currentColorIndex = 0; // Index de la couleur actuelle
let nextColorIndex = 1; // Index de la couleur suivante
let interpolationFactor = 0; // Facteur d'interpolation entre les couleurs

function moveSmokeAvoidObject() {
    // ... le reste de votre code

    for (let i = 0; i < numberOfParticles; i++) {
        // ... le reste de votre code

        // Si la particule est dans le rayon d'influence
        if (distance < influenceRadius) {
            // Appliquer la force d'attraction
            const attractionForce = (influenceRadius - distance) / influenceRadius;
            vx += (dx / distance) * attractionForce * attractionStrength;
            vy += (dy / distance) * attractionForce * attractionStrength;
            vz += (dz / distance) * attractionForce * attractionStrength;

            // Interpoler entre les couleurs actuelles et suivantes
            const color = trailColors[currentColorIndex].clone().lerp(trailColors[nextColorIndex], interpolationFactor);
            colors[i * 3] = color.r;
            colors[i * 3 + 1] = color.g;
            colors[i * 3 + 2] = color.b;

            // Mettre à jour le facteur d'interpolation
            interpolationFactor += 0.01; // Ajustez cette valeur pour contrôler la vitesse de transition
            if (interpolationFactor >= 1) {
                interpolationFactor = 0;
                currentColorIndex = nextColorIndex;
                nextColorIndex = (nextColorIndex + 1) % trailColors.length;
            }
        }

        // ... le reste de votre code
    }

    // Mettre à jour la géométrie avec les nouvelles positions et couleurs
    smokeGeometry.attributes.position.needsUpdate = true;
    smokeGeometry.attributes.color.needsUpdate = true;
}



// Tableau des couleurs
const trailColors = [
    new THREE.Color("#ff0000"), // Rouge
    new THREE.Color("#00ff00"), // Vert
    new THREE.Color("#0000ff"), // Bleu
    // Ajoutez d'autres couleurs si nécessaire
];

// Index de la couleur actuelle
let currentColorIndex = 0;
let nextColorIndex = 1;

// Temps du dernier changement de couleur
let lastColorChangeTime = Date.now();

// Intervalle de changement de couleur en millisecondes
const colorChangeInterval = 5000; // 5 secondes

function updateParticles() {
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastColorChangeTime;

    // Calculer le facteur d'interpolation (entre 0 et 1)
    const t = Math.min(elapsedTime / colorChangeInterval, 1);

    // Couleurs de départ et d'arrivée
    const currentColor = trailColors[currentColorIndex];
    const nextColor = trailColors[nextColorIndex];

    // Couleur interpolée
    const interpolatedColor = currentColor.clone().lerp(nextColor, t);

    // Appliquer la couleur interpolée à toutes les particules
    for (let i = 0; i < numberOfParticles; i++) {
        colors[i * 3] = interpolatedColor.r;
        colors[i * 3 + 1] = interpolatedColor.g;
        colors[i * 3 + 2] = interpolatedColor.b;
    }

    // Indiquer que les couleurs des particules ont été mises à jour
    smokeGeometry.attributes.color.needsUpdate = true;

    // Si l'intervalle de changement de couleur est écoulé, passer à la couleur suivante
    if (elapsedTime >= colorChangeInterval) {
        lastColorChangeTime = currentTime;
        currentColorIndex = nextColorIndex;
        nextColorIndex = (nextColorIndex + 1) % trailColors.length;
    }
}








let interpolationFactor = 0; // Facteur d'interpolation entre les couleurs

function moveSmokeAvoidObject() {
    // ... le reste de votre code

    // Vérifier si 3 secondes se sont écoulées depuis le dernier changement de couleur
    const currentTime = Date.now();
    if (currentTime - lastColorChangeTime >= colorChangeInterval) {
        // Passer à la couleur suivante dans le cycle
        currentColorIndex = (currentColorIndex + 1) % trailColors.length;
        lastColorChangeTime = currentTime; // Mettre à jour le temps du dernier changement
        interpolationFactor = 0; // Réinitialiser le facteur d'interpolation
    }

    // Interpoler entre la couleur actuelle et la suivante
    const currentColor = trailColors[currentColorIndex];
    const nextColor = trailColors[(currentColorIndex + 1) % trailColors.length];
    const interpolatedColor = currentColor.clone().lerp(nextColor, interpolationFactor);

    for (let i = 0; i < numberOfParticles; i++) {
        // ... le reste de votre code

        // Si la particule est dans le rayon d'influence
        if (distance < influenceRadius) {
            // Appliquer la couleur interpolée
            colors[i * 3] = interpolatedColor.r;
            colors[i * 3 + 1] = interpolatedColor.g;
            colors[i * 3 + 2] = interpolatedColor.b;
        }

        // ... le reste de votre code
    }

    // Mettre à jour le facteur d'interpolation
    interpolationFactor += 0.01; // Ajustez cette valeur pour contrôler la vitesse de transition
    if (interpolationFactor > 1) interpolationFactor = 1;

    // ... le reste de votre code
}















const fontLoader = new FontLoader();

let text;
let updateText;
let score = 0;

let rotationSpeed_ = 0.15; // Vitesse de rotation
let jumpHeight_ = 1; // Hauteur du bond
let rotationCount_ = 0;
let maxRotations_ = Math.PI * 2; // Une rotation complète
let startY_;

// Créer un groupe pour servir de pivot
const textPivot = new THREE.Group();
scene.add(textPivot);

fontLoader.load(
    '/fonts/helvetiker_regular.typeface.json',
    (font) => {
        const textGeometry = new THREE.TextGeometry(
            score.toString(), // Affiche "0" au début
            {
                font: font,
                size: 2,
                depth: 0.2,
                curveSegments: 2,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 1
            }
        );

        text = new THREE.Mesh(textGeometry, normal);

        // Centrer le texte
        text.geometry.computeBoundingBox();
        const box_ = text.geometry.boundingBox;
        const centerX_ = (box_.max.x + box_.min.x) / 2;
        const centerY_ = (box_.max.y + box_.min.y) / 2;
        const centerZ_ = (box_.max.z + box_.min.z) / 2;
        text.geometry.translate(-centerX_, -centerY_, -centerZ_);

        // Positionner le texte dans le groupe pivot
        text.position.set(0, 0, 0); // Position relative au pivot
        textPivot.add(text);

        // Positionner le pivot dans la scène
        textPivot.position.set(10, -4.5, 8);
        textPivot.rotation.y = Math.PI / 2;

        // Sauvegarder la position initiale du pivot
        const sauvPos1_ = textPivot.position.clone();
        const sauvRot1_ = textPivot.rotation.clone();
        startY_ = textPivot.position.y;

        // Fonction pour mettre à jour le texte
        updateText = function () {
            score++;
            text.geometry.dispose();

            text.geometry = new THREE.TextGeometry(score.toString(), {
                font: font,
                size: 2,
                depth: 0.2,
                curveSegments: 2,
                bevelThickness: 0.03,
                bevelSize: 0.02,
                bevelOffset: 0,
                bevelSegments: 1
            });

            // Réinitialiser la rotation et démarrer l'animation
            rotationCount_ = 0;
            animateRotation_();
        };

        // Démarrer l'animation initiale
        animateRotation_();
    }
);

function animateRotation_() {
    if (rotationCount_ < maxRotations_) {
        // Appliquer la rotation au pivot
        textPivot.rotation.y += rotationSpeed_;

        // Ajouter un léger bond en sinus
        textPivot.position.y = startY_ + Math.sin(rotationCount_) * jumpHeight_;

        rotationCount_ += rotationSpeed_;
        requestAnimationFrame(animateRotation_); // Continuer l'animation
    } else {
        // Réinitialiser la rotation et la position du pivot
        textPivot.rotation.copy(sauvRot1_);
        textPivot.position.copy(sauvPos1_);
    }
}
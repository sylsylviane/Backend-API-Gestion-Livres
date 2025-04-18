# API de Gestion des Livres
Ce projet a été exécuté dans le cadre du cours de **Techniques avancées en programmation Web** 

## Objectifs

-   Créer un service Web en REST utilisant Node.js et Express.js servant à fournir des données à un site Web de produits.
-   Le thème de votre site est au choix. Vous pouvez choisir de faire un site de critiques de films, de services. Limitez-vous à un seul type de produit.
-   Utiliser adéquatement une base de données infonuagique sur [Firestore](https://firebase.google.com/docs/firestore) de Google Cloud Platform
-   Utiliser adéquatement les requêtes HTTP GET, POST, PUT et DELETE ainsi que les codes de statut HTTP.
-   Gérer les erreurs et retourner les messages adéquats.
-   Déployer le service Web sur [Render](https://www.render.com/) à partir d'un dépôt GitHub (gratuit).

> Lien render: https://tp1-tech-av-prog-web.onrender.com/

L'API de gestion des livres permet aux utilisateurs:

    - Ajouter un livre à la base de données.
    - Récupérer tous les livres de la base de données et possibilité de les ordonner par titre, auteur ou date (ordre ascendant ou descendant) et limiter le nombre de documents retournés.
    - Récupérer un seul livre de la base de données par son identifiant.
    - Récupérer des livres selon leur catégorie.
    - Récupérer des livres selon leur auteur et ordonner par date ascendante ou descendante.
    - Récupérer un livre selon son isbn.
    - Modifier un livre de la base de données par son identifiant.
    - Supprimer un livre de la base de données par son identifiant.


## Authentification

L'API utilise l'authentification basée sur les tokens JWT (JSON Web Tokens) et permet de :

    - S'inscrire en tant qu'utilisateur avec un courriel et un mot de passe.
    - Se connecter avec un courriel et un mot de passe.

## Routes

### Récupérer la liste des livres (GET)

**Route:** `/livres`

**Description:** Retourne la liste de tous les livres et leur identifiant.

**Requête:**

```http
GET /livres

Réponse:
[
    {
        "id": "hrAV1ta0clRgMJhzhGft",
        "titre": "Billy Summers",
        "description": " Billy Summers est un tueur à gages - le meilleur -, mais il n'accepte de liquider que les salauds. Aujourd'hui, il veut décrocher. Avant cela, seul dans sa chambre, il se prépare pour sa dernière mission.... À la fois thriller, récit de guerre, road trip et déclaration d'amour à l'Amérique des petites villes, Billy Summers est l'un des textes les plus surprenants de l'oeuvre de Stephen King, qui y a mis tout son génie et toute son humanité..",
        "editeur": "Le livre de poche",
        "isbn": "9782253247432",
        "pages": "722",
        "date": "2024",
        "image": "billy-summers.jpg",
        "auteur": "Stephen King",
        "categories": [
            "Science Fiction",
            "Fantastique"
        ]
    },
    {
        "id": "Y7NbtSnZ7Pp7AJ656vMD",
        "titre": "C'est aussi ça, l'Amérique: portraits d'un pays polarisé",
        "description": "Les États-Unis sont-ils brisés? Armes à feu, avortement, religion, (dés)information, justice… Pourquoi ces enjeux divisent-ils plus que jamais les Américains ? Le journaliste Frédéric Arnould a sillonné les États-Unis et rencontré une foule de citoyens de tous horizons, soulevant – sans jamais la poser – cette éternelle question : « Qu’est-ce qui se passe avec vous, les Américains? » Un portrait instructif et humain de ce pays plein de promesses, qui garantit à ses citoyens une grande liberté et les outils pour la défendre… pour le meilleur et pour le pire.",
        "editeur": "Québec Amérique",
        "isbn": "9782764454992",
        "pages": "288",
        "date": "2025",
        "image": "amerique-portrait-pays-polarise.jpg",
        "auteur": "Frédéric Arnould",
        "categories": [
            "Politique"
        ]
    }
    ...
]

```
### Ajouter un livre (POST)

**Route:** `/livres`

**Description:** Ajoute un livre à la base de données.

**Requête:**

```http
POST /livres

Body:
{
        "titre": "C'est aussi ça, l'Amérique: portraits d'un pays polarisé",
        "description": "Les États-Unis sont-ils brisés? Armes à feu, avortement, religion, (dés)information, justice… Pourquoi ces enjeux divisent-ils plus que jamais les Américains ? Le journaliste Frédéric Arnould a sillonné les États-Unis et rencontré une foule de citoyens de tous horizons, soulevant – sans jamais la poser – cette éternelle question : « Qu’est-ce qui se passe avec vous, les Américains? » Un portrait instructif et humain de ce pays plein de promesses, qui garantit à ses citoyens une grande liberté et les outils pour la défendre… pour le meilleur et pour le pire.",
        "editeur": "Québec Amérique",
        "isbn": "9782764454992",
        "pages": "288",
        "categories": "Politique",
        "date": "2025",
        "image": "amerique-portrait-pays-polarise.jpg",
        "auteur": "Frédéric Arnould"
}

Réponses possibles:

{ message: "Le livre a été ajouté." }

ou

{message: "Ce livre est déjà présent dans la base de données. Veuillez entrer un autre livre."}

```
### Récupérer un livre (GET)

**Route:** `/livres/:id`

**Description:** Retourne un livre et son identifiant.

**Requête:**

```http
GET /livres/hrAV1ta0clRgMJhzhGft

Réponse: 
{
    "titre": "Billy Summers",
    "description": " Billy Summers est un tueur à gages - le meilleur -, mais il n'accepte de liquider que les salauds. Aujourd'hui, il veut décrocher. Avant cela, seul dans sa chambre, il se prépare pour sa dernière mission.... À la fois thriller, récit de guerre, road trip et déclaration d'amour à l'Amérique des petites villes, Billy Summers est l'un des textes les plus surprenants de l'oeuvre de Stephen King, qui y a mis tout son génie et toute son humanité..",
    "editeur": "Le livre de poche",
    "isbn": "9782253247432",
    "pages": "722",
    "date": "2024",
    "image": "billy-summers.jpg",
    "auteur": "Stephen King",
    "categories": [
        "Science Fiction",
        "Fantastique"
    ],
    "id": "hrAV1ta0clRgMJhzhGft"
}

```

### Récupérer les livres d'un auteur (GET)

**Route:** `/livres/auteur/:auteur`

**Description:** Retourne les livres d'un auteur et leur identifiant.

**Requête:**

```http
GET /livres/auteur/stephen-king

Réponse:
[
    {
        "id": "Ah4Fowm50gCzzA3JEntz",
        "date": "2013",
        "image": "the-shinning.jpg",
        "pages": "",
        "titre": "The shinning",
        "isbn": "9780307743657",
        "description": "Jack Torrance’s new job at the Overlook Hotel is the perfect chance for a fresh start. As the off-season caretaker at the atmospheric old hotel, he’ll have plenty of time to spend reconnecting with his family and working on his writing. But as the harsh winter weather sets in, the idyllic location feels ever more remote . . . and more sinister. And the only one to notice the strange and terrible forces gathering around the Overlook is Danny Torrance, a uniquely gifted five-year-old.",
        "auteur": "Stephen King",
        "editeur": "Anchor",
        "categories": [
            "Science Fiction",
            "Fantastique"
        ]
    },
    {
        "id": "Ja0VoNxerSbPJ7x6vmmY",
        "titre": "Plus noir que noir",
        "description": "Un secret bien gardé est à l'origine du talent de deux artistes, un flash psychique sans précédent bouleverse de manière catastrophique l'existence de Danny, un veuf éploré se rend en Floride et reçoit un héritage inattendu accompagné d'importantes obligations, un vétéran du Vietnam répond à une offre d'emploi, etc. Douze nouvelles plongeant dans les tréfonds les plus sombres de la vie.",
        "editeur": "Albin Michel",
        "isbn": "9782226493101",
        "pages": "550",
        "date": "2025",
        "image": "plus-noir-que-noir.jpg",
        "auteur": "Stephen King",
        "categories": [
            "Horreur"
        ]
    },
    {
        "id": "hrAV1ta0clRgMJhzhGft",
        "titre": "Billy Summers",
        "description": " Billy Summers est un tueur à gages - le meilleur -, mais il n'accepte de liquider que les salauds. Aujourd'hui, il veut décrocher. Avant cela, seul dans sa chambre, il se prépare pour sa dernière mission.... À la fois thriller, récit de guerre, road trip et déclaration d'amour à l'Amérique des petites villes, Billy Summers est l'un des textes les plus surprenants de l'oeuvre de Stephen King, qui y a mis tout son génie et toute son humanité..",
        "editeur": "Le livre de poche",
        "isbn": "9782253247432",
        "pages": "722",
        "date": "2024",
        "image": "billy-summers.jpg",
        "auteur": "Stephen King",
        "categories": [
            "Science Fiction",
            "Fantastique"
        ]
    }
]

```

### Récupérer un livre selon son ISBN (GET)

**Route:** `/livres/isbn/:isbn`

**Description:** Retourne un livre et son identifiant selon son ISBN.

**Requête:**

```http
GET /livres/isbn/9782824627571

Réponse:
[
    {
        "id": "MGyG0X72PG4EYmq2ZJIH",
        "titre": "La femme de ménage voit tout",
        "auteur": "Freida Mcfadden",
        "description": "« Je me demande si je n'ai pas commis une terrible erreur en m'installant ici... » . Après avoir été au service des autres en tant que femme de ménage, Millie s'est enfin construit une vie à elle. Elle vient même d'emménager dans une belle maison, dans une petite impasse chic et tranquille, avec son mari et ses deux enfants.. Mais son rêve d'une vie paisible est rapidement terni par la rencontre de ses voisins. Il y a Suzette, bien trop snob et aguicheuse, son insipide mari, mais surtout leur terrifiante femme de ménage au regard perçant et au comportement plus que suspect.. Les craintes de Millie montent d'un cran lorsque des bruits étranges se font entendre la nuit dans sa propre maison. Pire : elle éprouve un étrange malaise et se sent épiée. C'est certain, quelque chose ne tourne pas rond dans cette rue si tranquille. Mais est-elle prête à en découvrir les secrets ? Et surtout, le temps de comprendre ce qui ne va pas, tout peut arriver.... Elle vous observe. Et vous n'avez nulle part où vous cacher.",
        "editeur": "City Ed.",
        "isbn": "9782824627571",
        "pages": "392",
        "date": "2024",
        "image": "femme-menage-voit-tout.jpg",
        "categories": [
            "Policier"
        ]
    }
]
```
### Récupérer un livre selon les catégories (GET)

**Route:** `/livres/categories/:categories`

**Description:** Retourne les livres et leur identifiant selon la catégorie .

**Requête:**

```http
GET /livres/categories/policier

Réponse:
[
    {
        "id": "MGyG0X72PG4EYmq2ZJIH",
        "titre": "La femme de ménage voit tout",
        "auteur": "Freida Mcfadden",
        "description": "« Je me demande si je n'ai pas commis une terrible erreur en m'installant ici... » . Après avoir été au service des autres en tant que femme de ménage, Millie s'est enfin construit une vie à elle. Elle vient même d'emménager dans une belle maison, dans une petite impasse chic et tranquille, avec son mari et ses deux enfants.. Mais son rêve d'une vie paisible est rapidement terni par la rencontre de ses voisins. Il y a Suzette, bien trop snob et aguicheuse, son insipide mari, mais surtout leur terrifiante femme de ménage au regard perçant et au comportement plus que suspect.. Les craintes de Millie montent d'un cran lorsque des bruits étranges se font entendre la nuit dans sa propre maison. Pire : elle éprouve un étrange malaise et se sent épiée. C'est certain, quelque chose ne tourne pas rond dans cette rue si tranquille. Mais est-elle prête à en découvrir les secrets ? Et surtout, le temps de comprendre ce qui ne va pas, tout peut arriver.... Elle vous observe. Et vous n'avez nulle part où vous cacher.",
        "editeur": "City Ed.",
        "isbn": "9782824627571",
        "pages": "392",
        "date": "2024",
        "image": "femme-menage-voit-tout.jpg",
        "categories": [
            "Policier"
        ]
    },
    {
        "id": "ckhr4rddO3LntUjpoHPv",
        "titre": "À qui sait attendre",
        "auteur": "Micheal Connelly",
        "description": "Harry Bosch et Renée Ballard enquêtent sur des cold cases qui ont marqué la cité des anges . À la tête de l'unité des Affaires non résolues, Renée Ballard retrouve la trace, grâce à l'ADN, d'un violeur en série qui a terrorisé Los Angeles deux décennies plus tôt avant de disparaître. Mais très vite, elle va se heurter à des secrets et à des obstacles juridiques qui la forcent à demander son aide à Harry Bosch.. Et cette fois, elle pourra compter sur une autre alliée : Maddie, la fille de Harry, qui rejoint l'unité et dévoile des documents surprenants concernant l'affaire la plus emblématique du siècle dernier, celle du Dahlia noir.. Alors que la première enquête devient dangereuse, Ballard, Harry et Maddie ne seront pas de trop pour retrouver des criminels que les familles des victimes attendent depuis longtemps déjà de voir arrêtés..",
        "editeur": "Calmann-levy",
        "isbn": "9782702189047",
        "pages": "480",
        "date": "2025",
        "image": "qui-sait-attendre.jpg",
        "categories": [
            "Policier"
        ]
    }
]

```
### Supprimer un livre (DELETE)

**Route:** `/livres/:id`

**Description:** Supprime un livre de la base de données.

**Requête:**

```http
DELETE /livres/MGyG0X72PG4EYmq2ZJIH

Réponses possibles:

{ message: "Le livre a été supprimé." }

ou

{message: "Le livre n'existe pas. Réessayer avec un autre identifiant."}

```

### Modifier un livre (PUT)

**Route:** `/livres/:id`

**Description:** Met à jour les informations d'un livre existant.

**Requête:**

```http
PUT /livres/3JNbUmSeTiuWhnu3ZO5q

Body:

{
       "id": "3JNbUmSeTiuWhnu3ZO5q",
        "date": "2024",
        "image": "art-pas-toujours-raison.jpg",
        "pages": "120",
        "titre": "L'Art de ne pas toujours avoir raison",
        "isbn": "9782760994935 ",
        "description": "Le dialogue démocratique est-il encore possible alors que les  médias sociaux et la joute politique favorisent les réactions épidermiques et polarisantes ? Comment sortir du cul-de-sac dans lequel nous sommes coincés et apprendre à discuter d’enjeux sociaux de manière à la fois robuste, inclusive et productive ? Car si nous sommes enclins à vouloir persuader l’autre, nous sommes étrangement démunis quand vient le temps de l’écouter et de nous laisser convaincre. Pourtant, tout échange authentique suppose que nous puissions avoir tort.. Afin de se retrouver dans cette cacophonie, l’auteur propose, avec une lucidité pleine d’humour, une lecture fine de notre époque, de ses limites comme de ses promesses. Convoquant Montaigne, il montre à quel point l’humilité, l’ouverture, la souplesse, la curiosité et l’écoute sont des vertus intellectuelles précieuses, que nous aurions plus que jamais intérêt à cultiver..",
        "categories": [
            "Philosophie Contemporaine"
        ],
        "auteur": "Martin Desrosiers",
        "editeur": "Lemeac" 
}

Réponses possibles: 

    {
    "message": "Le livre a été modifié",
    "livre": {
        "id": "3JNbUmSeTiuWhnu3ZO5q",
        "date": "2024",
        "image": "art-pas-toujours-raison.jpg",
        "pages": "120",
        "titre": "L'Art de ne pas toujours avoir raison",
        "isbn": "9782760994935 ",
        "description": "Le dialogue démocratique est-il encore possible alors que les médias sociaux et la joute politique favorisent les réactions épidermiques et polarisantes ? Comment sortir du cul-de-sac dans lequel nous sommes coincés et apprendre à discuter d’enjeux sociaux de manière à la fois robuste, inclusive et productive ? Car si nous sommes enclins à vouloir persuader l’autre, nous sommes étrangement démunis quand vient le temps de l’écouter et de nous laisser convaincre. Pourtant, tout échange authentique suppose que nous puissions avoir tort.. Afin de se retrouver dans cette cacophonie, l’auteur propose, avec une lucidité pleine d’humour, une lecture fine de notre époque, de ses limites comme de ses promesses. Convoquant Montaigne, il montre à quel point l’humilité, l’ouverture, la souplesse, la curiosité et l’écoute sont des vertus intellectuelles précieuses, que nous aurions plus que jamais intérêt à cultiver..",
        "categories": [
            "Philosophie Contemporaine"
        ],
        "auteur": "Martin Desrosiers",
        "editeur": "Lemeac"
    }
}

ou

{message: "Le livre n'existe pas. Réessayer avec un autre identifiant."}

```

### S'inscrire en tant qu'utilisateur (POST)

**Route:** `/utilisateurs/inscription`

**Description:** S'inscrire en tant qu'utilisateur avec un courriel et un mot de passe.

**Requête:**

```http
POST /utilisateurs/inscription

Body:
{
    "courriel": "lisa@gmail.com",
    "mdp": "Abc123!!"
}

Réponses possibles:

{ message: "Cet utilisateur existe déjà." }

ou

{ message: "L'utilisateur a été créé." }

```

### Se connecter en tant qu'utilisateur (POST)

**Route:** `/utilisateurs/connexion`

**Description:** Se connecter en tant qu'utilisateur avec un courriel et un mot de passe.

**Requête:**

```http
POST /utilisateurs/connexion

Body:
{
    "courriel": "lisa@gmail.com",
    "mdp": "Abc123!!"
}

Réponses possibles:

{ message: "Le courriel n'existe pas." }

ou

{ message: "Utilisateur connecté." }

```

### Modifier un utilisateur (PUT)

**Route:** `/utilisateurs/:id`

**Description:** Modifier un utilisateur.

**Requête:**

```http
PUT /utilisateurs/tkX89K8IQ7UqDmBAwfK7

Body:
{
    "courriel": "louis@gmail.com",
    "mdp": "Abc123!!"
}

Réponses possibles:

{
    "message": "L'utilisateur a été modifié.",
    "utilisateur": {
        "courriel": "louis@gmail.com",
        "mdp": "$2b$10$AFrKyKmvs3MXFGmSMdy9CO5AoFAxiMaHRxBXPAeUnb6O/WcxYoPCW"
    }
}

```

### Supprimer un utilisateur (DELETE)

**Route:** `/utilisateurs/:id`

**Description:** Supprimer un utilisateur.

**Requête:**

```http
DEL /utilisateurs/tkX89K8IQ7UqDmBAwfK7

Body:
{
    "courriel": "louis@gmail.com",
}

Réponse:

{ message: "L'utilisateur a été supprimé." }


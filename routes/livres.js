//IMPORTATION DES LIBRAIRIES
const express = require("express");
const routeur = express.Router();
//CONNEXION À LA BASE DE DONNÉES
const db = require("../config/db");
//IMPORTER LES FONCTIONS DE VALIDATION
const { check, validationResult } = require("express-validator");
//IMPORTATION DU MIDDLEWARE D'AUTHENTIFICATION
const auth = require("../middlewares/auth");
//CRÉATION DES ROUTES
/**
 * Route servant à récupérer tous les livres de la bases de données
 */
routeur.get(
  "/",
  [
    check("ordre")
      .escape()
      .trim()
      .optional()
      .isLength({ max: 100 })
      .isIn(["titre", "auteur", "date"])
      .withMessage("Vous pouvez ordonner par titre, auteur ou date."),
    check("direction")
      .escape()
      .trim()
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Choisissez entre asc ou desc."),
    check("limite").escape().trim().optional().isLength({ max: 1000 }),
    check("depart").escape().trim().optional().isLength({ max: 1000 }),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ msg: "Données invalides", erreurValidation });
      }
      const {
        ordre = "titre",
        direction = "asc",
        limite = 100,
        depart = 0,
      } = req.query;

      const livres = [];
      const donnees = await db
        .collection("livres")
        .orderBy(ordre, direction)
        .limit(Number(limite))
        .offset(Number(depart))
        .get();

      donnees.forEach((donnee) => {
        const livre = { id: donnee.id, ...donnee.data() };
        livres.push(livre);
      });

      if (ordre == "titre" && direction == "asc") {
        livres.sort((a, b) => {
          return a.titre.localeCompare(b.titre);
        })
      }
      if (ordre == "titre" && direction == "desc") {
        livres.sort((a, b) => {
          return b.titre.localeCompare(a.titre);
        });
      }
      if (ordre == "auteur" && direction == "asc") {
        livres.sort((a, b) => {
          return a.auteur.localeCompare(b.auteur);
        });
      }
      if (ordre == "auteur" && direction == "desc") {
        livres.sort((a, b) => {
          return b.auteur.localeCompare(a.auteur);
        });
      }

      if (livres.length == 0) {
        return res.status(404).json({ message: "Aucun livre trouvé" });
      }

      return res.status(200).json(livres);
    } catch (erreur) {
      return res.status(500).json({
        message:
          "La liste des livres n'a pas pu être récupéré. Réessayer dans quelques instants.",
      });
    }
  }
);

/**
 * Route permettant de filtrer les livres par auteur.
 */
routeur.get(
  "/auteur/:auteur",
  [
    check("auteur")
      .escape()
      .trim()
      .notEmpty()
      .isString()
      .isLength({ max: 100 })
      .withMessage(
        "Veuillez entrer un nom d'auteur de 100 caractères et moins."
      ),
    check("ordre")
      .escape()
      .trim()
      .optional()
      .isLength({ max: 100 })
      .isIn(["titre", "date"])
      .withMessage("Vous pouvez ordonner par titre ou date."),
    check("direction")
      .escape()
      .trim()
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Choisissez entre asc ou desc."),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }

      const { ordre = "date", direction = "asc" } = req.query;
      let { auteur } = req.params;

      auteur = auteur.split("-");
      auteur.forEach((mot, index) => {
        auteur[index] = mot[0].toUpperCase() + mot.slice(1);
      });
      auteur = auteur.join(" ");

      const livres = [];

      const donnees = await db
        .collection("livres")
        .orderBy(ordre, direction)
        .get();

      donnees.forEach((donnee) => {
        const livre = { id: donnee.id, ...donnee.data() };
        let livreAuteurNormalize = livre.auteur
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        if (livreAuteurNormalize == auteur) {
          livres.push(livre);
        }
      });
      if (ordre == "titre" && direction == "asc") {
        livres.sort((a, b) => {
          return a.titre.localeCompare(b.titre);
        });
      }
      if (ordre == "titre" && direction == "desc") {
        livres.sort((a, b) => {
          return b.titre.localeCompare(a.titre);
        });
      }
      if (livres.length == 0) {
        return res
          .status(404)
          .json({ msg: "Aucun livre trouvé pour cet auteur." });
      }
      return res.status(200).json(livres);
    } catch (erreur) {
      return res.status(500).json({
        message: "Une erreur est survenue. Réessayer dans quelques instants.",
      });
    }
  }
);

/**
 * Route permettant de filtrer les livres par catégorie (genre).
 */
routeur.get(
  "/categories/:categories",
  [
    check("categories")
      .escape()
      .trim()
      .notEmpty()
      .isString()
      .isLength({ max: 100 })
      .withMessage(
        "Veuillez entrer un nom de catégorie de 100 caractères et moins."
      ),
    check("ordre")
      .escape()
      .trim()
      .optional()
      .isLength({ max: 100 })
      .isIn(["titre", "date", "auteur"])
      .withMessage("Vous pouvez ordonner par titre ou date."),
    check("direction")
      .escape()
      .trim()
      .optional()
      .isIn(["asc", "desc"])
      .withMessage("Choisissez entre asc ou desc."),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
      const { ordre = "date", direction = "asc" } = req.query;
      let { categories } = req.params;
      categories = categories.split("-");

      categories.forEach((mot, index) => {
        categories[index] = mot[0].toUpperCase() + mot.slice(1);
      });

      categories = categories.join(" ");

      const livres = [];

      const donnees = await db
        .collection("livres")
        .where("categories", "array-contains", categories)
        .orderBy(ordre, direction)
        .get();

      donnees.forEach((donnee) => {
        const livre = { id: donnee.id, ...donnee.data() };
        livres.push(livre);
      });

      if (livres.length == 0) {
        return res
          .status(404)
          .json({ msg: "Aucun livre trouvé pour cette catégorie." });
      }

      return res.status(200).json(livres);
    } catch (erreur) {
      return res.status(500).json({
        message: "Une erreur est survenue. Réessayer dans quelques instants.",
      });
    }
  }
);

/**
 * Route permettant de filtrer les livres par isbn.
 */
routeur.get(
  "/isbn/:isbn",
  [
    check("isbn")
      .escape()
      .trim()
      .notEmpty()
      .isISBN()
      .withMessage("Veuillez entrer un ISBN valide."),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
      let { isbn } = req.params;

      const livres = [];

      const donnees = await db
        .collection("livres")
        .where("isbn", "==", isbn)
        .get();

      donnees.forEach((donnee) => {
        const livre = { id: donnee.id, ...donnee.data() };
        livres.push(livre);
      });
      if (livres.length == 0) {
        return res
          .status(404)
          .json({ msg: "Aucun livre trouvé pour cet isbn." });
      }
      return res.status(200).json(livres);
    } catch (erreur) {
      return res.status(500).json({
        message: "Une erreur est survenue. Réessayer dans quelques instants.",
      });
    }
  }
);

/**
 * Route servant à récupérer un livre de la bases de données
 */
routeur.get(
  "/:id",
  [
    check("id")
      .escape()
      .trim()
      .notEmpty()
      .isString()
      .isLength({ min: 20, max: 20 })
      .matches(/([A-z0-9\-\_]){20}/),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
      const { id } = req.params;

      const doc = await db.collection("livres").doc(id).get();

      const livre = doc.data();

      if (livre == null) {
        return res
          .status(404)
          .json({ message: "Le livre que vous recherchez n'existe pas." });
      } else {
        return res.status(200).json(livre);
      }
    } catch (erreur) {
      return res.status(500).json({
        message: "Une erreur est survenue. Réessayer dans quelques instants.",
      });
    }
  }
);

/**
 * Route servant à ajouter un livre dans la base de données
 */
routeur.post(
  "/",
  auth,
  [
    check("titre")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Le titre est obligatoire.")
      .isLength({ max: 250 })
      .withMessage("Le titre doit avoir 250 caractères maximum."),
    check("auteur")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("L'auteur est obligatoire.")
      .isLength({ max: 100 })
      .withMessage("Le nom de l'auteur doit avoir 100 caractères maximum."),
    check("description")
      .escape()
      .trim()
      .optional()
      .exists()
      .isLength({ max: 2000 })
      .withMessage(
        "Veuillez entrer une description de 2000 caractères et moins."
      ),
    check("editeur")
      .escape()
      .trim()
      .optional()
      .exists()
      .isLength({ max: 100 })
      .withMessage(
        "Veuillez entrer un nom d'éditeur de 100 caractères et moins."
      ),
    check("isbn")
      .escape()
      .trim()
      .notEmpty()
      .withMessage("Le champ ISBN est obligatoire.")
      .isISBN()
      .withMessage("Veuillez entrer un ISBN valide."),
    check("pages")
      .escape()
      .trim()
      .optional()
      .exists()
      .isLength({ max: 10 })
      .withMessage("Veuillez entrer un nombre de pages valides."),
    check("categories")
      .escape()
      .trim()
      .isArray()
      .notEmpty()
      .withMessage(
        "Une catégorie est obligatoire. Veuillez entrer au moins une catégorie."
      ),
    check("date")
      .escape()
      .trim()
      .optional()
      .exists()
      .isLength({ max: 4 })
      .withMessage("Veuillez entrer une année de publication valide. Ex: 2025"),
    check("image")
      .escape()
      .trim()
      .notEmpty()
      .withMessage(
        "Le champ image est obligatoire. Veuillez entrer une image."
      )
      .isLength({ max: 100 })
      .matches(/\.(jpeg|gif|png|jpg)$/)
      .withMessage(
        "Veuillez entrer une image de format .jpeg, .gif, .png ou .jpg."
      ),
  ],
  async (req, res) => {
    try {
      //Vérifier si les données sont valides
      const erreurValidation = validationResult(req);
      //Si les données ne sont pas valides
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
  
      const livres = []; //Créer un tableau pour stocker les livres
      const donnees = await db.collection("livres").get();//Récupérer les données de la base de données

      //Parcourir les données
      donnees.forEach((donnee) => {
        //Créer un objet livre avec l'identifiant et les données
        const livre = { id: donnee.id, ...donnee.data() };
        //Ajouter le livre dans le tableau
        livres.push(livre);
      });

      const { body } = req; //Récupérer les données du livre
      let livreExiste = false; //Créer une variable pour vérifier si le livre existe
      //Vérifier si le livre existe
      livres.forEach((livre) => {
        if (body.isbn === livre.isbn) {
          livreExiste = true;
        }
      });

      if (livreExiste) {
        return res.status(404).json({
          message:
            "Ce livre est déjà présent dans la base de données. Veuillez entrer un autre livre.",
        });
      } else {
        await db.collection("livres").add(body); //Ajouter le livre dans la base de données
        return res.status(201).json({ message: "Le livre a été ajouté." });
      }
    } catch (erreur) {
      return res.status(500).json({
        message: "Une erreur est survenue. Réessayez dans quelques instants.",
      });
    }
  }
);

/**
 * Route servant à initialiser la bases de données avec le fichier livresDepart.js
 */
routeur.post("/initialiser", auth, async (req, res) => {
  try {
    const livresDeDepart = require("./data/livresDepart");
    const livres = [];
    const donnees = await db.collection("livres").get();

    donnees.forEach((donnee) => {
      const livre = { id: donnee.id, ...donnee.data() };
      livresDeDepart.push(livre);
    });
    //Vérifier si les films sont déjà dans la base de données
    if (livresDeDepart !== null) {
      return res
        .status(400)
        .json({ message: "La base de données a déjà été initialisée." });
    } else {
      livres.forEach(async (livre) => {
        await db.collection("livres").add(livre);
      });
      return res.status(201).json({ message: "Base de données initialisée." });
    }
  } catch (erreur) {
    return res.status(500).json({ message: "Une erreur est survenues." });
  }
});

/**
 * Route servant à modifier un livre de la bases de données
 */
routeur.put(
  "/:id",
  auth,
  [
    check("id")
      .escape()
      .trim()
      .notEmpty()
      .isString()
      .isLength({ min: 20, max: 20 })
      .matches(/([A-z0-9\-\_]){20}/),
  ],
  
  async (req, res) => {
    try {
      //Vérifier si les données sont valides
      const erreurValidation = validationResult(req);
      //Si les données ne sont pas valides
      if (!erreurValidation.isEmpty()) {
        //Retourner un message d'erreur
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
      //Récupérer l'identifiant du livre
      const { id } = req.params;
      //Récupérer les données du livre
      const { body } = req;
  
      const livreDonnees = await db.collection("livres").doc(id).get(); //Récupérer le livre de la base de données 
      //Vérifier si le livre existe
      if (livreDonnees.exists == false) {
        return res.status(400).json({ message: "Le livre n'existe pas." });
      }
      //Modifier le livre
      await db.collection("livres").doc(id).update(body);
      //Retourner un message de succès
      return res
        .status(201)
        .json({ message: "Le livre a été modifié", livre: body });
    } catch (erreur) {
      //Retourner un message d'erreur
      return res.status(500).json({
        message:
          "Une erreur est survenue. Veuillez réessayer dans quelques instants",
      });
    }
  }
);

/**
 * Route servant à effacer un livre de la bases de données
 */
routeur.delete(
  "/:id",
  auth,
  [
    check("id")
      .escape()
      .trim()
      .notEmpty()
      .isString()
      .isLength({ min: 20, max: 20 })
      .matches(/([A-z0-9\-\_]){20}/),
  ],
  async (req, res) => {
    try {
      const erreurValidation = validationResult(req);
      if (!erreurValidation.isEmpty()) {
        return res
          .status(400)
          .json({ message: "Données invalides.", erreurValidation });
      }
      const { id } = req.params;
      const livres = [];
      let idExiste = false;
      const donnees = await db.collection("livres").get();

      donnees.forEach((donnee) => {
        const livre = { id: donnee.id, ...donnee.data() };
        livres.push(livre);
      });

      livres.forEach((item) => {
        if (id === item.id) {
          idExiste = true;
        }
      });
      if (idExiste) {
        await db.collection("livres").doc(id).delete();
        return res.status(200).json({ message: "Le livre a été supprimé." });
      } else {
        return res.status(404).json({
          message:
            "Le livre n'existe pas. Réessayer avec un autre identifiant.",
        });
      }
    } catch (erreur) {
      return res.status(500).json({
        message:
          "Le livre n'a pas pu être supprimé. Veuillez réessayer dans quelques instants",
      });
    }
  }
);

module.exports = routeur;

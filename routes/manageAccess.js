const { getFirestore } = require("firebase-admin/firestore");
const express = require("express");
const router = express.Router();

const db = getFirestore();

router.get("/fetch-enterprise", async (req, res) => {
  const snapshot = await db.collection("Enterprises").get();
  snapshot.forEach((doc) => {
    return res.json({
      name: doc.data().name,
    });
  });
});

router.post("/check-access-group", async (req, res) => {
  let { enterprise, user, groupe } = req.query;
  db.collection("Enterprises/" + enterprise + "/GROUPES")
    .get()
    .then((subCollectionSnapshot) => {
      subCollectionSnapshot.forEach((subDoc) => {
        if (groupe === subDoc.id) {
          if (!subDoc.data().isPrivate) {
            return res.json({
              hasAccess: true,
              message: "L'utilisateur a accès au groupe",
            });
          } else {
            db.collection("Enterprises/" + enterprise + "/USERS")
              .get()
              .then((subCollectionSnapshot) => {
                subCollectionSnapshot.forEach((subDoc) => {
                  if (user === subDoc.id) {
                    if (subDoc.data?.accessGranted) {
                      subDoc.data().accessGranted.forEach((grpGranted) => {
                        if (grpGranted === groupe) {
                          return res.json({
                            hasAccess: true,
                            message: "L'utilisateur a accès au groupe",
                          });
                        } else {
                          return res.json({
                            hasAccess: false,
                            message: "L'utilisateur n'a pas accès au groupe",
                          });
                        }
                      });
                    } else {
                      return res.json({
                        hasAccess: false,
                        message: "L'utilisateur n'a pas accès au groupe",
                      });
                    }
                  }
                });
              });
          }
        }
      });
    });
});

router.post("/access-files", async (req, res) => {
  let { incomingId, outgoingId, enterprise } = req.query;
  db.collection("Enterprises/" + enterprise + "/FILES")
    .get()
    .then((subCollectionSnapshot) => {
      subCollectionSnapshot.forEach((subDoc) => {
        if(incomingId === subDoc.data().incomingId || outgoingId === subDoc.data().outgoingId) {
          return res.json({
            hasAccess: true,
            message: "L'utilisateur a le droit de voir ce fichier",
            file: subDoc.data().file
          });
        }
        else {
          return res.json({
            hasAccess: false,
            message: "L'utilisateur n'a pas le droit de voir ce fichier"
          });
        }
      });
    });
});

module.exports = router;

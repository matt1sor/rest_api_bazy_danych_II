const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

const ObjectId = require("mongodb").ObjectId;

recordRoutes.route("/products").get(async function (req, res) {
  try {
    let db_connect = dbo.getDb("storage");
    db_connect
      .collection("products")
      .find({})
      .toArray(function (err, result) {
        res.json(result);
      });
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/products/sortBy").get(async function (req, res) {
  let db_connect = dbo.getDb("storage");
  if (req.query.nazwa === "true") {
    try {
      db_connect
        .collection("products")
        .find({})
        .sort({ nazwa: 1 })
        .toArray(function (err, result) {
          res.json(result);
        });
    } catch (err) {
      throw err;
    }
  }
  if (req.query.cena === "true") {
    try {
      db_connect
        .collection("products")
        .find({})
        .sort({ cena: 1 })
        .toArray(function (err, result) {
          res.json(result);
        });
    } catch (err) {
      throw err;
    }
  }
  if (req.query.ilosc === "true") {
    try {
      db_connect
        .collection("products")
        .find({})
        .sort({ ilosc: 1 })
        .toArray(function (err, result) {
          res.json(result);
        });
    } catch (err) {
      throw err;
    }
  }
});

recordRoutes.route("/products/add").post(async function (req, response) {
  let db_connect = dbo.getDb("storage");
  let myobj = {
    nazwa: req.body.nazwa,
    cena: req.body.cena,
    opis: req.body.opis,
    ilosc: req.body.ilosc,
  };

  try {
    db_connect.collection("products").insertOne(myobj, function (err, res) {
      response.json(res);
    });
  } catch (err) {
    throw err;
  }
});
//
recordRoutes.route("/products/:id").put(async function (req, response) {
  let db_connect = dbo.getDb("storage");
  let myquery = { _id: ObjectId(req.params.id) };
  let newValues = {
    $set: {
      nazwa: req.body.nazwa,
      cena: req.body.cena,
      opis: req.body.opis,
      ilosc: req.body.ilosc,
    },
  };

  try {
    db_connect
      .collection("products")
      .updateOne(myquery, newValues, function (err, res) {
        console.log("1 document updated successfully");
        response.json(res);
      });
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/products/:id").delete(async function (req, res) {
  let db_connect = dbo.getDb("storage");
  let myquery = { _id: ObjectId(req.params.id) };
  try {
    db_connect.collection("products").deleteOne(myquery, function (err, obj) {
      if (obj.deletedCount === 1) {
        res.json("usunieto");
      } else {
        try {
          if (obj.acknowledged === false) throw "ERROR: Delete nie powiodl sie";
          if (obj.deletedCount === 0) throw "ERROR: Nie ma takiego produktu";
        } catch (err) {
          res.json(err);
        }
      }
    });
  } catch (err) {
    throw err;
  }
});

recordRoutes.route("/products/raport").get(async function (req, res) {
  let db_connect = dbo.getDb("storage");
  if (req.query.ilosc === "true") {
    try {
      db_connect
        .collection("products")
        .aggregate([{ $group: { _id: "$nazwa", ilosc: { $sum: "$ilosc" } } }])
        .toArray(function (err, result) {
          res.send(result);
        });
    } catch (err) {
      throw err;
    }
  }

  if (req.query.wartosc === "true") {
    try {
      db_connect
        .collection("products")
        .aggregate([
          {
            $group: {
              _id: 0,
              totalAmount: { $sum: { $multiply: ["$ilosc", "$cena"] } },
            },
          },
        ])
        .toArray(function (err, result) {
          res.send(result);
        });
    } catch (err) {
      throw err;
    }
  }
});

module.exports = recordRoutes;

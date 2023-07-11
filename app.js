const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();

const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

const mysql = require("mysql2");

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "rootroot",
    database: "ecsite_db",
});

// 外部静的ファイルの取得
app.use(express.static("assets"));

// favicon.icoがリクエストされた場合、空のレスポンスを返す。
app.get("/favicon.ico", (req, res) => {
    res.status(204);
});

/*
    商品一覧。レビューテーブルと商品テーブルを結合
    画像パス、商品名、価格、商品ID、商品評価を返す
*/
app.get("/", (req, res) => {
    const sql =
        "SELECT imageSrc,name,price,itemId,evaluation FROM products JOIN review ON products.id = review.itemId";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render("index", { products: result });
    });
});

/*
    商品詳細。レビューテーブルと商品テーブルを結合
    結合した全ての情報を返す
*/
app.get("/detail/:id", (req, res) => {
    const sql =
        "SELECT * FROM review JOIN products ON products.id = review.itemId WHERE review.itemId = ?";
    con.query(sql, req.params.id, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.render("detail", { product: result });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

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
        res.render("detail", { productData: result });
    });
});

/*
    お買い物カゴ。
    カートに入れる操作で新しいカラムを挿入
*/
app.post("/cart", (req, res) => {
    // 一度カート内の情報を全て取得
    let sql =
    "SELECT * FROM shoppingcart"
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        let tmpObj = {};
        for (index in result) {
            // 同じ商品がある場合
            if (req.body.itemId == result[index].itemId) {
                // 個数を1追加して一時的に保持
                result[index].value++;
                tmpObj = result[index];
            }
        }
        // 同じ商品がある場合
        if (Object.keys(tmpObj).length) {
            // 個数を1個追加したオブジェクトで更新
            sql = "UPDATE shoppingcart SET ? WHERE itemId =" + tmpObj.itemId;
            con.query(sql,tmpObj, function (err, result, fields) {
                if (err) throw err;
                res.redirect("/cart");
            });
        } else {
            // 同じ商品がなければカラムを追加
            sql = "INSERT INTO shoppingcart SET ?";
            con.query(sql, req.body, function (err, result, fields) {
                if (err) throw err;
                res.redirect("/cart");
            });
        }
    });
});

/*
    お買い物カゴ。
    カート内の情報を取得
*/
app.get("/cart", (req, res) => {
    const sql =
        "SELECT * FROM shoppingcart";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.render("cart", {cartInfo: result} );
    });
});

/*
    お買い物カゴ。
    カート内から指定したカラムを削除
*/
app.get("/delete/:id", (req, res) => {
    const sql =
        "DELETE FROM shoppingcart WHERE id = " + req.params.id;
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        res.redirect("/cart");
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

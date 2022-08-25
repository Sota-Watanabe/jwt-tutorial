const express = require("express");
// const bodyParser = require("body-parser");
const PORT = 3000;

const app = express();
app.use(express.json());

app.listen(PORT, console.log("server running"));

db = [];

app.post("/sign-up", (req, res) => {
  const payload = {
    username: req.body.username,
    email: req.body.email,
  };
  const session = Math.random().toString(32).substring(2); // 'a6dpgjqlq8g' 等
  //  本当はSet-Cookieヘッダにセットする
  const body = {
    username: req.body.username,
    email: req.body.email,
    session: session,
  };
  db.push(body);
  res.status(200).json(body);
});

//認証してみよう
app.get("/login", (req, res) => {
  // 順番
  user = {
    username: req.body.username,
    email: req.body.email,
    session: req.body.session,
  };
  // 本当はdbに接続、検索
  check = false;
  db.forEach((element) => {
    if (JSON.stringify(element) === JSON.stringify(user)) {
      check = true;
    }
  });
  if (!check) {
    res.status(403).json({
      msg: "承認に失敗しました",
    });
  } else {
    res.status(200).json({
      msg: "承認に成功しました",
    });
  }
});

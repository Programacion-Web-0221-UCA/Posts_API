const express = require("express");
const router = express.Router();

const { authRequired } = require("@app/middlewares/auth.middlewares");

const authRouter = require("./api/auth.router");
const postRouter = require("./api/post.router");

router.use("/auth", authRouter);
router.use(authRequired);

router.use("/post", postRouter);

module.exports = router;
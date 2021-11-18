const Express = require("express");
const router = Express.Router();

const { roleValidatorHelper } = require("@app/middlewares/auth.middlewares");
const { ROLES } = require("@app/constants");

const postController = require("@app/controllers/post.controller");

const { createValidator, updateValidator, addCommentValidator, idInParams, pagination } = require("@app/validators/post.validators");
const runValidation = require("@app/validators");

router.use(roleValidatorHelper(ROLES.USER));
router.get("/all", pagination, runValidation, postController.findAllAvaliable);
router.get("/one/:id", idInParams, runValidation, postController.findOneById);
router.patch("/like/:id", idInParams, runValidation, postController.toggleLike);
router.patch("/comment/:id", idInParams, addCommentValidator, runValidation, postController.addComment);
router.patch("/fav/:id", idInParams, runValidation, postController.toggleFav);
router.get("/fav", postController.getFavs);

router.use(roleValidatorHelper(ROLES.ADMIN));
router.post("/create", createValidator, runValidation, postController.create);
router.get("/owned", pagination, postController.findAllOwned);
router.put("/update/:id", idInParams, updateValidator, runValidation, postController.updateOneById );
router.patch("/toggle/:id", idInParams, runValidation, postController.toggleActive);

module.exports = router;
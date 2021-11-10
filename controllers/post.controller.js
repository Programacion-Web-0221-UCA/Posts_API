const postService = require("@app/services/post.service");

const controller = {};

controller.create = async (req, res, next) => {
  try{
    const { title, description, image } = req.body;
    const { _id: userId } = req.user;

    const { status: postCreated } = await postService.register({ title, description, image, user: userId });
    if (!postCreated) return res.status(409).json({ error: "Post not created" });

    return res.status(201).json({ message: "Post created" });
  } catch (error) {
    next(error);
  }
}

controller.findAllAvaliable = async (req, res, next) => {
  try{
    const { content: posts } = await postService.findAll({ active: true });
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

controller.findAllOwned = async (req, res, next) => {
  try{
    const { _id: userId } = req.user;

    const { content: posts } = await postService.findAll({ user: userId });
    return res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
}

controller.findOneById = async (req, res, next) => {
  try{
    const { id } = req.params;

    const { status: postExists, content: post } = await postService.findOne({ _id: id, active: true });
    
    if(!postExists) return res.status(404).json({ error: "Post not found!" });
    return res.status(200).json(post);
  } catch (error) {
    next(error);
  }
}

controller.updateOneById = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { _id: userId } = req.user;

    const { status: postExists, content: post } = await postService.findOneByIdRaw(id);
    if (!postExists) return res.status(404).json({ error: "Post not found" });

    const belongToUser = userId === post.user;
    if (!belongToUser) return res.status(401).json({ error: "Not allowed" });

    const { status: postUpdated } = await postService.updateContent(post, req.body);
    if(!postUpdated) return res.status(409).json({ error: "Not updated" });

    return res.status(200).json({ message: "Post updated" });
  } catch (error) {
    next(error);
  }
}

controller.toggleActive = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { _id: userId } = req.user;

    const { status: postExists, content: post } = await postService.findOneByIdRaw(id);
    if (!postExists) return res.status(404).json({ error: "Post not found" });

    const belongToUser = userId === post.user;
    if (!belongToUser) return res.status(401).json({ error: "Not allowed" });

    const { status: postUpdated } = await postService.toggleActive(post);
    if(!postUpdated) return res.status(409).json({ error: "Not updated" });

    return res.status(200).json({ message: "Post updated" });
  } catch (error) {
    next(error);
  }
}

controller.toggleLike = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { _id: userId } = req.user;

    const { status: postExists, content: post } = await postService.findOneByIdRaw(id);
    if (!postExists) return res.status(404).json({ error: "Post not found" });
    
    const { status: postUpdated } = await postService.toggleLike(post, userId);
    if(!postUpdated) return res.status(409).json({ error: "Not updated" });

    return res.status(200).json({ message: "Post updated" });
  } catch (error) {
    next(error);
  }
}

controller.addComment = async (req, res, next) => {
  try{
    const { id } = req.params;
    const { _id: userId } = req.user;
    const { description } = req.body;

    const { status: postExists, content: post } = await postService.findOneByIdRaw(id);
    if (!postExists) return res.status(404).json({ error: "Post not found" });
    
    const { status: postUpdated } = await postService.addComment(post, { user: userId, description })
    if(!postUpdated) return res.status(409).json({ error: "Not updated" });

    return res.status(200).json({ message: "Post updated" });
  } catch (error) {
    next(error);
  }
}

module.exports = controller;
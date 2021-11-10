const Post = require("@app/models/Post");
const ServiceResponse = require("@app/classes/ServiceResponse");
const { sanitizeObject } = require("@app/utils/object.tools"); 

const service = {};

service.register = async ({ title, description, image, user }) => {
  try{
    const post = new Post({title, description, image, user});
    const newPost = await post.save();

    if(!newPost) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

service.findAll = async ({limit=20, page=0}, query={}) => {
  try{
    const limitInt = parseInt(limit);
    const pageInt = parseInt(page);
    const cleanQuery = sanitizeObject(query);

    const count = await Post.countDocuments({});
    
    const posts = await Post.find(cleanQuery, undefined,  {
      skip: pageInt * limitInt,
      limit: limitInt,
      sort: [{ createdAt: -1 }] 
    }).populate("user", "username -_id")
      .populate("likes", "username -_id")
      .populate({
        path: "comments.user",
        select: "username -_id"
      });
    
    const pages = Math.ceil(count / limitInt);

    return new ServiceResponse(true, {
      data: posts,
      page: pageInt,
      pages: pages,
      limit: limitInt
    });
  } catch (error) {
    throw error;
  }
}

service.findOne = async (query={}) => {
  try{
    const cleanQuery = sanitizeObject(query);

    const post = await Post.findOne(cleanQuery)
      .populate("user", "username -_id")
      .populate("likes", "username -_id")
      .populate({
        path: "comments.user",
        select: "username -_id"
      });

    if (!post) return new ServiceResponse(false);
    return new ServiceResponse(true, post);
  } catch (error) {
    throw error;
  }
}

service.findOneByIdRaw = async (id) => {
  try{
    const post = await Post.findById(id);

    if (!post) return new ServiceResponse(false);
    return new ServiceResponse(true, post);
  } catch (error) {
    throw error;
  }
}

service.updateContent = async (post, { title, description, image }) => {
  try{
    post.history.push({ 
      title: post.title, 
      description: post.description, 
      image: post.image, 
      modifiedAt: new Date() 
    })

    const content = sanitizeObject({ title, description, image });
    Object.keys(content).forEach(key => {
      post[key] = content[key];
    });

    const postSaved = await post.save();

    if(!postSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

service.toggleActive = async (post) => {
  try{
    post.active = !post.active;

    const postSaved = await post.save();

    if(!postSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

//Comments handlers
service.addComment = async (post, { description, user }) => {
  try{
    const newComment = { description, user };
    
    const comments = [...post.comments, newComment];
    post.comments = comments;

    const postSaved = await post.save();

    if(!postSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

//Likes Handlers
service.toggleLike = async (post, userId) => {
  try{
    let likes = [...post.likes];
    const alreadyExists = likes.findIndex(like => like.equals(userId) ) >= 0;

    if(alreadyExists) {
      likes = likes.filter(like => !like.equals(userId) );
    }else {
      likes = [...likes, userId];
    }

    post.likes = likes;

    const postSaved = await post.save();

    if(!postSaved) return new ServiceResponse(false);
    return new ServiceResponse(true);
  } catch (error) {
    throw error;
  }
}

module.exports = service;
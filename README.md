# facebook-wall-using-mern-stack
## Table of contents
* [About](#about)
* [API Endpoints](#API-Endpoints)

![README_IMG1](README_IMG1.png?raw=true "Screenshot")

## About

Side Project - A Facebook Wall clone using the MERN stack. 

Backend API from scratch using Node.js exposes CRUD endpoints for Posts, Comments, Replies and Reactions.
JWT used for authentication. 
	
## API Endpoints

### /users/login
* Public `POST` | Authenticates a User and returns a JWT Token.

### /posts/:username
* Private `GET` | Returns all Posts from a User's wall.
* Private `POST` | Creates a Post on a User's wall.

### /posts/:postID
Private `DELETE` | Deletes a Post on the authenticated User's wall.

### /posts/:postID/reactions
Private `GET` | Returns all Reactions for a Post.
* Private `POST` | Adds a Reaction to a Post authored by the authenticated User.
* Private `PUT` | Changes the Reaction to a Post authored by the authenticated User.
* Private `DELETE` |  Deletes the Reaction to a Post authored by the authenticated User.

### /posts/:postID/comments
* Private `POST` | Adds a Comment to a Post authored by the authenticated User.

### /comments/:commentID
* Private `DELETE` | Deletes a Comment authored by the authenticated User.

### /comments/:commentID/reactions
Private `POST` | Adds a Reaction to Comment authored by the authenticated User.
* Private `PUT` | Changes the Reaction to Comment authored by the authenticated User.
* Private `DELETE` | Deletes the Reaction to Comment authored by the authenticated User.

### /comments/:commentID/replies
Private `GET` | Returns the Reaction to Comment authored by the authenticated User.
* Private `POST` | Adds a Reply to Comment authored by the authenticated User. Returns a Replies to the Comment.

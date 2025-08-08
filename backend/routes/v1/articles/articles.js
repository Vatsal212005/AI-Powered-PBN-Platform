const express = require('express');
const router = express.Router();
const articlesController = require('../../../controllers/v1/articles/articles.controller');

// CRUD
router.get('/getAllArticles', articlesController.getAllArticles);
router.get('/getArticleById/:id', articlesController.getArticle);
router.put('/updateArticle/:id', articlesController.updateArticle);
router.delete('/deleteArticle/:id', articlesController.deleteArticle);

// Internal link fetch endpoint
router.get('/getInternalLink', articlesController.getInternalLink);

// Set selected version
router.post('/setSelectedVersion/:id', articlesController.setSelectedVersion);

// Publish blog
router.post('/publishBlog/:id', articlesController.publishBlog);

// Editor routes
router.get('/getForEditing/:id', articlesController.getArticleForEditing);
router.put('/updateContent/:id', articlesController.updateArticleContent);

module.exports = router; 
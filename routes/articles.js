const express = require('express');
const Article = require('../models/Article');

const router = express.Router();

// Home route
router.get('/', checkNotAuthenticated, async (req, res) => {
  const articles = await Article.find();

  res.render('blogs/index', {
    articles: articles
  });
});

// New route
router.get('/new', checkNotAuthenticated, (req, res) => {
  res.render('blogs/new');
});

// Post route
router.post('/new', checkNotAuthenticated, async (req, res) => {
  const { title, description, text } = req.body;

  const article = new Article({
    title: title,
    description: description,
    text: text
  });

  try {
    const newArticle = await article.save();
    res.redirect(`/articles/${newArticle.slug}`);
  } catch {
    res.redirect('/articles/new');
  }
});

// Show article by ID
router.get('/:slug', checkNotAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });

  if (article == null) res.redirect('/articles');

  res.render('blogs/show', {
    article: article
  });
});

// Delete
router.delete('/:id', checkNotAuthenticated, async (req, res) => {
  await Article.findByIdAndDelete(req.params.id);

  res.redirect('/articles');
});

// Edit route
router.get('/edit/:slug', checkNotAuthenticated, async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug });

  res.render('blogs/edit', {
    article: article
  });
});

// Edit user
router.put('/:id', checkNotAuthenticated, async (req, res) => {
  let article;
  const { title, description, text } = req.body;

  try {
    article = await Article.findById(req.params.id);
    article.title = title
    article.description = description
    article.text = text
    
    article = await article.save();
    res.redirect(`/articles/${article.slug}`);
  } catch {
    res.render('blogs/edit', {
      article: article
    });
  }
});

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect('/user/login');
}

module.exports = router;
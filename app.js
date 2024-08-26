// Import required modules and initialize Express app
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

// Set up view engine and public directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB and define schema
mongoose.connect('mongodb://localhost:27017/blogDB', { useNewUrlParser: true, useUnifiedTopology: true });

const postSchema = new mongoose.Schema({
  title: String,
  content: String
});

const Post = mongoose.model('Post', postSchema);

// Home route to display all posts
app.get('/', async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render('home', { title: 'Home', posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the compose page
app.get('/compose', (req, res) => {
  res.render('compose', { title: 'Compose' });
});

// Route to handle the creation of a new post
app.post('/compose', async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postContent
  });

  try {
    await post.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render the edit page
app.get('/edit/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    const post = await Post.findById(postId);
    res.render('edit', { title: 'Edit Post', post: post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to render a single post
app.get('/posts/:postId', async (req, res) => {
    const postId = req.params.postId;
  
    try {
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).send('Post not found');
      }
      res.render('post', { title: post.title, content: post.content });
    } catch (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    }
  });
  




// Route to handle updating a post
app.post('/edit/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    await Post.findByIdAndUpdate(postId, {
      title: req.body.postTitle,
      content: req.body.postContent
    });
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Route to handle deleting a post
app.post('/delete/:postId', async (req, res) => {
  const postId = req.params.postId;

  try {
    await Post.findByIdAndDelete(postId);
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// Start the server on port 3000
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

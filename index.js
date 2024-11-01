import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 4000;

// In-memory data store
let posts = [
  {
    id: 1,
    title: "The Rise of Decentralized Finance",
    content:
      "Decentralized Finance (DeFi) is an emerging and rapidly evolving field in the blockchain industry. It refers to the shift from traditional, centralized financial systems to peer-to-peer finance enabled by decentralized technologies built on Ethereum and other blockchains. With the promise of reduced dependency on the traditional banking sector, DeFi platforms offer a wide range of services, from lending and borrowing to insurance and trading.",
    author: "Alex Thompson",
    date: "2023-08-01T10:00:00Z",
  },
  {
    id: 2,
    title: "The Impact of Artificial Intelligence on Modern Businesses",
    content:
      "Artificial Intelligence (AI) is no longer a concept of the future. It's very much a part of our present, reshaping industries and enhancing the capabilities of existing systems. From automating routine tasks to offering intelligent insights, AI is proving to be a boon for businesses. With advancements in machine learning and deep learning, businesses can now address previously insurmountable problems and tap into new opportunities.",
    author: "Mia Williams",
    date: "2023-08-05T14:30:00Z",
  },
  {
    id: 3,
    title: "Sustainable Living: Tips for an Eco-Friendly Lifestyle",
    content:
      "Sustainability is more than just a buzzword; it's a way of life. As the effects of climate change become more pronounced, there's a growing realization about the need to live sustainably. From reducing waste and conserving energy to supporting eco-friendly products, there are numerous ways we can make our daily lives more environmentally friendly. This post will explore practical tips and habits that can make a significant difference.",
    author: "Samuel Green",
    date: "2023-08-10T09:15:00Z",
  },
];

let lastId = 3;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


//GET All posts
app.get("/posts", (req, res) => {
  
  // Check if there is any post.
  if (posts.length > 0) {
    res.json(posts)
  }
  else {
    res.status(404).json({message: "No posts found"})
  }
});

//GET a specific post by id
app.get("/posts/:id", (req, res) => {
  const idChose = parseInt(req.params.id);

  // Find the post that matches the ID provided by the user
  const postFound = posts.find(post => (post.id === idChose));

  // Check if the specific post exists.
  if (postFound) {
    res.json(postFound)
  }
  else {
    res.status(404).json({message: `No post found that match with the ID(${idChose})`})
  }
});

//POST a new post
app.post("/posts", (req, res) => {
  
  //using Destructuring Assignment (Advantages: Conciseness, Readability, Avoids Repetition)
  const {title, content, author} = req.body;

  // Check if at least one field is missing
  if (!title || !content || !author) {
    
    // Array to hold missing fields
    const missingFields = [];

    // Check for empty fields and push to missingFields array
    if (!title) {
      missingFields.push("title");
    }
    if (!content) {
      missingFields.push("content");
    }
    if (!author) {
      missingFields.push("author");
    }
    
    // Message the user which field is missing
    res.status(400).json({ message: `Missing the following fields: ${missingFields.join(', ')}` });
  }

  else {

    //Create a new post with the data provided by the user. This create a new JS Object.
    const newPost = {
      id: ++lastId,
      title: title,
      content: content,
      author: author,
      date: new Date(),
    }

    //This adds the new post created (JS Object) to the `posts` array
    posts.push(newPost);
    res.status(201).json(newPost)
  }
});

//PATCH a post when the user just want to update one parameter
app.patch("/posts/:id", (req, res) => {

  const idChose = parseInt(req.params.id);

  //using Destructuring Assignment
  const {title, content, author} = req.body;

  // Find the index of the post that matches the ID provided by the user
  const postIndex = posts.findIndex(post => post.id === idChose);

  // Check if the post exists
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found." });
  }

  // Get the existing post details
  const existingTitle = posts[postIndex].title;
  const existingContent = posts[postIndex].content;
  const existingAuthor = posts[postIndex].author;

  // Create an updated post object with OR condition. The logic: "if title is falsy (like undefined), use existingTitle."
  const postUpdate = {
    id: idChose,
    title: title || existingTitle,
    content: content || existingContent,
    author: author || existingAuthor,
    date: new Date()
  }

  // Check if at least one field is being updated
  if ( title || content || author ) {
    posts[postIndex] = postUpdate;
    res.status(200).json(postUpdate)
  }
  else {
    res.status(400).json({ message: "No fields provided for update." })
  }
});

//DELETE a specific post by providing the post id.
app.delete("/posts/:id", (req, res) => {
  const idChose = parseInt(req.params.id);

  // Find the index of the post that matches the ID provided by the user
  const postIndex = posts.findIndex(post => post.id === idChose);

  // Check if the post exists
  if (postIndex === -1) {
    return res.status(404).json({ message: "Post not found." });
  }

  // If exist, remove the specific post (JS object) from the `posts` array.
  else {
    posts.splice(postIndex, 1);
    res.status(204).send();
  }
  
})

app.listen(port, () => {
  console.log(`API is running at http://localhost:${port}`);
});

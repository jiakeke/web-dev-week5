const bcrypt = require('bcrypt');
const express = require('express');
const mongoose = require('mongoose');

mongoose
  .connect("mongodb://localhost:27017/express-bcrypt-demo")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("Failed to connect to MongoDB", err));

const app = express();
app.use(express.json());

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
});

// static signup method
userSchema.statics.signup = async function(username, password) {

  // validation
  if (!username || !password) {
    throw Error('All fields must be filled')
  }
  //if (!validator.isEmail(username)) {
    //throw Error('username not valid')
  //}
  //if (!validator.isStrongPassword(password)) {
    //throw Error('Password not strong enough')
  //}

  const exists = await this.findOne({ username })

  if (exists) {
    throw Error('username already in use')
  }

  const salt = await bcrypt.genSalt(10)
  const hash = await bcrypt.hash(password, salt)

  const user = await this.create({ username, password: hash })

  return user
}

// static login method
userSchema.statics.login = async function(username, password) {

  if (!username || !password) {
    throw Error('All fields must be filled')
  }

  const user = await this.findOne({ username })
  if (!user) {
    throw Error('Incorrect username')
  }

  const match = await bcrypt.compare(password, user.password)
  if (!match) {
    throw Error('Incorrect password')
  }

  return user
}

const User = mongoose.model("User", userSchema);


app.get("/api/users", async (req, res) => {
    try {
        const users = await User.find({}).sort({ creatdAt: -1 });
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve users" });
    }
});

app.post("/api/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Generate a salt (a random value added to the hash to increase security)
    const salt = await bcrypt.genSalt(10); // 10 rounds of salt generation
    // Hash the password with the salt
    const hashedPassword = await bcrypt.hash(password, salt);

    const exists = await User.findOne({ username })

    if (exists) {
        res.status(400).json({ error: "Username already in use" });
    } else {
        // Create a new user with the hashed password
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
    }

  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/api/users/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

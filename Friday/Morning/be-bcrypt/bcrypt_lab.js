const bcrypt = require('bcrypt');

// Function to hash a password
async function hashPassword() {
  const password = 'SecurePasswordOfGary'; // Replace with your password
  //Salt: $2b$10$O3trqOj7D1QYAGyWS3nxBO
  //Hashed Password: $2b$10$O3trqOj7D1QYAGyWS3nxBOI1Dinqgjwv46cCndp23daFcx/zwgE3e


  try {
    // Generate a salt with 10 rounds (you can adjust this number)
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    const hashedPassword = await bcrypt.hash(password, salt);

    console.log('Password:', password);
    console.log('Salt:', salt);
    console.log('Hashed Password:', hashedPassword);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to hash the password
hashPassword();

// Function to hash a password without async
//const bcrypt = require('bcrypt');

const password = 'SecurePasswordOfGary';

// Hash password synchronously with 10 salt rounds
const salt = bcrypt.genSaltSync(10);
const hashedPassword = bcrypt.hashSync(password, salt);

console.log('Synchronous Hashed Password:', hashedPassword);

// Function to compare a password with a hash
async function comparePassword() {
  const inputPassword = 'SecurePasswordOfGary'; // Replace with the password you want to compare
  const hashedPassword = '$2b$10$O3trqOj7D1QYAGyWS3nxBOI1Dinqgjwv46cCndp23daFcx/zwgE3e';

  try {
    // Compare the input password with the stored hashed password
    const isMatch = await bcrypt.compare(inputPassword, hashedPassword);

    if (isMatch) {
      console.log('Password is correct.');
    } else {
      console.log('Password is incorrect.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Call the function to compare the password
comparePassword();

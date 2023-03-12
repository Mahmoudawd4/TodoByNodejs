const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 8,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 15,
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'admin'],
    },
    dob: {
      type: Date,
      default: null,
    },
    tokens: [{
      token: {
        type: String,
        default: null,
      },
    }],
  },
  {
    timestamps: true,
  },
);

// Define the toJSON method to remove the password field
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

// userSchema.pre('save', async function (next) {
//   try {
//     // Generate a salt
//     const salt = await bcrypt.genSalt(10);
//     // Hash the password
//     const passwordHash = await bcrypt.hash(this.password, salt);
//     // Assign the hashed password to the password field
//     this.password = passwordHash;
//     next();
//   } catch (error) {
//     next(error);
//   }
// });

// userSchema.methods.isValidPassword = async function (password) {
//   // eslint-disable-next-line no-useless-catch
//   try {
//     return await bcrypt.compare(password, this.password);
//   } catch (error) {
//     throw error;
//   }
// };

const User = mongoose.model('User', userSchema);
module.exports = User;

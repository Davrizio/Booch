const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userName: { 
    type: String, 
    unique: true 
  },
  email: { 
    type: String, 
    unique: true 
  },
  password: String,
  image: {
    type: String,
    require: true
  },
  cloudinaryId: {
    type: String,
    require: true
  },
  theme: { 
    type: String },
  remember: { 
    type: String }
});

// Password hash middleware.

UserSchema.pre("save", function save(next) {
  console.log("userschemapreFunction")
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return next(err);
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err);
      }
      user.password = hash;
      next();
    });
  });
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate()
  if (update.password) {
    const passwordHash = await bcrypt.hash(update.password, 10);
    this.setUpdate({ $set: { 
      password: passwordHash,
      userName: update.userName,
      email: update.email,
      image: update.image,
      cloudinaryId: update.cloudinaryId, 
      } 
    });
  }
  next()
});

// Helper method for validating user's password.

UserSchema.methods.comparePassword = function comparePassword(
  candidatePassword,
  cb
) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    cb(err, isMatch);
  });
};

module.exports = mongoose.model("User", UserSchema);

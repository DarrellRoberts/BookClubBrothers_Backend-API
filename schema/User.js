const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");


const { Schema } = mongoose;

const userSchema = new Schema ({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    userInfo: {
    residence: {
        country: {
            type: String,
        },
        city: {
            type: String,
        }
    },
    favGenre: [
        {
            type: [String],
            enum: [
                "Horror",
                "Thriller",
                "Comedy",
                "Romance",
                "Fantasy",
                "Adventure",
                "Anti-war",
                "Drama",
                "Action",
                "Non-fiction"
            ],
        },
    ],
    profileURL: {
        type: String,
    },
    books: {
        booksScored: {
            type: Schema.Types.ObjectId,
            ref: "Book",
            score: Number,
        },
        booksSuggested: {
            type: Schema.Types.ObjectId,
            ref: "Book"
        },
    },
},
}
);

// user registration
userSchema.statics.signup = async function (userInfo) {
    const exists = await this.findOne({ username: userInfo.username });
    if (exists) {
        throw Error("Imposter!! Username is already in use.");
    }
    if (
        !userInfo.username || !userInfo.password
    ) {
        throw Error("Fill out your username and password...do me a favour");
    }
    if (!validator.isUsername(userInfo.username)) {
        throw Error("Username is not valid...in other words, don't be a smartass (no spaces or special characters)")
    }
    if (!validator.isStrongPassword(userInfo.password)) {
        throw Error("Do you want your account to be hacked?? If no, use at least one capital letter, one special character, one number and ensure the password is 8 or more characters long. Otherwise, I can't help you...even as Admin")
    }

    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(userInfo.password, salt);
    const user = await this.create({
        username: userInfo.username,
        password: hash,
        userInfo: {
                residence: {
                    country: userInfo.country,
                    city: userInfo.city
                    },
                favGenre: userInfo.favGenre,
                profileURL: userInfo.profileURL
        }
    })
    return user;
}

// user login
userSchema.statics.login = async function (username, password) {
    if (!username) {
        throw Error("Errr excuse me, you forgot to fill out your username")
    }
    if (!password) {
        throw Error("Passwords are great because it stops other users from accessing your account. So how about you fill out that password field eh?")
    }

    const user = await this.findOne({username});

    if (!user) {
        throw Error("Your username appears to be incorrect. Have a think and try again will ya?")
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
        throw Error("Hmmm incorrect password. Let's hope you made a typo.")
    }
    return user;
};

userSchema.statics.resetPassword = async function (
    username,
    password,
    confirm_password
  ) {
    const exists = await this.findOne({ username });
    if (!exists) {
      throw Error("The username doesn't exist. What are you playing at?? Make a new account you dingus");
    }
  
    if (!email || !password || !confirm_password) {
      throw Error("You've forgotten your password so read carefully. All the goddamn fields need to be filled out (username, password, confirm password).");
    }
  
    if (!validator.isStrongPassword(password)) {
      throw Error(
        "Do you want your account to be hacked?? If no, use at least one capital letter, one special character, one number and ensure the password is 8 or more characters long. Otherwise, I can't help you...even as Admin"
      );
    }
  
    if (password !== confirm_password) {
      throw Error("On this website we got rules..one of them being, if your password does not match your confirm password, you ain't getting a new password. You dig?");
    }
  
    const salt = await bcrypt.genSalt();
    const hash = await bcrypt.hash(confirm_password, salt);
    const user = await this.findOneAndUpdate(
      { email },
      { password: hash },
      { new: true }
    );
  
    return user;
  };

module.exports = mongoose.model("User", userSchema);



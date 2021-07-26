// Importing Node packages required for schema
const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');

const Schema = mongoose.Schema;

//= ===============================
// User Schema
//= ===============================
const UserSchema = new Schema({
    id: String,
    id_user: String,
    email: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstname: String,
    lastname: String,
    role: {
        type: String,
        required: true
    },
    stripe: {
        customerId: { type: String },
        subscriptionId: { type: String },
        lastFour: { type: String },
        plan: { type: String },
        activeUntil: { type: Date }
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
},
    {
        timestamps: true
    });

//= ===============================
// User ORM Methods
//= ===============================

// Pre-save of user to database, hash password if password is modified or new
UserSchema.pre('save', function (next) {
    const user = this,
        SALT_FACTOR = 5;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_FACTOR, (err, salt) => {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, null, (err, hash) => {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Method to compare password for login
UserSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
        if (err) { return cb(err); }

        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);

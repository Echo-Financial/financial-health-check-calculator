
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

/**
 * User Schema
 * 
 * This schema defines the structure of the user documents stored in MongoDB.
 * It includes fields for name, email, password, and timestamps.
 */

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Email is required'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [/\S+@\S+\.\S+/, 'Please use a valid email address'],
        },
        password: {
            type: String,
            required: [true, 'Password is required'],
            minlength: [6, 'Password must be at least 6 characters long'],
        },
    },
    {
        timestamps: true, // Automatically adds createdAt and updatedAt fields
    }
);

/**
 * Pre-save Hook
 * 
 * This middleware hashes the user's password before saving it to the database.
 * It ensures that passwords are never stored in plain text.
 */

userSchema.pre('save', async function (next) {
    try {
        // Only hash the password if it has been modified (or is new)
        if (!this.isModified('password')) return next();

        // Generate a salt
        const salt = await bcrypt.genSalt(10);

        // Hash the password using the salt
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Replace the plain text password with the hashed one
        this.password = hashedPassword;

        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Method to Compare Passwords
 * 
 * This method compares a candidate password with the user's hashed password.
 * It returns true if they match, otherwise false.
 */

userSchema.methods.comparePassword = async function (candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw error;
    }
};

// Export the User model
module.exports = mongoose.model('User', userSchema);

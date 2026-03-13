const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name']
    },
    email: {
        type: String,
        required: [true, 'Please add an email'],
        unique: true
    },
    password: {
        type: String,
        required: false // Optional for Google Auth users
    },
    googleId: {
        type: String,
        required: false
    },
    privacyMaturityLevel: {
        type: String,
        enum: ['Novice', 'Aware', 'Pro', 'Guardian'],
        default: 'Novice'
    },
    badges: {
        type: [String], // e.g., ['Data Guardian', 'Streak Master']
        default: []
    },
    streak: {
        type: Number,
        default: 0
    },
    lastAssessmentDate: {
        type: Date
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function () {
    if (!this.isModified('password') || !this.password) {
        return;
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

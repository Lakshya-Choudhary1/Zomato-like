import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type: String,
      default: "",
    },

    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,

      validate: {
        validator: (value) => validator.isEmail(value),

        message: "Invalid email",
      },

      index: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
    },

    verified: {
      type: Boolean,
      default: false,
    },

    googleId: {
      type: String,
      default: null,
      index: true,
    },

    /* =====================================
       EMAIL VERIFICATION
    ===================================== */

    verificationToken: {
      type: String,
      default: null,
      select: false,
    },

    verificationTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    verificationTokenRequestedAt: {
      type: Date,
      default: null,
      select: false,
    },

    /* =====================================
       RESET PASSWORD
    ===================================== */

    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },

    resetPasswordTokenExpiresAt: {
      type: Date,
      default: null,
      select: false,
    },

    resetPasswordRequestedAt: {
      type: Date,
      default: null,
      select: false,
    },

    /* =====================================
       ACCOUNT STATUS
    ===================================== */

    isBlocked: {
      type: Boolean,
      default: false,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

/* =====================================
   INDEXES
===================================== */

userSchema.index({
  createdAt: -1,
});

/* =====================================
   MODEL
===================================== */

const User = mongoose.model("User", userSchema);

export default User;

const express = require("express");
const { createUser, loginUser, logoutUser, forgotPassword, resetPassword, userDetails, updatePassword, updateProfile,
    getAllUsers, getSingleUsers, updateUserRole, deleteUser
} = require("../controller/UserController");
const {isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/registration").post(createUser);

router.route("/login").post(loginUser);

router.route("/logout").get(logoutUser);

router.route("/password/forgot").post(forgotPassword);

router.route("/password/reset/:token").put(resetPassword);

router.route("/userDetails").get(isAuthenticatedUser, userDetails);

router.route("/userDetails/updatePassword").put(isAuthenticatedUser, updatePassword);

router.route("/userDetails/update/profile").put(isAuthenticatedUser, updateProfile);


//Admin Role and Permission
router.route("/admin/users").get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route("/admin/user/:id").get(isAuthenticatedUser, authorizeRoles('admin'), getSingleUsers);
router.route("/admin/user/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateUserRole);
router.route("/admin/user/delete/:id").delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);



module.exports = router;

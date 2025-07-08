import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import {getUsersForSidebar} from "../contollers/message.controller.js"
import {getMessages} from "../contollers/message.controller.js"
import {sendMessage} from "../contollers/message.controller.js"
const router = express.Router();

router.get("/users",protectRoute,getUsersForSidebar)
router.get("/:id",protectRoute,getMessages)
router.post("/send/:id",protectRoute,sendMessage)
export default router
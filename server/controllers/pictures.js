import { getImage } from "../middleware/uploadMiddleware.js";

export const getPicture = async (req, res) => {
   try {
      const {pictureId} = req.params;
      getImage(pictureId, res);
   } catch (err) {
      res.status(500).json({error: err.message})
   }
}
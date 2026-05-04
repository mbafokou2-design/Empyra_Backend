const express = require('express')
const router  = express.Router()

const {
  getBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
  getBlogStats
} = require('../controllers/blogController')

const { protect } = require('../middleware/authMiddleware')
const upload      = require('../middleware/upload')

router.get('/',       protect, getBlogs)
router.get('/stats',  protect, getBlogStats)    // GET /api/blog/stats
router.get('/:id',    protect, getBlogById)
router.post('/',      protect, upload.single('image'), createBlog)
router.put('/:id',    protect, upload.single('image'), updateBlog)
router.delete('/:id', protect, deleteBlog)

module.exports = router
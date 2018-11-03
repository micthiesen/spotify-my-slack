module.exports.addCacheHeaders = (req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate')
  next()
}

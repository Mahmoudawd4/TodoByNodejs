// eslint-disable-next-line consistent-return
const authorizeUser = (req, res, next) => {
  const userId = req.params.id;
  const tokenUserId = req.user.id;
  if (userId !== tokenUserId) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  next();
};

module.exports = authorizeUser;

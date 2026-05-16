const isAuthenticated = (req, res, next) => {
    const userId = req.session.userId;
    if (!userId) {
        return res.status(401).json({ error: 'Not authenticated' });
    }
    next();
};
export { isAuthenticated };
//# sourceMappingURL=isAuthenticated.js.map
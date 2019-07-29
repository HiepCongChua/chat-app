const getHome = (req, res, next) => {
    return res.render('main/home/home',{
        errors: req.flash("errors"),
        success: req.flash("success")
    })
};
export default {
    getHome
};


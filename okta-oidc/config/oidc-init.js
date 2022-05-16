var { ExpressOIDC } = require('@okta/oidc-middleware');
var session = require('express-session');

const initialize = app => {
  const { OKTA_DOMAIN, CLIENT_ID, CLIENT_SECRET, APP_BASE_URL, APP_SECRET,
    LOGIN_REDIRECT_URL, POST_LOGOUT_REDIRECT } = process.env;

  const oidc = new ExpressOIDC({
    issuer: `${OKTA_DOMAIN}/oauth2/default`,
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    appBaseUrl: APP_BASE_URL,
    loginRedirectUri: LOGIN_REDIRECT_URL,
    routes: {
      loginCallback: {
        afterCallback: "/profile"
      }
    },
    scope: 'openid profile',
    post_logout_redirect_uri: POST_LOGOUT_REDIRECT,
  });

  app.use(session({
    secret: APP_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: { httpOnly: true },
  }));

  app.use(oidc.router);

  app.use('/profile', oidc.ensureAuthenticated(), (req, res) => {
    console.log(req.userContext.userinfo);
    res.render('profile', { title: 'Express', user: req.userContext.userinfo });
  });

  app.get("/logout", (req, res) => {
    req.logout();
    res.redirect("/");
  });
};

module.exports = initialize;
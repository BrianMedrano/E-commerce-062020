const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const app = express();
const authRouter = require('./routes/admin/auth');
const productsRouter = require('./routes/admin/products');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

//Link Cookie session middleware
app.use(
  cookieSession({
    keys: ['aa324assdkfjlxkll3kmlsml'],
  })
);

//App Router
app.use(authRouter);
app.use(productsRouter);

app.listen(3000, () => {
  console.log('Listening on port 3000');
});

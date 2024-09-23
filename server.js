const express = require('express');
const handlebars = require('express-handlebars');
const appRoutes = require('./routes/approutes');

//initialize express application
var app = express();

app.use (express.urlencoded({extended:false}));
app.use (express.json());

app.engine('handlebars', handlebars({
    defaultLayout: 'main', 
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set('view engine', 'handlebars');

//routes
app.use(appRoutes);

app.use(express.static('public'));

app.listen(3000);
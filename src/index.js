import Express from 'express'
import bodyParser from 'body-parser'
import database from './config/database'
import userRoute from './routes/userRoute'

import {
    verifyToken,
    protectRoute
} from './middlewares/auth'
import {
    generateToken
} from './services/auth'

const app = Express();
const port = 3000 || process.env.PORT;

app.set('json spaces', 2);
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(verifyToken);


app.get('/', (req, res) => res.send('Olá mundo pelo Express!'));

app.post('/login', (req, res) => {
    const {
        username,
        password
    } = req.body

    if (username !== 'admin' || password !== '123456') {
        return res.status(400).send({
            error: 'Usuário ou senha inválidos!'
        })
    }

    const payload = {
        sub: 1,
        name: 'Nome Usuário',
        roles: ['admin']
    }
    const token = generateToken(payload)

    res.send({
        token
    })
});

app.get('/protected', protectRoute, (req, res) => {
    // Até o console.log só serve para entender o que retorna da requisição


    const expires = new Date(req.decoded.exp * 1000);
    const loginDate = new Date(req.decoded.iat * 1000);

    console.log(`Usuário ${req.decoded.name} logado em ${loginDate}. O token expira em ${expires} `);
    res.send(req.decoded);
});


app.listen(port, () => console.log('Api rodando na porta 3000'))
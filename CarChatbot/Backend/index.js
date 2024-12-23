const MongooseConnect = require('./db')
var cors = require('cors')


// Cross-Origin Requests: By default, web browsers block requests from one origin (domain) to another for security reasons. This is known as the Same-Origin Policy. The cors package allows you to configure your server to accept requests from different origins.

// Configuration: You can configure the cors package to allow specific domains, HTTP methods, headers, etc., using various options. This gives you fine-grained control over the security and functionality of your API.

MongooseConnect();
const express = require('express')
const router = express.Router();
const app = express()
const port = 4000

app.use(cors())
app.use(express.json())
//
app.use('/api/auth/',require('./Routes/auth'))
// app.use('/api/notes/', require('./Routes/notes'))
// app.get('/', (req, res) => {
//   res.send('Hello World!')
// })

app.listen(port, () => {
  console.log(`App listening on http://localhost:/${port}`)
})
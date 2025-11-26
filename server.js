const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults({
  static: './dist/todo-app'
});

const PORT = process.env.PORT || 3000;

// Enable CORS
server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  res.header('Access-Control-Allow-Methods', '*');
  next();
});

server.use(middlewares);
server.use('/api', router);
server.listen(PORT, () => {
  console.log(`JSON Server is running on port ${PORT}`);
});

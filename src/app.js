import express from 'express';
import { engine } from 'express-handlebars';
import http from 'http';
import { Server } from 'socket.io';
import path from 'path';
import { fileURLToPath } from 'url';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import productManager from './managers/ProductManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

const PORT = 8080;
const httpServer = http.createServer(app);
const io = new Server(httpServer);

app.set('io', io);

io.on('connection', async (socket) => {
  console.log('Cliente conectado, id:', socket.id);

  const products = await productManager.getAll();
  socket.emit('updateProducts', products);

  socket.on('newProduct', async (productData) => {
    try {
      await productManager.add(productData);
      const updated = await productManager.getAll();
      io.emit('updateProducts', updated);
    } catch (err) {
      socket.emit('errorFromServer', { msg: err.message });
    }
  });

  socket.on('deleteProduct', async (pid) => {
    try {
      await productManager.delete(pid);
      const updated = await productManager.getAll();
      io.emit('updateProducts', updated);
    } catch (err) {
      socket.emit('errorFromServer', { msg: err.message });
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

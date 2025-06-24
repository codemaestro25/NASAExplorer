import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './route';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/', router);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

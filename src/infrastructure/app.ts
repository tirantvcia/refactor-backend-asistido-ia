import express, { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import {
    createOrder,
    getAllOrders,
    updateOrder,
    completeOrder,
    deleteOrder
} from './controllers/orderController';





export function createServer(dbUrl: string, port: number) {
   

    mongoose
        .connect(dbUrl)
        .then(() => console.log('Connected to MongoDB'))
        .catch((err) => console.error('Error connecting to MongoDB:', err));

    const app = express();
    app.use(express.json());
    console.log("Setting up routes");
    
    app.post('/orders', ((req: Request, res: Response) => createOrder(req, res)) as RequestHandler);
    app.get('/orders', ((req: Request, res: Response) => getAllOrders(req, res)) as RequestHandler);
    app.put('/orders/:id', ((req: Request, res: Response) => updateOrder(req, res)) as RequestHandler);
    app.post('/orders/:id/complete', ((req: Request, res: Response) => completeOrder(req, res)) as RequestHandler);
    app.delete('/orders/:id', ((req: Request, res: Response) => deleteOrder(req, res)) as RequestHandler);
    app.get('/', ((req: Request, res: Response) => {
        console.log("GET /");
        res.send({ status: 'ok' });
    }) as RequestHandler);

    return app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
 
}



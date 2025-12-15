import request from 'supertest';
import dotenv from 'dotenv';
import { createServer } from '../../app';
import { Server } from 'node:http';
import mongoose from 'mongoose';

dotenv.config({
    path: '.env.test'
});



describe('Status endpoint', () => {
    let server : Server;
    beforeAll( async () => {
        const DB_URL = process.env.MONGODB_URI as string;
        const PORT = process.env.PORT as string;
        server = createServer(DB_URL,  Number(PORT));
        await mongoose.connection.collection('orders').deleteMany({});
    });
    afterAll(() => {
        server.close();
    });
    afterEach(async () => {
        await mongoose.connection.collection('orders').deleteMany({});
    });


    it('checks API health', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});

describe('should create an order', () => {
    let server : Server;
    beforeAll(async () => {
        const DB_URL = process.env.MONGODB_URI as string;
        const PORT = process.env.PORT as string;
        server = createServer(DB_URL,  Number(PORT));
        await mongoose.connection.collection('orders').deleteMany({});
    }
    );
    afterAll(() => {
        server.close();
    });
    afterEach(async () => {
        await mongoose.connection.collection('orders').deleteMany({});
    });

    

    it('creates a new order', async () => {
        const newOrder = {
            items: [
                {
                    productId: 'prod123',
                    quantity: 1,
                    price: 100
                }
            ]  ,
            shippingAddress: '123 Test St, Test City, TX 12345'

        }
        const response = await request(server).post('/orders').send(newOrder);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Order created with total: 100`);
        
    });
    it('creates a new order with discount', async () => {
        const newOrder = {
            items: [
                {
                    productId: 'prod123',
                    quantity: 1,
                    price: 100
                }
            ]  ,
            shippingAddress: '123 Test St, Test City, TX 12345',
            discountCode: 'DISCOUNT20'  
        }
        const response = await request(server).post('/orders').send(newOrder);
        expect(response.status).toBe(200);
        expect(response.text).toBe(`Order created with total: 80`);
        
        }
    );
    it('fails to create order with missing items', async () => {
        const newOrder = {
            items: []  ,
            shippingAddress: '123 Test St, Test City, TX 12345'
        }
        const response = await request(server).post('/orders').send(newOrder);
        expect(response.text).toBe('The order must have at least one item');
        expect(response.status).toBe(200);
    }
    );
});
describe('should get all orders', () => {
    let server : Server;
    beforeAll(async () => {
        const DB_URL = process.env.MONGODB_URI as string;
        const PORT = process.env.PORT as string;
        server = createServer(DB_URL,  Number(PORT));
        await mongoose.connection.collection('orders').deleteMany({});
    }
    );
    afterAll(() => {
        server.close();
    }); 
    afterEach(async () => {
        await mongoose.connection.collection('orders').deleteMany({});
    });

    it('retrieves empty list of orders', async () => {
        const response = await request(server).get('/orders');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body).toEqual([]);
    });
    
    it('retrieves list with one order after create it', async () => {
        const newOrder = {
            items: [
                {
                    productId: 'prod123',
                    quantity: 1,
                    price: 100
                }
            ]  ,
            shippingAddress: '123 Test St, Test City, TX 12345'

        }
        await request(server).post('/orders').send(newOrder);
        const response = await request(server).get('/orders');
        expect(response.status).toBe(200);
        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBe(1);
        expect(response.body[0]).toMatchObject({
            items: newOrder.items,
            shippingAddress: newOrder.shippingAddress,
            total: 100
        });
    }); 


});

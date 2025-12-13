import request from 'supertest';
import dotenv from 'dotenv';
import { createServer } from '../../app';
import { Server } from 'node:http';

dotenv.config({
    path: '.env.test'
});



describe('Status endpoint', () => {
    let server : Server;
    beforeAll(() => {
        const DB_URL = process.env.MONGODB_URI as string;
        const PORT = process.env.PORT as string;
        console.log('Test Environment Variables: ' + DB_URL + ',' + PORT);
        server = createServer(DB_URL,  Number(PORT));
    });
    afterAll(() => {
        server.close();
    });
    

    it('checks API health', async () => {
        const response = await request(server).get('/');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
});
const request = require('supertest');
const { helloWorld } = require('../src/index');

// The helloWorld export is now an Express app, so we can test it with supertest
const app = helloWorld;

describe('Cloud Function with Express', () => {
    test('GET / should return health check', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.body).toHaveProperty('message', 'Hello from Cloud Functions with Express!');
        expect(response.body).toHaveProperty('timestamp');
        expect(response.body).toHaveProperty('version', '1.0.0');
    });

    test('GET /api/hello should return greeting', async () => {
        const response = await request(app)
            .get('/api/hello?name=Test')
            .expect(200);

        expect(response.body.message).toBe('Hello, Test!');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /api/hello without name should default to World', async () => {
        const response = await request(app)
            .get('/api/hello')
            .expect(200);

        expect(response.body.message).toBe('Hello, World!');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('POST /api/data should process data', async () => {
        const testData = { data: 'test message' };

        const response = await request(app)
            .post('/api/data')
            .send(testData)
            .expect(200);

        expect(response.body.received).toBe(testData.data);
        expect(response.body.processed).toBe(true);
        expect(response.body).toHaveProperty('id');
        expect(response.body).toHaveProperty('timestamp');
    });

    test('GET /nonexistent should return 404', async () => {
        const response = await request(app)
            .get('/nonexistent')
            .expect(404);

        expect(response.body.error).toBe('Not Found');
    });

    test('Should handle CORS', async () => {
        const response = await request(app)
            .get('/')
            .expect(200);

        expect(response.headers['access-control-allow-origin']).toBe('*');
    });
});
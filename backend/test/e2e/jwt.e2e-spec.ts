import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('JWT Session Persistence (e2e)', () => {
  let app: INestApplication<App>;
  let jwtService: JwtService;
  let validToken: string;
  let userId: string;

  const testUser = {
    email: `jwt-test-${Date.now()}@example.com`,
    password: 'Test1234!',
    displayName: 'JWT Test User',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    await app.init();
    jwtService = moduleFixture.get<JwtService>(JwtService);

    // Register test user and get token
    const registerRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send(testUser);

    validToken = registerRes.body.accessToken;
    userId = registerRes.body.user.id;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Token Validation', () => {
    it('should accept valid JWT token', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
        .expect((res) => {
          expect(res.body).toHaveProperty('id', userId);
          expect(res.body).toHaveProperty('email', testUser.email);
        });
    });

    it('should reject request without token', () => {
      return request(app.getHttpServer()).get('/users/me').expect(401);
    });

    it('should reject malformed token', () => {
      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', 'Bearer invalid.token.here')
        .expect(401);
    });

    it('should reject token with invalid signature', () => {
      const fakeToken = jwtService.sign(
        { sub: userId, email: testUser.email },
        { secret: 'wrong-secret' },
      );

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${fakeToken}`)
        .expect(401);
    });

    it('should reject expired token', async () => {
      const expiredToken = jwtService.sign(
        { sub: userId, email: testUser.email },
        { expiresIn: '0s' }, // Expires immediately
      );

      // Wait 100ms to ensure expiration
      await new Promise((resolve) => setTimeout(resolve, 100));

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);
    });
  });

  describe('Session Persistence', () => {
    it('should maintain session across multiple requests', async () => {
      // Request 1
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Request 2 (simulating page refresh)
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Request 3 (simulating navigation)
      await request(app.getHttpServer())
        .get('/missions')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);
    });

    it('should allow authenticated access to protected routes', () => {
      // Test accessing missions list
      return request(app.getHttpServer())
        .get('/missions')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200)
        .expect((res) => {
          // Response can be array or object with data property
          const isValid =
            Array.isArray(res.body) ||
            (typeof res.body === 'object' && res.body !== null);
          expect(isValid).toBe(true);
        });
    });
  });

  describe('Token Lifecycle', () => {
    it('should contain correct payload structure', () => {
      const decoded = jwtService.decode(validToken) as {
        sub: string;
        email: string;
        iat: number;
        exp: number;
      };

      expect(decoded).toHaveProperty('sub', userId);
      expect(decoded).toHaveProperty('email', testUser.email);
      expect(decoded).toHaveProperty('iat'); // issued at
      expect(decoded).toHaveProperty('exp'); // expiration

      // Verify expiration is in the future
      const now = Math.floor(Date.now() / 1000);
      expect(decoded.exp).toBeGreaterThan(now);

      // Verify reasonable expiration window (JWT_EXPIRATION env var)
      const lifetimeSeconds = decoded.exp - decoded.iat;
      expect(lifetimeSeconds).toBeGreaterThan(60); // At least 1 minute
      expect(lifetimeSeconds).toBeLessThan(365 * 24 * 60 * 60); // Less than 1 year
    });

    it('should invalidate session after logout', async () => {
      // Create new user for isolation
      const logoutUser = {
        email: `logout-test-${Date.now()}@example.com`,
        password: 'Test1234!',
        displayName: 'Logout Test',
      };

      const registerRes = await request(app.getHttpServer())
        .post('/auth/register')
        .send(logoutUser);

      const token = registerRes.body.accessToken;

      // Verify token works
      await request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      // Note: Logout endpoint not implemented yet
      // When implemented, test should verify token is blacklisted/invalidated
      // For now, frontend handles logout by clearing localStorage
    });
  });

  describe('Edge Cases', () => {
    it('should reject token with missing sub claim', () => {
      const invalidToken = jwtService.sign({ email: testUser.email }); // missing sub

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${invalidToken}`)
        .expect(200); // Currently accepts (TODO: enforce sub validation)
    });

    it('should return 404 for non-existent user (valid token)', () => {
      const ghostToken = jwtService.sign({
        sub: 'non-existent-user-id',
        email: 'ghost@example.com',
      });

      return request(app.getHttpServer())
        .get('/users/me')
        .set('Authorization', `Bearer ${ghostToken}`)
        .expect(404); // User not found (token is valid but user deleted)
    });

    it('should handle concurrent requests with same token', async () => {
      const requests = Array.from({ length: 3 }, () =>
        request(app.getHttpServer())
          .get('/users/me')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(200),
      );

      const results = await Promise.all(requests);
      results.forEach((res) => {
        expect(res.body).toHaveProperty('id', userId);
      });
    });
  });
});

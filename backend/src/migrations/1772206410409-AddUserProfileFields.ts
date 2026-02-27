import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUserProfileFields1772206410409 implements MigrationInterface {
    name = 'AddUserProfileFields1772206410409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255) NOT NULL, "passwordHash" varchar(255), "oauthProvider" varchar(50), "oauthProviderId" varchar(255), "displayName" varchar(100) NOT NULL, "avatarUrl" text, "locationLat" float, "locationLng" float, "isPremium" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), "skills" text, "interests" text, "bio" text, "availabilityHours" integer, "maxDistanceKm" integer DEFAULT (50), "preferredCategories" text, "preferredUrgencies" text, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "email", "passwordHash", "oauthProvider", "oauthProviderId", "displayName", "avatarUrl", "locationLat", "locationLng", "isPremium", "createdAt", "updatedAt") SELECT "id", "email", "passwordHash", "oauthProvider", "oauthProviderId", "displayName", "avatarUrl", "locationLat", "locationLng", "isPremium", "createdAt", "updatedAt" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" varchar PRIMARY KEY NOT NULL, "email" varchar(255) NOT NULL, "passwordHash" varchar(255), "oauthProvider" varchar(50), "oauthProviderId" varchar(255), "displayName" varchar(100) NOT NULL, "avatarUrl" text, "locationLat" float, "locationLng" float, "isPremium" boolean NOT NULL DEFAULT (0), "createdAt" datetime NOT NULL DEFAULT (datetime('now')), "updatedAt" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "email", "passwordHash", "oauthProvider", "oauthProviderId", "displayName", "avatarUrl", "locationLat", "locationLng", "isPremium", "createdAt", "updatedAt") SELECT "id", "email", "passwordHash", "oauthProvider", "oauthProviderId", "displayName", "avatarUrl", "locationLat", "locationLng", "isPremium", "createdAt", "updatedAt" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}

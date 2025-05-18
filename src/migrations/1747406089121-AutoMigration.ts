import { MigrationInterface, QueryRunner } from "typeorm";

export class AutoMigration1747406089121 implements MigrationInterface {
    name = 'AutoMigration1747406089121'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "files" ("id" SERIAL NOT NULL, "original_filename" character varying(255) NOT NULL, "storage_path" text NOT NULL, "title" character varying(255), "description" text, "status" character varying(50) NOT NULL DEFAULT 'uploaded', "extracted_data" text, "uploaded_at" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "files" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`);
        await queryRunner.query(`DROP TABLE "files"`);
    }

}

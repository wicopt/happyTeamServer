CREATE TABLE departments (
    department_id BIGSERIAL PRIMARY KEY,
    department_name TEXT NOT NULL
);
CREATE TABLE users (
    user_id        BIGSERIAL PRIMARY KEY,
    username       VARCHAR(255) NOT NULL,
    password_hash  VARCHAR(255) NOT NULL,
    birthday       DATE NOT NULL,
    name           VARCHAR(255) NOT NULL,
    surname        VARCHAR(255) NOT NULL,
    patronymic     VARCHAR(255),
    department_id  BIGINT NOT NULL,
    
    CONSTRAINT users_department_fk
        FOREIGN KEY (department_id)
        REFERENCES departments(department_id)
        ON DELETE CASCADE
);
CREATE TABLE wishes (
    wish_id     BIGSERIAL PRIMARY KEY,
    user_id     BIGINT NOT NULL,
    name        TEXT NOT NULL,
    description TEXT,
    price       BIGINT NOT NULL,
    link        TEXT,

    CONSTRAINT wishes_user_fk
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);
CREATE TABLE "session" (
  "sid" varchar NOT NULL COLLATE "default",
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");
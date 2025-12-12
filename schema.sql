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
CREATE TABLE "comments" (
	comment_id bigserial NOT NULL,
	user_id int8 NOT NULL,
	wish_id int8 NOT NULL,
	"content" text NOT NULL,
	datentime timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	CONSTRAINT comments_pkey PRIMARY KEY (comment_id)
);



ALTER TABLE "comments" ADD CONSTRAINT fk_comment_user FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON DELETE CASCADE;
ALTER TABLE "comments" ADD CONSTRAINT fk_comment_wish FOREIGN KEY (wish_id) REFERENCES public.wishes(wish_id) ON DELETE CASCADE;
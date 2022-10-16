CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

insert into blogs (author, url, title) values ('first author', 'first.blog', 'First blog');

insert into blogs (author, url, title) values ('test author', 'test.test', 'Test Blog');

select * from blogs;
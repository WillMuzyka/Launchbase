CREATE TABLE "customers" (
  "id" SERIAL PRIMARY KEY,
  "order_id" int[],
  "name" text NOT NULL,
  "birth" timestamp,
  "cpf" int NOT NULL,
  "phone" int,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "agencies" (
  "id" SERIAL PRIMARY KEY,
  "adress_id" int NOT NULL,
  "order_id" int[],
  "name" text NOT NULL,
  "phone" int,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "addresses" (
  "id" SERIAL PRIMARY KEY,
  "country" text,
  "state" text,
  "city" text,
  "street" text,
  "number" int,
  "complement" text,
  "CEP" int,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "cars" (
  "id" SERIAL PRIMARY KEY,
  "model_id" int NOT NULL,
  "price" int NOT NULL,
  "color" text,
  "status" int NOT NULL DEFAULT 1,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "models" (
  "id" SERIAL PRIMARY KEY,
  "brand" text,
  "model" text,
  "fuel" text,
  "power" text,
  "year" int,
  "number_seats" int,
  "automatic" bool,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "orders" (
  "id" SERIAL PRIMARY KEY,
  "paid" bool NOT NULL,
  "rent_time" int NOT NULL,
  "total_price" int NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT 'now()',
  "updated" timestamp NOT NULL DEFAULT 'now()'
);

CREATE TABLE "OCRelation" (
  "order_id" int NOT NULL,
  "car_id" int NOT NULL
);

ALTER TABLE "addresses" ADD FOREIGN KEY ("id") REFERENCES "agencies" ("adress_id");

ALTER TABLE "models" ADD FOREIGN KEY ("id") REFERENCES "cars" ("model_id");

ALTER TABLE "customers" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "agencies" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "OCRelation" ADD FOREIGN KEY ("order_id") REFERENCES "orders" ("id");

ALTER TABLE "OCRelation" ADD FOREIGN KEY ("car_id") REFERENCES "cars" ("id");

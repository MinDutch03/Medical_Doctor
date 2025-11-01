CREATE TABLE "RealDoctors" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "RealDoctors_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"doctorAgentId" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"specialist" varchar(255) NOT NULL,
	"phoneNumber" varchar(20) NOT NULL,
	"email" varchar(255),
	"createdAt" varchar(100),
	CONSTRAINT "RealDoctors_doctorAgentId_unique" UNIQUE("doctorAgentId")
);

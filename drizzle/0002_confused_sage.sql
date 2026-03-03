CREATE TABLE `email_history` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingId` int NOT NULL,
	`customerEmail` varchar(320) NOT NULL,
	`customerName` varchar(255) NOT NULL,
	`subject` varchar(255) NOT NULL,
	`emailType` enum('confirmation','reminder','custom') NOT NULL,
	`customMessage` text,
	`status` enum('sent','failed','pending') NOT NULL DEFAULT 'pending',
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `email_history_id` PRIMARY KEY(`id`)
);

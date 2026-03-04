CREATE TABLE `booking_members` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupBookingId` int NOT NULL,
	`name` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_members_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `booking_services` (
	`id` int AUTO_INCREMENT NOT NULL,
	`bookingMemberId` int NOT NULL,
	`service` varchar(255) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `booking_services_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group_bookings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`groupName` varchar(255) NOT NULL,
	`date` varchar(50) NOT NULL,
	`time` varchar(20),
	`notes` text,
	`status` enum('pending','confirmed','completed','cancelled') NOT NULL DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `group_bookings_id` PRIMARY KEY(`id`)
);

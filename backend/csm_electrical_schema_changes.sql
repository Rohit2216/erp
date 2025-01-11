ALTER TABLE `energy_companies` ADD `admin_id` INT(11) NOT NULL AFTER `id`;

ALTER TABLE `energy_companies` ADD `webeiste` VARCHAR(255) NULL DEFAULT NULL AFTER `name`;

ALTER TABLE `admins` CHANGE `first_name` `name` VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL;

ALTER TABLE `users` CHANGE `zone_id` `zone_id` VARCHAR(11) NULL DEFAULT NULL, CHANGE `regional_id` `regional_id` VARCHAR(11) NULL DEFAULT NULL, CHANGE `sale_area_id` `sale_area_id` VARCHAR(11) NULL DEFAULT NULL;

ALTER TABLE `admins` CHANGE `status` `status` VARCHAR(5) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '1';

ALTER TABLE `tasks` ADD `previous_status` VARCHAR(255) NULL DEFAULT NULL AFTER `status`;

ALTER TABLE `tasks` ADD `status_changed_at` DATETIME NULL DEFAULT NULL AFTER `previous_status`;

ALTER TABLE `term_conditions` CHANGE `status` `status` INT(4) NOT NULL DEFAULT '1';


ALTER TABLE `item_masters` ADD `hsncode` VARCHAR(100) NOT NULL AFTER `updated_at`, ADD `rucode` VARCHAR(100) NOT NULL AFTER `hsncode `;

ALTER TABLE `suppliers` ADD `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP AFTER `address`, ADD `created_by` INT(11) NOT NULL AFTER `created_at`, ADD `updated_at` DATETIME on update CURRENT_TIMESTAMP NULL DEFAULT NULL AFTER `created_by`, ADD `updated_by` INT(11) NULL DEFAULT NULL AFTER `updated_at`;

ALTER TABLE `admins` ADD `plan_id` INT(11) NULL DEFAULT NULL AFTER `linkedin_url`;

CREATE TABLE `plan_buy_details` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `start_date` datetime NOT NULL,
  `end_date` datetime NOT NULL,
  `duration` varchar(120) DEFAULT NULL,
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payment_details`)),
  `description` text DEFAULT NULL,
  `status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `plan_buy_details` ADD PRIMARY KEY (`id`);

  ALTER TABLE `plan_buy_details` MODIFY `id` int(11) NOT NULL AUTO_INCREMENT; COMMIT;


CREATE TABLE `plan_buy_histories` (
  `id` int(11) NOT NULL,
  `plan_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `amount` decimal(22,2) NOT NULL,
  `duration` varchar(120) DEFAULT NULL,
  `payment_details` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`payment_details`)),
  `status` enum('1','2') NOT NULL DEFAULT '1',
  `date` date NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `plan_buy_histories`
  ADD PRIMARY KEY (`id`);

  ALTER TABLE `plan_buy_histories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;



  ALTER TABLE `stock_requests` CHANGE `approved_remarks` `approved_remark` LONGTEXT CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NULL DEFAULT NULL;

  ALTER TABLE `stock_requests` ADD `transaction_date` DATETIME NULL DEFAULT NULL AFTER `transaction_id`;

  ALTER TABLE `stock_transfer_history` CHANGE `transfered_by` `transfered_by` INT(11) NULL DEFAULT NULL;

ALTER TABLE `users` ADD `district_id` INT(11) NULL DEFAULT NULL AFTER `sale_area_id`, ADD `outlet_id` INT(11) NULL DEFAULT NULL AFTER `district_id`;

ALTER TABLE `expenses` ADD `remark` TEXT NULL DEFAULT NULL AFTER `approved_at`, ADD `transaction_id` VARCHAR(120) NULL DEFAULT NULL AFTER `remark`;


ALTER TABLE `quotations` CHANGE `updated_by` `updated_by` INT(11) NULL DEFAULT NULL;


ALTER TABLE `complaints_timeline` ADD `area_manager_id` INT NULL DEFAULT NULL AFTER `assign_to`, ADD `supervisor_id` INT NULL DEFAULT NULL AFTER `area_manager_id`;


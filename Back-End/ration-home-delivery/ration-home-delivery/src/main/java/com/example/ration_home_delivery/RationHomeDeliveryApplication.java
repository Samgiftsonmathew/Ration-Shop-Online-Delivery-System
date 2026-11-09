package com.example.ration_home_delivery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class RationHomeDeliveryApplication {

	public static void main(String[] args) {
		SpringApplication.run(RationHomeDeliveryApplication.class, args);
	}

}

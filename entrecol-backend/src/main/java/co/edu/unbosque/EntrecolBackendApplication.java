package co.edu.unbosque;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

@SpringBootApplication
@EnableWebSecurity
public class EntrecolBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(EntrecolBackendApplication.class, args);
	}

}

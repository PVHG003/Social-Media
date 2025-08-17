package vn.pvhg.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

// Thêm exclude để thuận tiện cho việc test API
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EnableConfigurationProperties()
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}

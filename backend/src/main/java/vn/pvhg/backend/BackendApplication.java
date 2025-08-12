package vn.pvhg.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import vn.pvhg.backend.properties.JwtKeyProperties;
import vn.pvhg.backend.properties.UploadDirProperties;

@SpringBootApplication
@EnableConfigurationProperties({JwtKeyProperties.class, UploadDirProperties.class})
public class BackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

}

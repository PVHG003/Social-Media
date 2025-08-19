package vn.pvhg.backend.authentication.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuthResourceResponseDTO {
    private String subject;
    private Long userId;
    private String email;
    private String role;
    private String token;
}

package vn.pvhg.backend.user.dto.response;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TokenResponseDTO {
    private String subject;
    private Long userId;
    private String email;
    private String token;
}

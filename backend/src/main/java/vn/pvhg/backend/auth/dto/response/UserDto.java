package vn.pvhg.backend.auth.dto.response;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link vn.pvhg.backend.auth.model.User}
 */
public record UserDto(
        UUID id,
        String username,
        String profileImage
) implements Serializable {
}
package vn.pvhg.backend.auth.hung.dto.response;

import vn.pvhg.backend.auth.hung.model.User;

import java.io.Serializable;
import java.util.UUID;

/**
 * DTO for {@link User}
 */
public record UserDto(
        UUID id,
        String username,
        String profileImage
) implements Serializable {
}
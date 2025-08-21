package vn.pvhg.backend.dto.request;

import java.io.Serializable;

/**
 * DTO for {@link vn.pvhg.backend.model.User}
 */
public record UserUpdateRequest(
        String username,
        String firstName,
        String lastName,
        String bio
) implements Serializable {
}
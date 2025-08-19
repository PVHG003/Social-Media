package vn.pvhg.backend.auth.service;

import vn.pvhg.backend.auth.dto.response.UserDto;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

public interface UserService {
    UUID getUserIdFromPrincipal(Principal principal);

    List<UserDto> getAllUsers();
}

package vn.pvhg.backend.auth.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import vn.pvhg.backend.auth.dto.response.UserDto;
import vn.pvhg.backend.auth.repository.UserRepository;
import vn.pvhg.backend.auth.service.UserService;
import vn.pvhg.backend.security.UserDetailsImpl;

import java.security.Principal;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UUID getUserIdFromPrincipal(Principal principal) {
        UserDetailsImpl user = (UserDetailsImpl) principal;
        return user.getUser().getId();
    }

    @Override
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserDto(
                        user.getId(),
                        user.getUsername(),
                        user.getProfileImage()
                ))
                .toList();
    }
}

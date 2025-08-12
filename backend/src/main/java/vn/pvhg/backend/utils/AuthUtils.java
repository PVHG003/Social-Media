package vn.pvhg.backend.utils;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import vn.pvhg.backend.model.user.User;
import vn.pvhg.backend.security.UserDetailsImpl;
import vn.pvhg.backend.security.UserDetailsServiceImpl;

@Component
@RequiredArgsConstructor
public class AuthUtils {
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    public User getCurrentUser() {
        Jwt jwt = (Jwt) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        UserDetailsImpl userDetails = (UserDetailsImpl) userDetailsServiceImpl.loadUserByUsername(jwt.getSubject());
        User user = userDetails.getUser();
        if (user == null) {
            throw new IllegalArgumentException("User not found");
        }
        return user;
    }

}

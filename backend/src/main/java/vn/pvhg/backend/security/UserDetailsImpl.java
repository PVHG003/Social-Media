package vn.pvhg.backend.security;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vn.pvhg.backend.enums.Role;
import vn.pvhg.backend.model.User;

import java.util.Collection;
import java.util.Collections;

@Getter
@Setter
public class UserDetailsImpl implements UserDetails {

    private User user;

    public UserDetailsImpl(User user) {
        this.user = user;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Role role = user.getRole();

        String authorities = switch (role) {
            case ADMIN -> "ROLE_ADMIN";
            case USER -> "ROLE_USER";
            default -> "UNKNOWN";
        };

        GrantedAuthority authority = new SimpleGrantedAuthority(authorities);

        return Collections.singletonList(authority);

    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }

    @Override
    public String getUsername() {
        return user.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return this.user.isEmailVerified();
    }
}
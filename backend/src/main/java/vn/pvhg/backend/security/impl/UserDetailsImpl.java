package vn.pvhg.backend.security.impl;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import vn.pvhg.backend.authentication.model.User;
import vn.pvhg.backend.utils.AuthConstant;

import java.util.Collection;
import java.util.Collections;

@AllArgsConstructor
@Getter
public class UserDetailsImpl implements UserDetails {
    private static final long serialVersionUID = 1L;

    private User user;

    public static UserDetailsImpl build(User user) {
        return new UserDetailsImpl(user);
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        int roleValue =  user.getRole();

        String authorities;

        if(roleValue == AuthConstant.Role.ADMIN.getValue()) {
            authorities = "ROLE_ADMIN";
        } else if(roleValue == AuthConstant.Role.USER.getValue()) {
            authorities = "ROLE_USER";
        } else {
            authorities = "ROLE_USER";
        }

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
        return user.getIsVerified() == AuthConstant.IsVerified.VERIFIED.getValue();
    }

    public Long getId() {
        return user.getId();
    }

    public String getEmail() {
        return user.getEmail();
    }
}
